/**
 * Milk Record Routes
 *
 * Purpose:
 * - Add milk records (morning / night)
 * - Fetch all milk records
 * - Protect routes using JWT middleware
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  addMilkRecord,
  getMilkRecords,
  updateMilkRecord,
  deleteMilkRecord
} from '../controllers/milkRecordController.js';

const router = express.Router();

// Add milk record (protected)
router.post('/', authenticate, addMilkRecord);

// Get all milk records (protected)
router.get('/', authenticate, getMilkRecords);

// Update milk record (protected)
router.put('/:id', authenticate, updateMilkRecord);

// Delete milk record (protected)
router.delete('/:id', authenticate, deleteMilkRecord);

export default router;
