import express from 'express';
import { getEarningsHistory, getExpensesHistory, getWithdrawalsHistory } from '../controllers/historyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/earnings', getEarningsHistory);
router.get('/expenses', getExpensesHistory);
router.get('/withdrawals', getWithdrawalsHistory);

export default router;
