/**
 * Expense Controller
 *
 * Responsibilities:
 * - Add expense
 * - Get all expenses
 * - Update expense
 * - Delete expense
 */

import { query } from '../config/database.js';

/**
 * ADD expense
 * POST /api/expenses
 * Body: { amount, description, date }
 */
export const addExpense = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount, description, date } = req.body;

    if (!amount || amount <= 0 || !description || !date) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense data'
      });
    }

    await query(
      `
      INSERT INTO expenses (user_id, amount, description, date)
      VALUES (?, ?, ?, ?)
      `,
      [userId, amount, description, date]
    );

    res.status(201).json({
      success: true,
      message: 'Expense added successfully'
    });

  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * GET all expenses
 * GET /api/expenses
 */
export const getExpenses = async (req, res) => {
  try {
    const userId = req.userId;

    const rows = await query(
      `
      SELECT id, amount, description, date
      FROM expenses
      WHERE user_id = ?
      ORDER BY date DESC
      `,
      [userId]
    );

    res.json({
      success: true,
      expenses: rows
    });

  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * UPDATE expense
 * PUT /api/expenses/:id
 */
export const updateExpense = async (req, res) => {
  try {
    const userId = req.userId;
    const expenseId = req.params.id;
    const { amount, description, date } = req.body;

    if (!amount || amount <= 0 || !description || !date) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense data'
      });
    }

    const result = await query(
      `
      UPDATE expenses
      SET amount = ?, description = ?, date = ?
      WHERE id = ? AND user_id = ?
      `,
      [amount, description, date, expenseId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      message: 'Expense updated successfully'
    });

  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * DELETE expense
 * DELETE /api/expenses/:id
 */
export const deleteExpense = async (req, res) => {
  try {
    const userId = req.userId;
    const expenseId = req.params.id;

    const result = await query(
      `
      DELETE FROM expenses
      WHERE id = ? AND user_id = ?
      `,
      [expenseId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });

  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
