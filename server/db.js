import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysqlLayer, { initMySQL, isMySQLActive } from './mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, 'resq-db.json');

const INITIAL_DATA = {
  alerts: [
    {
      id: 'ALT-101',
      type: 'flood',
      title: 'Severe River Inundation Alert - Sector 4',
      location: 'Mula River Basin North',
      severity: 'Critical',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      description: 'Water level risen 3.4 meters above safety threshold. High current flow towards Lowland Colony.',
      action_required: 'Evacuate to Sector 4 Community Shelter immediately. Avoid underpasses.',
      impacted_people: '~14,200',
      status: 'ACTIVE',
    },
    {
      id: 'ALT-102',
      type: 'fire',
      title: 'Chemical Tanker Explosion & Smoke Cloud',
      location: 'Industrial Zone Phase 2',
      severity: 'Extreme',
      timestamp: new Date(Date.now() - 42 * 60000).toISOString(),
      description: 'Hazardous gas leak spreading Eastward at 18 km/h. Toxic air index 410.',
      action_required: 'Seal windows, turn off air ducts. Respirators required within 2km radius.',
      impacted_people: '~8,500',
      status: 'ACTIVE',
    },
    {
      id: 'ALT-103',
      type: 'landslide',
      title: 'Ghat Road Hill Collapse Risk',
      location: 'Western Bypass Highway KM 14',
      severity: 'Medium',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      description: 'Debris flow blocked 2 lanes. Structural instability detected on hillside.',
      action_required: 'Use alternative Express Bypass Route B. Rescue crews clearing debris.',
      impacted_people: '~3,100',
      status: 'MONITORING',
    },
    {
      id: 'ALT-104',
      type: 'earthquake',
      title: 'Magnitude 4.8 Seismic Aftershock',
      location: 'Eastern Faultline Belt',
      severity: 'High',
      timestamp: new Date(Date.now() - 210 * 60000).toISOString(),
      description: 'Tremors felt across 12 residential blocks. Minor structural cracks reported.',
      action_required: 'Inspect gas pipelines. Stay clear of elevated bridges and glass facades.',
      impacted_people: '~32,000',
      status: 'ACTIVE',
    },
  ],
  devices: [
    { id: 'TEAM-ALPHA', name: 'Alpha Search & Rescue Unit', type: 'Rescue Crew', status: 'sos', lat: 18.5280, lng: 73.8520, battery: 88, personnel: 8, vehicle: 'Amphibious All-Terrain Truck', assigned_zone: 'Sector 4 Riverbank', contact: '+1 (800) 555-0199', last_ping: '2 mins ago' },
    { id: 'DRONE-01', name: 'SkyScout Thermal Drone #1', type: 'UAV Aerial Recon', status: 'assistance', lat: 18.5140, lng: 73.8620, battery: 64, personnel: 0, vehicle: 'Thermal Quadcopter', assigned_zone: 'Industrial Zone Phase 2', contact: 'Telemetry Mesh 915MHz', last_ping: '30 sec ago' },
    { id: 'TEAM-BRAVO', name: 'Bravo Paramedic Squad', type: 'Medical Response', status: 'safe', lat: 18.5350, lng: 73.8450, battery: 95, personnel: 5, vehicle: 'Mobile Intensive Care Van', assigned_zone: 'North Emergency Camp', contact: '+1 (800) 555-0144', last_ping: '1 min ago' },
    { id: 'BOAT-03', name: 'AquaSwift Power Boat #3', type: 'Water Rescue', status: 'sos', lat: 18.5220, lng: 73.8480, battery: 72, personnel: 4, vehicle: 'High-speed Rigid Inflatable', assigned_zone: 'Mula Bridge Submerged Area', contact: '+1 (800) 555-0182', last_ping: 'Just now' },
    { id: 'BEACON-88', name: 'Community SOS Beacon #88', type: 'Fixed IoT Node', status: 'offline', lat: 18.5080, lng: 73.8400, battery: 12, personnel: 0, vehicle: 'Solar Relay Post', assigned_zone: 'Old Town Square', contact: 'LoRa Gateway', last_ping: '45 mins ago' },
  ],
  hospitals: [
    { id: 'HOSP-01', name: 'Apex Trauma & Disaster Medical Center', address: '102 Emergency Ave, Central District', distance: '1.4 km', beds_available: 34, icu_beds: 8, oxygen_level: '98%', blood_bank: 'O+ A+ B+ AB- In Stock', trauma_level: 'Level 1 Emergency Care', phone: '+1 (800) 911-APEX', status: 'OPERATIONAL', lat: 18.5250, lng: 73.8610 },
    { id: 'HOSP-02', name: 'Metro General Red Cross Hospital', address: '45 Relief Boulevard, East Division', distance: '3.2 km', beds_available: 12, icu_beds: 2, oxygen_level: '85%', blood_bank: 'Critical Need O-', trauma_level: 'Level 2 Emergency Care', phone: '+1 (800) 911-METRO', status: 'HIGH OCCUPANCY', lat: 18.5120, lng: 73.8710 },
    { id: 'HOSP-03', name: 'Field Medical Emergency Unit #4', address: 'Sector 4 High School Ground Base', distance: '0.8 km', beds_available: 50, icu_beds: 10, oxygen_level: '100%', blood_bank: 'Emergency Plasma Stock', trauma_level: 'Mobile Field Surgery', phone: '+1 (800) 911-FIELD4', status: 'DISASTER FIELD BASE', lat: 18.5310, lng: 73.8490 },
  ],
  resources: [
    { id: 'RES-01', category: 'Medical Kits', quantity: 450, unit: 'Boxes', status: 'Sufficient', location: 'Central Warehouse A' },
    { id: 'RES-02', category: 'Clean Drinking Water', quantity: 12000, unit: 'Liters', status: 'High Demand', location: 'Sector 4 Base' },
    { id: 'RES-03', category: 'Inflatable Life Boats', quantity: 18, unit: 'Vessels', status: 'Deployed', location: 'Riverfront Hub' },
    { id: 'RES-04', category: 'Diesel Power Generators', quantity: 24, unit: 'Units', status: 'Sufficient', location: 'Depot South' },
    { id: 'RES-05', category: 'Rations & Ready Meals', quantity: 8500, unit: 'Packs', status: 'Dispatching', location: 'Red Cross Center' },
    { id: 'RES-06', category: 'Thermal Blankets', quantity: 3200, unit: 'Units', status: 'Low Stock', location: 'Stadium Shelter' },
  ],
  sos_events: [],
};

