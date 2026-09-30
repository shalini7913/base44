import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'resq_disaster_db',
};

async function setupDatabase() {
  console.log('----------------------------------------------------');
  console.log('🐬 Base44 ResQ Network - MySQL Database Initializer');
  console.log('----------------------------------------------------');
  console.log(`Connecting to MySQL host: ${dbConfig.host}:${dbConfig.port} as user: ${dbConfig.user}...`);

  try {
    // 1. Connect without selecting database
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true,
    });

    console.log('✅ Connected to MySQL server.');

    // 2. Read schema.sql
    const schemaFile = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaFile)) {
      throw new Error(`Schema file not found at: ${schemaFile}`);
    }

    const sql = fs.readFileSync(schemaFile, 'utf8');
    console.log(`📦 Running schema definitions from: ${schemaFile}...`);

    await connection.query(sql);

    console.log('✅ MySQL Database and tables initialized successfully!');
    console.log(`🎉 Database: "${dbConfig.database}" is ready with seeded data.`);

    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to initialize MySQL database:');
    console.error(`Error: ${err.message}`);
    console.log('\nTroubleshooting tips:');
    console.log('1. Ensure your MySQL server (or XAMPP/WAMP/Docker) is running.');
    console.log('2. Verify MYSQL_USER and MYSQL_PASSWORD in your .env file.');
    console.log('3. Example: MYSQL_HOST=localhost, MYSQL_USER=root, MYSQL_PASSWORD=your_password\n');
    process.exit(1);
  }
}

setupDatabase();
