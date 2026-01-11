/**
 * Fat Price Controller
 * Manages the single rate per fat (0-10) for calculation.
 */
import { query } from '../config/database.js';

/**
 * GET FAT PRICE
 * GET /api/fat-price
 */
export const getFatPrice = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch the single rate for user
    let price = 9; // Default to 9 if not found (auto-heal)
    if (rows.length > 0) {
      price = parseFloat(rows[0].price_per_fat);
    } else {
      await query('INSERT INTO fat_prices (user_id, price_per_fat) VALUES (?, 9.00)', [userId]);
    }

    res.json({
      success: true,
      ratePerFat: price
    });

  } catch (error) {
    console.error('Get Fat Price Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * UPDATE FAT PRICE
 * PUT /api/fat-price
 * Body: { ratePerFat }
 */
export const updateFatPrice = async (req, res) => {
  try {
    const userId = req.userId;
    const { ratePerFat } = req.body;

    if (ratePerFat === undefined || ratePerFat === null) {
      return res.status(400).json({ success: false, message: 'Rate is required' });
    }

    const rate = parseFloat(ratePerFat);
    if (isNaN(rate) || rate < 0) {
      return res.status(400).json({ success: false, message: 'Invalid rate' });
    }

    // Check if exists
    const rows = await query('SELECT id FROM fat_prices WHERE user_id = ?', [userId]);

    if (rows.length > 0) {
      await query(
        'UPDATE fat_prices SET price_per_fat = ? WHERE user_id = ?',
        [rate, userId]
      );
    } else {
      await query(
        'INSERT INTO fat_prices (user_id, price_per_fat) VALUES (?, ?)',
        [userId, rate]
      );
    }

    res.json({
      success: true,
      message: 'Fat rate updated successfully',
      ratePerFat: rate
    });

  } catch (error) {
    console.error('Update Fat Price Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
