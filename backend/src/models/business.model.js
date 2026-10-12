'use strict';

const crypto = require('crypto');
const db = require('../config/db');

// ──────────────────────────────────────────────────────────────
//  Business Model — data-access layer for "Business", "BusinessMember", "Role"
// ──────────────────────────────────────────────────────────────

/**
 * Generate a URL-friendly, unique slug from a business name.
 * e.g., "Acme Corp" -> "acme-corp-a1b2c3"
 *
 * @param {string} name
 * @returns {string}
 */
const generateSlug = (name) => {
  const base =
    String(name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'business';
  const suffix = crypto.randomBytes(3).toString('hex');
  return `${base}-${suffix}`;
};

/**
 * Insert a new business profile and link the creating user as ADMIN in ONE transaction.
 *
 * @param {{ userId: string, name?: string, businessName?: string }} payload
 * @returns {Promise<object>} The newly created business row with role.
 */
const createBusiness = async ({ userId, name, businessName }) => {
  const businessTitle = String(name || businessName || '').trim();
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // 1. Generate unique slug
    const slug = generateSlug(businessTitle);

    // 2. Insert Business (explicit id and updatedAt required)
    const insertBusinessSql = `
      INSERT INTO "Business" (id, name, slug, "updatedAt")
      VALUES (gen_random_uuid()::text, $1, $2, CURRENT_TIMESTAMP)
      RETURNING id, name, slug, "createdAt" AS created_at, "createdAt", "updatedAt" AS updated_at, "updatedAt"
    `;
    const { rows: businessRows } = await client.query(insertBusinessSql, [businessTitle, slug]);
    const business = businessRows[0];

    // 3. Look up the ADMIN role id
    const roleSql = `
      SELECT id, name
      FROM "Role"
      WHERE name = 'ADMIN'
      LIMIT 1
    `;
    const { rows: roleRows } = await client.query(roleSql);
    if (roleRows.length === 0) {
      throw new Error('ADMIN role not found in database.');
    }
    const adminRole = roleRows[0];

    // 4. Insert BusinessMember linking user as ADMIN (explicit id required)
    const insertMemberSql = `
      INSERT INTO "BusinessMember" (id, "userId", "businessId", "roleId")
      VALUES (gen_random_uuid()::text, $1, $2, $3)
      RETURNING id, "userId", "businessId", "roleId", "joinedAt"
    `;
    await client.query(insertMemberSql, [userId, business.id, adminRole.id]);

    await client.query('COMMIT');

    return {
      ...business,
      businessName: business.name,
      role: adminRole.name,
      user_id: userId,
      userId,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Fetch all businesses the specified user is a member of, along with their role name.
 *
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
const findBusinessesByUserId = async (userId) => {
  const sql = `
    SELECT 
      b.id,
      b.name,
      b.name AS business_name,
      b.name AS "businessName",
      b.slug,
      b."createdAt" AS created_at,
      b."createdAt",
      b."updatedAt" AS updated_at,
      b."updatedAt",
      r.name AS role,
      bm."userId" AS user_id,
      bm."userId"
    FROM "Business" b
    JOIN "BusinessMember" bm ON bm."businessId" = b.id
    JOIN "Role" r ON r.id = bm."roleId"
    WHERE bm."userId" = $1
    ORDER BY b."createdAt" DESC
  `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
};

// Alias for backwards compatibility
const findBusinessByUserId = findBusinessesByUserId;

/**
 * Fetch a user's membership in a specific business (including role name).
 *
 * @param {string} userId
 * @param {string} businessId
 * @returns {Promise<object|null>}
 */
const findMembership = async (userId, businessId) => {
  const sql = `
    SELECT 
      bm.id,
      bm."userId",
      bm."userId" AS user_id,
      bm."businessId",
      bm."businessId" AS business_id,
      bm."roleId",
      bm."roleId" AS role_id,
      bm."joinedAt",
      bm."joinedAt" AS joined_at,
      r.name AS role,
      r.name AS "roleName"
    FROM "BusinessMember" bm
    JOIN "Role" r ON r.id = bm."roleId"
    WHERE bm."userId" = $1 AND bm."businessId" = $2
    LIMIT 1
  `;
  const { rows } = await db.query(sql, [userId, businessId]);
  return rows[0] || null;
};

/**
 * Fetch a single business profile by its primary key.
 * Also returns user_id (the ADMIN member's userId) so downstream callers
 * (like data.controller and analysis.controller) maintain ownership compatibility.
 *
 * @param {string} id
 * @returns {Promise<object|null>}
 */
const findBusinessById = async (id) => {
  const sql = `
    SELECT 
      b.id,
      b.name,
      b.name AS business_name,
      b.name AS "businessName",
      b.slug,
      b."createdAt" AS created_at,
      b."createdAt",
      b."updatedAt" AS updated_at,
      b."updatedAt",
      (
        SELECT bm."userId"
        FROM "BusinessMember" bm
        JOIN "Role" r ON r.id = bm."roleId"
        WHERE bm."businessId" = b.id AND r.name = 'ADMIN'
        ORDER BY bm."joinedAt" ASC
        LIMIT 1
      ) AS user_id
    FROM "Business" b
    WHERE b.id = $1
    LIMIT 1
  `;
  const { rows } = await db.query(sql, [id]);
  return rows[0] || null;
};

module.exports = {
  createBusiness,
  findBusinessesByUserId,
  findBusinessByUserId,
  findMembership,
  findBusinessById,
};
