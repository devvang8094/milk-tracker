/**
 * Withdrawal Routes
 *
 * Purpose:
 * - Manage withdrawals (add, list)
 * - Protect routes using JWT authentication
 */

import express from 'express';
import authenticate from '../middleware/authMiddleware.js';
import {
  addWithdrawal,
  getWithdrawals,
  updateWithdrawal,
  deleteWithdrawal
} from '../controllers/withdrawalController.js';

const router = express.Router();

// Add withdrawal (protected)
router.post('/', authenticate, addWithdrawal);

// Get all withdrawals (protected)
router.get('/', authenticate, getWithdrawals);

// Update withdrawal (protected)
router.put('/:id', authenticate, updateWithdrawal);

// Delete withdrawal (protected)
router.delete('/:id', authenticate, deleteWithdrawal);

export default router;
