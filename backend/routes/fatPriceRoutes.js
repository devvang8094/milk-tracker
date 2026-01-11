import express from 'express';
import { getFatSlabs, updateFatSlabs } from '../controllers/fatRateController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for Fat Slabs
router.get('/', authMiddleware, getFatSlabs);
router.post('/', authMiddleware, updateFatSlabs);

export default router;
