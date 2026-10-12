'use strict';

const { Pool } = require('pg');

// ──────────────────────────────────────────────────────────────
//  Singleton connection pool
//  pg reads DATABASE_URL automatically when the env var is set.
// ──────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Keep idle connections alive; avoids cold-start latency
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  max: 10,
});

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('[DB] New client connected to PostgreSQL pool');
  }
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
  process.exit(1);
});

/**
 * Execute a parameterised query against the pool.
 *
 * @param {string} text   - SQL query string with $n placeholders
 * @param {Array}  params - Positional parameter values
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = (text, params) => pool.query(text, params);

/**
 * Acquire a dedicated client for multi-statement transactions.
 * Always release the client in a finally block.
 *
 * @returns {Promise<import('pg').PoolClient>}
 */
const getClient = () => pool.connect();

module.exports = { query, getClient, pool };
