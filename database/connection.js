import mysql from 'mysql2/promise';

/**
 * MySQL Connection Pool Configuration
 * Defaults to localhost:3306, user: root, password: '' (standard XAMPP / local dev default)
 */
export const poolConfig = {
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

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(poolConfig);
  }
  return pool;
}

export async function testConnection() {
  try {
    const currentPool = getPool();
    const conn = await currentPool.getConnection();
    conn.release();
    return true;
  } catch (err) {
    return false;
  }
}

export default {
  getPool,
  testConnection,
  poolConfig,
};
