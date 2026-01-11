/**
 * Authentication Routes
 *
 * Purpose:
 * - Map auth URLs to controller functions
 */

import express from 'express';
import { signup, login, deleteUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Delete Account (Protected)
router.delete('/profile', authenticate, deleteUser);

export default router;
