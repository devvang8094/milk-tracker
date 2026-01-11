/**
 * Dashboard Routes
 *
 * Purpose:
 * - Provide dashboard summary (totals & balance)
 * - Protect route using JWT authentication
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// Get dashboard statistics (protected)
router.get('/stats', authenticate, getDashboardStats);

export default router;
