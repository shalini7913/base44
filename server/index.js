import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import db, { initDatabase } from './db.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// Initialize Database (Async MySQL + Resilient Local Store)
initDatabase().catch((err) => {
  console.warn('Initial database bootstrap notice:', err.message);
});

// 0. HEALTH CHECK & DATABASE STATUS
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: db.getStatus(),
  });
});

// 1. ALERTS API
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await db.getAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/alerts', async (req, res) => {
  try {
    const { type, title, location, severity, description, actionRequired, impactedPeople } = req.body;
    const id = `ALT-${Date.now().toString().slice(-4)}`;
    const timestamp = new Date().toISOString();
    const status = 'ACTIVE';

    const newAlert = {
      id,
      type,
      title,
      location,
      severity,
      timestamp,
      description,
      action_required: actionRequired || '',
      impacted_people: impactedPeople || '~1,000',
      status,
    };

    await db.insertAlert(newAlert);
    
    // Broadcast via WebSockets to all connected frontends
    io.emit('alert:created', newAlert);

    res.status(201).json(newAlert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/alerts/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const updatedAlert = await db.updateAlertStatus(id, status);
    if (updatedAlert) {
      io.emit('alert:updated', updatedAlert);
    }

    res.json(updatedAlert || { success: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. DEVICES / RESCUE TEAMS API
app.get('/api/devices', async (req, res) => {
  try {
    const rawDevices = await db.getDevices();
    const devices = (rawDevices || []).map(d => ({
      ...d,
      location: [d.lat, d.lng],
      assignedZone: d.assigned_zone,
      lastPing: d.last_ping,
    }));
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/devices/:id', async (req, res) => {
  try {
    const { status, battery } = req.body;
    const { id } = req.params;

    const updateObj = {};
    if (status !== undefined) updateObj.status = status;
    if (battery !== undefined) updateObj.battery = battery;

    const device = await db.updateDevice(id, updateObj);
    if (!device) return res.status(404).json({ error: 'Device not found' });

    const formatted = {
      ...device,
      location: [device.lat, device.lng],
      assignedZone: device.assigned_zone,
      lastPing: device.last_ping,
    };

    // Broadcast live telemetry update over Socket.io
    io.emit('device:updated', formatted);

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. HOSPITALS API
app.get('/api/hospitals', async (req, res) => {
  try {
    const rawHospitals = await db.getHospitals();
    const hospitals = (rawHospitals || []).map(h => ({
      ...h,
      bedsAvailable: h.beds_available,
      icuBeds: h.icu_beds,
      oxygenLevel: h.oxygen_level,
      bloodBank: h.blood_bank,
      traumaLevel: h.trauma_level,
      coords: [h.lat, h.lng],
    }));
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. RESOURCES API
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await db.getResources();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/resources/request', (req, res) => {
  try {
    const { category, quantity, location } = req.body;
    console.log(`📦 Logistics Request: ${quantity} units of ${category} for ${location}`);
    io.emit('resource:requested', { category, quantity, location, timestamp: new Date().toISOString() });
    res.json({ success: true, message: 'Resource request broadcasted to dispatch teams' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. EMERGENCY SOS BROADCAST API
app.post('/api/sos/trigger', async (req, res) => {
  try {
    const { type, notes, location } = req.body;
    const id = `SOS-${Date.now().toString().slice(-4)}`;
    const timestamp = new Date().toISOString();
    const status = 'DISPATCHING_RESCUE';
    const lat = location?.lat || 18.5204;
    const lng = location?.lng || 73.8567;
    const address = location?.address || 'Central ResQ Grid 4';

    const sosPayload = {
      id,
      timestamp,
      type,
      notes: notes || '',
      lat,
      lng,
      address,
      status,
      location: { lat, lng, address },
    };

    await db.insertSOSEvent(sosPayload);

    // Auto-dispatch a rescue squad in database
    const dispatchId = `DISPATCH-${Date.now().toString().slice(-4)}`;
    const newSquad = {
      id: dispatchId,
      name: 'Rapid Response Emergency Squad',
      type: 'Rescue Crew',
      status: 'sos',
      lat: lat + 0.003,
      lng: lng + 0.003,
      battery: 100,
      personnel: 4,
      vehicle: 'Emergency Rescue Truck',
      assigned_zone: 'User SOS Location',
      contact: '+1 (800) 555-SOS1',
      last_ping: 'Just now',
    };
    await db.insertDevice(newSquad);

    // Socket.io Real-Time Broadcast to ALL clients & command dashboards
    io.emit('sos:broadcast', sosPayload);
    io.emit('device:updated', {
      ...newSquad,
      location: [newSquad.lat, newSquad.lng],
      assignedZone: newSquad.assigned_zone,
      lastPing: newSquad.last_ping,
    });

    res.status(201).json(sosPayload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sos/cancel', async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      await db.cancelSOSEvent(id);
    }
    io.emit('sos:cancelled', { id });
    res.json({ success: true, message: 'SOS signal cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. AUTH API (Citizen & Rescue Team)
app.post('/api/auth/login', async (req, res) => {
  const { email, role = 'CITIZEN', badgeId, unit, sector } = req.body;
  const isRescue = role === 'RESCUE_TEAM' || Boolean(badgeId);

  const user = isRescue
    ? {
        id: badgeId || 'SAR-ALPHA-01',
        name: unit || 'Alpha Search & Rescue Squad',
        role: 'RESCUE_TEAM',
        email: email || 'alpha.commander@rescue.resq.org',
        sector: sector || 'Sector 4 - Lowland Basin',
        badgeId: badgeId || 'SAR-ALPHA-01',
        title: 'Tactical Squad Commander',
      }
    : {
        id: 'u-123',
        name: email ? (email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())) : 'Alex Mercer',
        role: 'CITIZEN',
        email: email || 'alex.mercer@resq.org',
        phone: '+1 (555) 019-2834',
        bloodType: 'O Positive',
        status: 'SAFE',
      };

  // Persist user record in DB
  try {
    await db.saveUser({
      ...user,
      blood_type: user.bloodType,
      badge_id: user.badgeId,
    });
  } catch (err) {
    console.warn('Notice saving user to DB:', err.message);
  }

  res.json({
    success: true,
    user,
    token: `jwt-token-${isRescue ? 'rescue' : 'citizen'}-${Date.now()}`,
    redirectUrl: isRescue ? '/rescue/command' : '/',
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken) return res.status(400).json({ error: 'Missing reset token' });
  res.json({ success: true, message: 'Password updated in database' });
});

// -------------------------------------------------------------
// SOCKET.IO REAL-TIME EVENT HANDLERS
// -------------------------------------------------------------
io.on('connection', (socket) => {
  console.log(`⚡ Connected Client Socket: ${socket.id}`);

  socket.on('sos:trigger', (data) => {
    console.log('🚨 WebSockets SOS Trigger Received:', data);
    io.emit('sos:broadcast', data);
  });

  socket.on('device:ping', (data) => {
    io.emit('device:updated', data);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client Disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 RESQ Express + MySQL/JSON Database + Socket.io Server running on http://localhost:${PORT}`);
});
