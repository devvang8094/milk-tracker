/**
 * Server Entry Point
 *
 * Responsibilities:
 * - Initialize Express app
 * - Load middleware
 * - Register routes
 * - Start server
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import fatRateRoutes from './routes/fatRateRoutes.js';
import milkRecordRoutes from './routes/milkRecordRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import withdrawalRoutes from './routes/withdrawalRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Milk Tracker Backend is running'
  });
});

// Test database connection on server start
testConnection();

//signup and login
app.use('/api/auth', authRoutes);

//fat price
// app.use('/api/fat-price', fatPriceRoutes);
app.use('/api/fat-rate', fatRateRoutes);

//milk record
app.use('/api/milk-records', milkRecordRoutes);

//expense controller
app.use('/api/expenses', expenseRoutes);

//withdrawl controller
app.use('/api/withdrawals', withdrawalRoutes);


//dashboard
app.use('/api/dashboard', dashboardRoutes);

// Temporary route placeholders (we wire real routes later)
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
