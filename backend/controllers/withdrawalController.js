/**
 * Withdrawal Controller
 *
 * Responsibilities:
 * - Add withdrawal
 * - Get all withdrawals
 * - Update withdrawal
 * - Delete withdrawal
 */

import { query } from '../config/database.js';

/**
 * ADD withdrawal
 * POST /api/withdrawals
 * Body: { amount, date }
 */
export const addWithdrawal = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing User ID' });
    }
    const { amount, date } = req.body;

    if (!amount || amount <= 0 || !date) {
      return res.status(400).json({
        success: false,
        message: 'Invalid withdrawal data'
      });
    }

    await query(
      `
      INSERT INTO withdrawals (user_id, amount, date)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [userId, amount, date]
    );

    res.status(201).json({
      success: true,
      message: 'Withdrawal added successfully'
    });

  } catch (error) {
    console.error('Add withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * GET all withdrawals
 * GET /api/withdrawals
 */
export const getWithdrawals = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing User ID' });
    }

    const rows = await query(
      `
      SELECT id, amount, date, created_at
      FROM withdrawals
      WHERE user_id = $1
      ORDER BY date DESC
      `,
      [userId]
    );

    res.json({
      success: true,
      withdrawals: rows
    });

  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * UPDATE withdrawal
 * PUT /api/withdrawals/:id
 */
export const updateWithdrawal = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing User ID' });
    }
    const withdrawalId = req.params.id;
    const { amount, date } = req.body;

    if (!amount || amount <= 0 || !date) {
      return res.status(400).json({
        success: false,
        message: 'Invalid withdrawal data'
      });
    }

    const result = await query(
      `
      UPDATE withdrawals
      SET amount = $1, date = $2
      WHERE id = $3 AND user_id = $4
      `,
      [amount, date, withdrawalId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    res.json({
      success: true,
      message: 'Withdrawal updated successfully'
    });

  } catch (error) {
    console.error('Update withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * DELETE withdrawal
 * DELETE /api/withdrawals/:id
 */
export const deleteWithdrawal = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing User ID' });
    }
    const withdrawalId = req.params.id;

    const result = await query(
      `
      DELETE FROM withdrawals
      WHERE id = $1 AND user_id = $2
      `,
      [withdrawalId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    res.json({
      success: true,
      message: 'Withdrawal deleted successfully'
    });

  } catch (error) {
    console.error('Delete withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
