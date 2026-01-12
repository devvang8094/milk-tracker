/**
 * Dashboard Controller
 *
 * Responsibilities:
 * - Calculate total earnings
 * - Calculate total expenses
 * - Calculate total withdrawals
 * - Calculate available balance
 */

import { query } from '../config/database.js';

/**
 * GET dashboard summary
 * GET /api/dashboard/stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing User ID' });
    }

    // Total earnings from milk
    const incomeRows = await query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM milk_records WHERE user_id = $1',
      [userId]
    );

    // Total expenses
    const expenseRows = await query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = $1',
      [userId]
    );

    // Total withdrawals
    const withdrawalRows = await query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM withdrawals WHERE user_id = $1',
      [userId]
    );

    const totalEarning = Number(incomeRows[0].total);
    const totalExpenses = Number(expenseRows[0].total);
    const totalWithdrawn = Number(withdrawalRows[0].total);

    const availableBalance =
      totalEarning - totalExpenses - totalWithdrawn;

    res.json({
      success: true,
      totalEarning,
      totalExpenses,
      totalWithdrawn,
      availableBalance
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
