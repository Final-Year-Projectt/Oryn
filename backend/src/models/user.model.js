'use strict';

const db = require('../config/db');

// ──────────────────────────────────────────────────────────────
//  User Model — data-access layer for "User" table (Prisma schema)
// ──────────────────────────────────────────────────────────────

/**
 * Insert a new user into the database.
 * Sets id = gen_random_uuid()::text and updatedAt = CURRENT_TIMESTAMP explicitly.
 *
 * @param {{ name: string, email: string, passwordHash: string }} payload
 * @returns {Promise<{ id: string, name: string, email: string, created_at: Date, createdAt: Date }>}
 */
const createUser = async ({ name, email, passwordHash }) => {
  const sql = `
    INSERT INTO "User" (id, name, email, "passwordHash", "updatedAt")
    VALUES (gen_random_uuid()::text, $1, $2, $3, CURRENT_TIMESTAMP)
    RETURNING id, name, email, "createdAt" AS created_at, "createdAt"
  `;
  const { rows } = await db.query(sql, [name, email, passwordHash]);
  return rows[0];
};

/**
 * Find a user by email address.
 * Returns the full row including passwordHash (aliased to password_hash as well).
 *
 * @param {string} email
 * @returns {Promise<object|null>}
 */
const findUserByEmail = async (email) => {
  const sql = `
    SELECT 
      id,
      name,
      email,
      "passwordHash" AS password_hash,
      "passwordHash",
      "createdAt" AS created_at,
      "createdAt",
      "updatedAt" AS updated_at,
      "updatedAt"
    FROM   "User"
    WHERE  email = $1
    LIMIT  1
  `;
  const { rows } = await db.query(sql, [email]);
  return rows[0] || null;
};

/**
 * Find a user by primary key (UUID string).
 * Does NOT return passwordHash — safe for attaching to req.user.
 *
 * @param {string} id
 * @returns {Promise<object|null>}
 */
const findUserById = async (id) => {
  const sql = `
    SELECT 
      id,
      name,
      email,
      "createdAt" AS created_at,
      "createdAt",
      "updatedAt" AS updated_at,
      "updatedAt"
    FROM   "User"
    WHERE  id = $1
    LIMIT  1
  `;
  const { rows } = await db.query(sql, [id]);
  return rows[0] || null;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
