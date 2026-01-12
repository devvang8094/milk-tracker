import { query } from './config/database.js';

const repairSchema = async () => {
    try {
        console.log('Starting Schema Repair...');

        // 1. Ensure users table exists
        await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(15) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✓ users table check');

        // 2. Ensure fat_rate_config exists
        await query(`
      CREATE TABLE IF NOT EXISTS fat_rate_config (
        id SERIAL PRIMARY KEY,
        rate_per_fat DECIMAL(10, 2) DEFAULT 9.00,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✓ fat_rate_config table check');

        // 3. Ensure fat_prices exists (and has user_id)
        await query(`
      CREATE TABLE IF NOT EXISTS fat_prices (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        price_per_fat DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Add user_id if missing (idempotent)
        try {
            await query(`ALTER TABLE fat_prices ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE`);
        } catch (e) { console.log('  - fat_prices user_id col already exists or error:', e.message); }
        console.log('✓ fat_prices table check');


        // 4. Ensure milk_records exists (and has user_id)
        await query(`
      CREATE TABLE IF NOT EXISTS milk_records (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        session VARCHAR(10) NOT NULL,
        litres DECIMAL(10, 2) NOT NULL,
        fat_percentage DECIMAL(10, 2) NOT NULL,
        rate_per_fat DECIMAL(10, 2) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        try {
            await query(`ALTER TABLE milk_records ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE`);
        } catch (e) { console.log('  - milk_records user_id col already exists or error:', e.message); }
        console.log('✓ milk_records table check');

        // 5. Ensure expenses exists (and has user_id)
        await query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        try {
            await query(`ALTER TABLE expenses ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE`);
        } catch (e) { console.log('  - expenses user_id col already exists or error:', e.message); }
        console.log('✓ expenses table check');

        // 6. Ensure withdrawals exists (and has user_id)
        await query(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        try {
            await query(`ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE`);
        } catch (e) { console.log('  - withdrawals user_id col already exists or error:', e.message); }
        console.log('✓ withdrawals table check');

        console.log('Schema Repair Complete. All tables have user_id.');
        process.exit(0);

    } catch (error) {
        console.error('Schema Repair Failed:', error);
        process.exit(1);
    }
};

repairSchema();
