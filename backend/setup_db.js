import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function setupDatabase() {
    try {
        console.log('🔌 Connecting to Neon PostgreSQL...');
        const client = await pool.connect();
        console.log('✅ Connected.');

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('📄 Reading schema.sql...');
        console.log('🚀 Executing schema...');

        // Split by semicolons might be flaky if there are semicolons in strings, 
        // but for this simple schema it's likely fine, or just run the whole thing if the driver supports it.
        // pg driver supports multiple statements in one query.
        await client.query(schemaSql);

        // Also create fat_rate_config table if not in schema.sql (it was added in migration but maybe not schema)
        // Let's explicitly check/create it just in case, as it appeared in fatRateController
        console.log('⚙️ Ensuring fat_rate_config table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS fat_rate_config (
          id SERIAL PRIMARY KEY,
          rate_per_fat DECIMAL(5, 2) NOT NULL DEFAULT 9.00
      );
    `);

        console.log('✅ Database setup complete!');
        client.release();
        pool.end();
    } catch (err) {
        console.error('❌ Error setting up database:', err);
        process.exit(1);
    }
}

setupDatabase();
