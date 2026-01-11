/**
 * Database Configuration (PostgreSQL)
 *
 * Purpose:
 * - Create a PostgreSQL connection pool using pg
 * - Provide a reusable query function
 * - Keep DB logic separate from controllers
 */

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Create PostgreSQL connection pool
// Uses DATABASE_URL from environment variables for connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon free tier
  }
});

export const db = pool;

/**
 * Execute SQL queries
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>}
 */
export const query = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  const rows = result.rows;

  // MySQL compatibility
  rows.affectedRows = result.rowCount;
  rows.insertId = (rows.length > 0 && rows[0].id) ? rows[0].id : null;

  return rows;
};

// Test database connection (on server start)
export const testConnection = async () => {
  try {
    const res = await pool.query('SELECT 1');
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
};
