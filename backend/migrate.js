import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'milk_tracker'
};

async function migrate() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        // 1. Users table update: Add phone_number, drop username if exists (or keep both for now, but ensure phone_number is there)
        console.log('Checking users table for phone_number...');
        const [userCols] = await connection.query(`SHOW COLUMNS FROM users LIKE 'phone_number'`);
        if (userCols.length === 0) {
            console.log('Adding phone_number column...');
            // We allow NULL initially to not break existing records, or we handle migration
            await connection.query(`ALTER TABLE users ADD COLUMN phone_number VARCHAR(15) UNIQUE AFTER id`);
            // NOTE: Existing users with NULL phone_number might break "NOT NULL" constraint if enforced immediately.
            // For a complete migration, we'd need to migrate data. 
            // Since "username" is being removed/replaced, maybe we just DROP username logic if this is a fresh start request,
            // BUT user said "Return stable...".
            // Let's assume we are transforming the schema.
        }

        // 2. Milk Records: Add rate_per_fat
        console.log('Checking milk_records schema...');
        const [cols] = await connection.query(`SHOW COLUMNS FROM milk_records LIKE 'rate_per_fat'`);
        if (cols.length === 0) {
            console.log('Adding rate_per_fat column...');
            await connection.query(`ALTER TABLE milk_records ADD COLUMN rate_per_fat DECIMAL(5, 2) DEFAULT 0.00 AFTER fat_percentage`);
        }

        // 3. Ensure fat_prices exists (it was in schema.sql before)
        console.log('Ensuring fat_prices table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS fat_prices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                price_per_fat DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 3. Fix existing 0 amounts
        console.log('Fixing zero-amount records...');
        const [zeroRecords] = await connection.query(`SELECT id, litres, fat_percentage FROM milk_records WHERE amount = 0`);

        if (zeroRecords.length > 0) {
            console.log(`Found ${zeroRecords.length} records with 0 amount. Recalculating...`);
            for (const record of zeroRecords) {
                const fat = parseFloat(record.fat_percentage);
                const litres = parseFloat(record.litres);
                let rate = 50;
                if (fat >= 6.5) rate = 60;
                else if (fat >= 6.0) rate = 58;
                else if (fat >= 5.5) rate = 56;
                else if (fat >= 5.0) rate = 54;

                const amount = Math.round(litres * rate);
                await connection.query(`UPDATE milk_records SET amount = ?, rate_per_litre = ? WHERE id = ?`, [amount, rate, record.id]);
            }
            console.log('Recalculation complete.');
        } else {
            console.log('No zero-amount records found.');
        }

        console.log('Migration successful!');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