class UnifiedDatabase {
  constructor() {
    this.data = INITIAL_DATA;
    this.loadJSON();
  }

  loadJSON() {
    try {
      if (fs.existsSync(dbFilePath)) {
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        this.data = JSON.parse(raw);
        console.log('📂 Loaded RESQ Local Cache Database from:', dbFilePath);
      } else {
        this.saveJSON();
        console.log('🌱 Created & Seeded RESQ Local Cache Database:', dbFilePath);
      }
    } catch (err) {
      console.warn('Failed to load JSON database file, using in-memory state:', err);
      this.data = INITIAL_DATA;
    }
  }

  saveJSON() {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to save JSON database:', err);
    }
  }

  getStatus() {
    const isMySQL = isMySQLActive();
    return {
      engine: isMySQL ? 'MySQL' : 'Local File JSON / Resilient Mode',
      connected: isMySQL,
      database: isMySQL ? (process.env.MYSQL_DATABASE || 'resq_disaster_db') : dbFilePath,
    };
  }

  // Alerts
  async getAlerts() {
    if (isMySQLActive()) {
      try {
        const rows = await mysqlLayer.getAlerts();
        if (rows && rows.length > 0) return rows;
      } catch (err) {
        console.warn('MySQL getAlerts error, using local store:', err.message);
      }
    }
    return this.data.alerts;
  }

  async insertAlert(alert) {
    if (isMySQLActive()) {
      try {
        await mysqlLayer.insertAlert(alert);
      } catch (err) {
        console.warn('MySQL insertAlert error, saving locally:', err.message);
      }
    }
    this.data.alerts.unshift(alert);
    this.saveJSON();
    return alert;
  }

  async updateAlertStatus(id, status) {
    let updatedAlert = null;
    if (isMySQLActive()) {
      try {
        updatedAlert = await mysqlLayer.updateAlertStatus(id, status);
      } catch (err) {
        console.warn('MySQL updateAlertStatus error, updating locally:', err.message);
      }
    }
    const alert = this.data.alerts.find(a => a.id === id);
    if (alert) {
      alert.status = status;
      this.saveJSON();
      return alert;
    }
    return updatedAlert;
  }

  // Devices
  async getDevices() {
    if (isMySQLActive()) {
      try {
        const rows = await mysqlLayer.getDevices();
        if (rows && rows.length > 0) return rows;
      } catch (err) {
        console.warn('MySQL getDevices error, using local store:', err.message);
      }
    }
    return this.data.devices;
  }

  async insertDevice(device) {
    if (isMySQLActive()) {
      try {
        await mysqlLayer.insertDevice(device);
      } catch (err) {
        console.warn('MySQL insertDevice error, saving locally:', err.message);
      }
    }
    this.data.devices.unshift(device);
    this.saveJSON();
    return device;
  }

  async updateDevice(id, updateData) {
    let updatedDevice = null;
    if (isMySQLActive()) {
      try {
        updatedDevice = await mysqlLayer.updateDevice(id, updateData);
      } catch (err) {
        console.warn('MySQL updateDevice error, updating locally:', err.message);
      }
    }
    const device = this.data.devices.find(d => d.id === id);
    if (device) {
      Object.assign(device, updateData);
      this.saveJSON();
      return device;
    }
    return updatedDevice;
  }

  // Hospitals
  async getHospitals() {
    if (isMySQLActive()) {
      try {
        const rows = await mysqlLayer.getHospitals();
        if (rows && rows.length > 0) return rows;
      } catch (err) {
        console.warn('MySQL getHospitals error, using local store:', err.message);
      }
    }
    return this.data.hospitals;
  }

  // Resources
  async getResources() {
    if (isMySQLActive()) {
      try {
        const rows = await mysqlLayer.getResources();
        if (rows && rows.length > 0) return rows;
      } catch (err) {
        console.warn('MySQL getResources error, using local store:', err.message);
      }
    }
    return this.data.resources;
  }

  // SOS Events
  async insertSOSEvent(sos) {
    if (isMySQLActive()) {
      try {
        await mysqlLayer.insertSOSEvent(sos);
      } catch (err) {
        console.warn('MySQL insertSOSEvent error, saving locally:', err.message);
      }
    }
    this.data.sos_events.unshift(sos);
    this.saveJSON();
    return sos;
  }

  async cancelSOSEvent(id) {
    let result = null;
    if (isMySQLActive()) {
      try {
        result = await mysqlLayer.cancelSOSEvent(id);
      } catch (err) {
        console.warn('MySQL cancelSOSEvent error, cancelling locally:', err.message);
      }
    }
    const sos = this.data.sos_events.find(s => s.id === id);
    if (sos) {
      sos.status = 'CANCELLED';
      this.saveJSON();
      return sos;
    }
    return result;
  }

  // Users
  async getUserByEmailOrBadge(identifier, role) {
    if (isMySQLActive()) {
      try {
        return await mysqlLayer.getUserByEmailOrBadge(identifier, role);
      } catch (err) {
        console.warn('MySQL getUserByEmailOrBadge error:', err.message);
      }
    }
    return null;
  }

  async saveUser(user) {
    if (isMySQLActive()) {
      try {
        return await mysqlLayer.createUser(user);
      } catch (err) {
        console.warn('MySQL saveUser error:', err.message);
      }
    }
    return user;
  }
}

export const db = new UnifiedDatabase();

export async function initDatabase() {
  db.loadJSON();
  // Asynchronously attempt MySQL initialization
  await initMySQL();
}

export default db;
