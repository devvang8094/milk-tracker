import { query } from '../config/database.js';

export const getFatRate = async (req, res) => {
    try {
        const rows = await query('SELECT rate_per_fat FROM fat_rate_config LIMIT 1');
        let rate = 9.00;

        if (rows.length > 0) {
            rate = parseFloat(rows[0].rate_per_fat);
        } else {
            // Auto-heal
            await query('INSERT INTO fat_rate_config (rate_per_fat) VALUES (9.00)');
        }

        res.json({ success: true, ratePerFat: rate });
    } catch (error) {
        console.error('Get Fat Rate Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const updateFatRate = async (req, res) => {
    try {
        const { ratePerFat } = req.body;
        const val = parseFloat(ratePerFat);

        if (isNaN(val) || val <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid rate' });
        }

        // Update the single global row (assuming ID 1 or just update all? safer to update all or ID 1)
        // Since we limit 1, let's just update without where or where id=1
        // Better: Check if exists, update.

        const rows = await query('SELECT id FROM fat_rate_config LIMIT 1');
        if (rows.length === 0) {
            await query('INSERT INTO fat_rate_config (rate_per_fat) VALUES (?)', [val]);
        } else {
            await query('UPDATE fat_rate_config SET rate_per_fat = ?', [val]);
        }

        res.json({ success: true, ratePerFat: val, message: 'Fat rate updated' });
    } catch (error) {
        console.error('Update Fat Rate Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
