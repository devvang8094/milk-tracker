import express from 'express';
import { getFatRate, updateFatRate } from '../controllers/fatRateController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public or Protected? User said "Any logged-in user". So use authMiddleware.
router.get('/', authMiddleware, getFatRate);
router.put('/', authMiddleware, updateFatRate);

export default router;
