/**
 * Milk Record Controller
 *
 * Responsibilities:
 * - Add milk record (morning/night)
 * - Calculate amount using fat price (Simple Calculation: L * F * Rate)
 * - Fetch records for logged-in user
 */

import { query } from '../config/database.js';

/**
 * ADD milk record
 * POST /api/milk-records
 * Body: { date, session, litres, fat_percentage }
 */
export const addMilkRecord = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing User ID' });
    }
    const { date, session, litres, fat_percentage } = req.body;

    if (!date || !session || !litres || !fat_percentage) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const fat = parseFloat(fat_percentage);
    if (fat < 0 || fat > 10) {
      return res.status(400).json({ success: false, message: 'Fat percentage must be between 0 and 10' });
    }

    // 1. Fetch Global Fat Rate
    const priceRows = await query('SELECT rate_per_fat FROM fat_rate_config LIMIT 1');

    let ratePerFat = 9.00;
    if (priceRows.length > 0) {
      ratePerFat = parseFloat(priceRows[0].rate_per_fat);
    } else {
      await query('INSERT INTO fat_rate_config (rate_per_fat) VALUES (9.00)');
    }

    // 2. SERVER-SIDE CALCULATION (Single Source of Truth)
    const amount = Math.round(parseFloat(litres) * fat * ratePerFat);

    if (amount <= 0) {
      if (parseFloat(litres) <= 0 || fat <= 0) {
        return res.status(400).json({ success: false, message: 'Litres and Fat must be greater than 0' });
      }
      if (ratePerFat <= 0) {
        return res.status(400).json({ success: false, message: 'Fat Rate is 0. Please update it in Dashboard.' });
      }
    }

    // 3. Save to DB
    const result = await query(
      'INSERT INTO milk_records (user_id, date, session, litres, fat_percentage, rate_per_fat, amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [userId, date, session, litres, fat_percentage, ratePerFat, amount]
    );

    res.status(201).json({
      success: true,
      message: 'Milk record added successfully',
      record: {
        id: result.insertId,
        date,
        session,
        litres,
        fat_percentage,
        rate_per_fat: ratePerFat,
        amount
      }
    });

  } catch (error) {
    console.error('Error adding milk record:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * GET all milk records
 * GET /api/milk-records
 */
export const getMilkRecords = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing User ID' });
    }

    const rows = await query(
      `
      SELECT id, date, session, litres, fat_percentage, rate_per_fat, amount, created_at
      FROM milk_records
      WHERE user_id = $1
      ORDER BY date DESC
      `,
      [userId]
    );

    res.json({
      success: true,
      records: rows
    });

  } catch (error) {
    console.error('Get milk records error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * UPDATE milk record
 * PUT /api/milk-records/:id
 * Body: { date, session, litres, fat_percentage }
 */
export const updateMilkRecord = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing User ID' });
    }
    const recordId = req.params.id;
    const { date, session, litres, fat_percentage } = req.body;

    if (!date || !session || !litres || !fat_percentage) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const fat = parseFloat(fat_percentage);
    if (fat < 0 || fat > 10) {
      return res.status(400).json({ success: false, message: 'Fat percentage must be between 0 and 10' });
    }

    // 1. Fetch Global Fat Rate
    const priceRows = await query('SELECT rate_per_fat FROM fat_rate_config LIMIT 1');

    let ratePerFat = 9.00;
    if (priceRows.length > 0) {
      ratePerFat = parseFloat(priceRows[0].rate_per_fat);
    }

    // 2. SERVER-SIDE CALCULATION
    const amount = Math.round(parseFloat(litres) * fat * ratePerFat);

    if (amount <= 0) {
      if (parseFloat(litres) <= 0 || fat <= 0) {
        return res.status(400).json({ success: false, message: 'Litres and Fat must be greater than 0' });
      }
      if (ratePerFat <= 0) {
        return res.status(400).json({ success: false, message: 'Fat Rate is 0. Please update it in Dashboard.' });
      }
    }

    // 3. Update DB
    const result = await query(
      `
      UPDATE milk_records 
      SET date = $1, session = $2, litres = $3, fat_percentage = $4, rate_per_fat = $5, amount = $6
      WHERE id = $7 AND user_id = $8
      `,
      [date, session, litres, fat_percentage, ratePerFat, amount, recordId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({
      success: true,
      message: 'Milk record updated successfully',
      record: { id: recordId, date, session, litres, fat_percentage, rate_per_fat: ratePerFat, amount }
    });

  } catch (error) {
    console.error('Update milk record error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * DELETE milk record
 * DELETE /api/milk-records/:id
 */
export const deleteMilkRecord = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing User ID' });
    }
    const recordId = req.params.id;

    const result = await query(
      'DELETE FROM milk_records WHERE id = $1 AND user_id = $2',
      [recordId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({ success: true, message: 'Milk record deleted successfully' });

  } catch (error) {
    console.error('Delete milk record error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
