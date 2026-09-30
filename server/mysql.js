import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MySQL Connection Configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'resq_disaster_db',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
};

let pool = null;
let isConnected = false;

/**
 * Initializes the MySQL pool and validates the connection.
 * If the target database doesn't exist, it attempts to create it using a root connection.
 */
export async function initMySQL() {
  try {
    // 1. First attempt to connect or verify the target database
    const adminConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await adminConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await adminConnection.end();

    // 2. Create the connection pool with the specific database
    pool = mysql.createPool(dbConfig);

    // Verify connectivity with a ping
    const connection = await pool.getConnection();
    console.log(`🐬 [MySQL] Successfully connected to MySQL database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
    connection.release();

    // 3. Execute Schema Migration if needed
    await runSchemaMigration();

    isConnected = true;
    return true;
  } catch (err) {
    console.warn(`⚠️ [MySQL] Connection could not be established: ${err.message}`);
    console.warn(`ℹ️ [MySQL] System is safely using resilient local storage mode. To activate MySQL, configure MYSQL_HOST/MYSQL_USER/MYSQL_PASSWORD in .env and start MySQL service.`);
    isConnected = false;
    return false;
  }
}

/**
 * Runs server/schema.sql to create missing tables and seed initial records.
 */
export async function runSchemaMigration() {
  if (!pool) return;
  try {
    const candidateDatabasePath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaPath = fs.existsSync(candidateDatabasePath)
      ? candidateDatabasePath
      : path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) return;

    const sqlContent = fs.readFileSync(schemaPath, 'utf8');
    // Split statements safely by semicolon (excluding comments)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));

    const connection = await pool.getConnection();
    try {
      for (const statement of statements) {
        if (statement.toLowerCase().startsWith('use ')) continue;
        await connection.query(statement);
      }
      console.log('✅ [MySQL] Schema migration and table verification completed successfully.');
    } finally {
      connection.release();
    }
  } catch (migrationErr) {
    console.warn('⚠️ [MySQL] Notice during schema migration:', migrationErr.message);
  }
}

export function isMySQLActive() {
  return isConnected && pool !== null;
}

// =============================================================================
// MySQL Data Access Layer
// =============================================================================

// Alerts
export async function getMySQLAlerts() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM alerts ORDER BY timestamp DESC');
  return rows;
}

export async function insertMySQLAlert(alert) {
  if (!pool) return null;
  const sql = `
    INSERT INTO alerts (id, type, title, location, severity, timestamp, description, action_required, impacted_people, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await pool.query(sql, [
    alert.id,
    alert.type,
    alert.title,
    alert.location,
    alert.severity,
    alert.timestamp ? new Date(alert.timestamp) : new Date(),
    alert.description || '',
    alert.action_required || '',
    alert.impacted_people || '~1,000',
    alert.status || 'ACTIVE',
  ]);
  return alert;
}

export async function updateMySQLAlertStatus(id, status) {
  if (!pool) return null;
  await pool.query('UPDATE alerts SET status = ? WHERE id = ?', [status, id]);
  const [rows] = await pool.query('SELECT * FROM alerts WHERE id = ?', [id]);
  return rows[0] || null;
}

// Devices / Rescue Teams
export async function getMySQLDevices() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM devices ORDER BY id ASC');
  return rows.map(d => ({
    ...d,
    lat: parseFloat(d.lat),
    lng: parseFloat(d.lng),
  }));
}

export async function insertMySQLDevice(device) {
  if (!pool) return null;
  const sql = `
    INSERT INTO devices (id, name, type, status, lat, lng, battery, personnel, vehicle, assigned_zone, contact, last_ping)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      status = VALUES(status),
      lat = VALUES(lat),
      lng = VALUES(lng),
      last_ping = VALUES(last_ping)
  `;
  await pool.query(sql, [
    device.id,
    device.name,
    device.type,
    device.status,
    device.lat,
    device.lng,
    device.battery || 100,
    device.personnel || 0,
    device.vehicle || '',
    device.assigned_zone || '',
    device.contact || '',
    device.last_ping || 'Just now',
  ]);
  return device;
}

export async function updateMySQLDevice(id, updateData) {
  if (!pool) return null;
  const fields = [];
  const values = [];

  if (updateData.status !== undefined) {
    fields.push('status = ?');
    values.push(updateData.status);
  }
  if (updateData.battery !== undefined) {
    fields.push('battery = ?');
    values.push(updateData.battery);
  }
  if (updateData.lat !== undefined) {
    fields.push('lat = ?');
    values.push(updateData.lat);
  }
  if (updateData.lng !== undefined) {
    fields.push('lng = ?');
    values.push(updateData.lng);
  }
  if (updateData.last_ping !== undefined) {
    fields.push('last_ping = ?');
    values.push(updateData.last_ping);
  }

  if (fields.length > 0) {
    values.push(id);
    await pool.query(`UPDATE devices SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  const [rows] = await pool.query('SELECT * FROM devices WHERE id = ?', [id]);
  return rows[0] || null;
}

// Hospitals
export async function getMySQLHospitals() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM hospitals ORDER BY distance ASC');
  return rows.map(h => ({
    ...h,
    lat: parseFloat(h.lat),
    lng: parseFloat(h.lng),
  }));
}

// Resources
export async function getMySQLResources() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM resources ORDER BY id ASC');
  return rows;
}

// SOS Events
export async function insertMySQLSOSEvent(sos) {
  if (!pool) return null;
  const sql = `
    INSERT INTO sos_events (id, user_id, type, notes, lat, lng, address, status, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await pool.query(sql, [
    sos.id,
    sos.user_id || 'u-123',
    sos.type || 'EMERGENCY',
    sos.notes || '',
    sos.lat || 18.5204,
    sos.lng || 73.8567,
    sos.address || 'Central ResQ Grid',
    sos.status || 'DISPATCHING_RESCUE',
    sos.timestamp ? new Date(sos.timestamp) : new Date(),
  ]);
  return sos;
}

export async function cancelMySQLSOSEvent(id) {
  if (!pool) return null;
  await pool.query('UPDATE sos_events SET status = ? WHERE id = ?', ['CANCELLED', id]);
  const [rows] = await pool.query('SELECT * FROM sos_events WHERE id = ?', [id]);
  return rows[0] || null;
}

// Users (Citizen & Rescue Team)
export async function getMySQLUserByEmailOrBadge(identifier, role) {
  if (!pool) return null;
  const sql = role === 'RESCUE_TEAM'
    ? 'SELECT * FROM users WHERE badge_id = ? OR email = ? LIMIT 1'
    : 'SELECT * FROM users WHERE email = ? LIMIT 1';
  const [rows] = await pool.query(sql, [identifier, identifier]);
  return rows[0] || null;
}

export async function createMySQLUser(user) {
  if (!pool) return null;
  const sql = `
    INSERT INTO users (id, name, email, role, phone, blood_type, badge_id, unit, sector, title, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE name = VALUES(name), updated_at = NOW()
  `;
  await pool.query(sql, [
    user.id,
    user.name,
    user.email,
    user.role || 'CITIZEN',
    user.phone || null,
    user.blood_type || null,
    user.badge_id || null,
    user.unit || null,
    user.sector || null,
    user.title || null,
    user.status || 'ACTIVE',
  ]);
  return user;
}

export default {
  initMySQL,
  isMySQLActive,
  getAlerts: getMySQLAlerts,
  insertAlert: insertMySQLAlert,
  updateAlertStatus: updateMySQLAlertStatus,
  getDevices: getMySQLDevices,
  insertDevice: insertMySQLDevice,
  updateDevice: updateMySQLDevice,
  getHospitals: getMySQLHospitals,
  getResources: getMySQLResources,
  insertSOSEvent: insertMySQLSOSEvent,
  cancelSOSEvent: cancelMySQLSOSEvent,
  getUserByEmailOrBadge: getMySQLUserByEmailOrBadge,
  createUser: createMySQLUser,
};
