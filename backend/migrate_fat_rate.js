import { query } from './config/database.js';

const migrate = async () => {
    try {
        console.log('Starting migration...');

        // Create Table
        await query(`
      CREATE TABLE IF NOT EXISTS fat_rate_config (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rate_per_fat DECIMAL(5, 2) NOT NULL DEFAULT 9.00,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

        // Insert Default
        const rows = await query('SELECT * FROM fat_rate_config');
        if (rows.length === 0) {
            await query('INSERT INTO fat_rate_config (id, rate_per_fat) VALUES (1, 9.00)');
            console.log('Default rate inserted.');
        } else {
            console.log('Rate config already exists.');
        }

        console.log('Migration complete.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
