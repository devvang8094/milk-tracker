/**
 * Expense Routes
 *
 * Purpose:
 * - Manage expenses (add, list, update, delete)
 * - Protect routes using JWT authentication
 */

import express from 'express';
import authenticate from '../middleware/authMiddleware.js';
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController.js';

const router = express.Router();

// Add expense (protected)
router.post('/', authenticate, addExpense);

// Get all expenses (protected)
router.get('/', authenticate, getExpenses);

// Update expense (protected)
router.put('/:id', authenticate, updateExpense);

// Delete expense (protected)
router.delete('/:id', authenticate, deleteExpense);

export default router;
