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

async function runMigration() {
  console.log('====================================================');
  console.log('🚀 Base44 ResQ Network - MySQL Migration Runner');
  console.log('====================================================');
  console.log(`Target: ${dbConfig.host}:${dbConfig.port} | Database: ${dbConfig.database} | User: ${dbConfig.user}`);

  try {
    // 1. Establish connection to MySQL server
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true,
    });

    console.log('✔ Connected to MySQL instance.');

    // 2. Execute database/schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log(`📦 Running schema definitions from: ${schemaPath}`);
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('✔ Schema tables created/verified successfully.');
    }

    // 3. Execute database/seeds.sql
    const seedsPath = path.join(__dirname, 'seeds.sql');
    if (fs.existsSync(seedsPath)) {
      console.log(`🌱 Inserting initial seeds from: ${seedsPath}`);
      const seedsSql = fs.readFileSync(seedsPath, 'utf8');
      await connection.query(seedsSql);
      console.log('✔ Initial seeds inserted successfully.');
    }

    console.log('🎉 Migration completed! MySQL database is fully initialized.');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\nMake sure your MySQL service is started (e.g. via XAMPP or Windows Services).');
    console.log('Check your credentials in .env: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD.\n');
    process.exit(1);
  }
}

runMigration();
