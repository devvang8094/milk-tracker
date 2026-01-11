/**
 * History Controller
 * 
 * Responsibilities:
 * - Fetch detailed history for Dashboard views
 * - Read-only access
 * - Sorted by date DESC
 */

import { query } from '../config/database.js';

/**
 * GET /api/history/earnings
 * Returns: Date, Session, Litres, Fat %, Rate, Amount
 */
export const getEarningsHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const rows = await query(
            `
      SELECT id, date, session, litres, fat_percentage, rate_per_fat, amount
      FROM milk_records
      WHERE user_id = $1
      ORDER BY date DESC
      `,
            [userId]
        );

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Earnings History Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * GET /api/history/expenses
 * Returns: Date, Amount, Description
 */
export const getExpensesHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const rows = await query(
            `
      SELECT id, date, amount, description
      FROM expenses
      WHERE user_id = $1
      ORDER BY date DESC
      `,
            [userId]
        );

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Expenses History Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * GET /api/history/withdrawals
 * Returns: Date, Amount
 */
export const getWithdrawalsHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const rows = await query(
            `
      SELECT id, date, amount
      FROM withdrawals
      WHERE user_id = $1
      ORDER BY date DESC
      `,
            [userId]
        );

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Withdrawals History Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
