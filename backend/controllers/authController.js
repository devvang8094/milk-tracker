/**
 * Authentication Controller
 *
 * Responsibilities:
 * - User signup
 * - User login
 * - Password hashing
 * - JWT generation
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

/**
 * SIGNUP
 * POST /api/auth/signup
 * Body: { phoneNumber, password }
 */
export const signup = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Validation
    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and password are required'
      });
    }

    // Phone validation: 10-12 digits
    const phoneRegex = /^\d{10,12}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be 10-12 digits'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE phone_number = $1',
      [phoneNumber]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await query(
      'INSERT INTO users (phone_number, password) VALUES ($1, $2) RETURNING id',
      [phoneNumber, hashedPassword]
    );

    const userId = result[0].id;

    // Initialize fat price for user with default 0
    await query(
      'INSERT INTO fat_prices (user_id, price_per_fat) VALUES ($1, $2)',
      [userId, 0]
    );

    // Generate JWT
    const token = jwt.sign(
      { userId, phone: phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token,
      user: {
        id: userId,
        phoneNumber
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * LOGIN
 * POST /api/auth/login
 * Body: { phoneNumber, password }
 */
export const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Validation
    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and password are required'
      });
    }

    // Find user
    const users = await query(
      'SELECT id, phone_number, password FROM users WHERE phone_number = $1',
      [phoneNumber]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, phone: user.phone_number },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        phoneNumber: user.phone_number
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * DELETE ACCOUNT
 * DELETE /api/auth/profile
 * Protected
 */
export const deleteUser = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const userId = req.user.userId;

    // Delete related data first
    await query('DELETE FROM milk_records WHERE user_id = $1', [userId]);
    await query('DELETE FROM expenses WHERE user_id = $1', [userId]);
    await query('DELETE FROM withdrawals WHERE user_id = $1', [userId]);
    await query('DELETE FROM fat_prices WHERE user_id = $1', [userId]);

    // Delete user
    await query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

