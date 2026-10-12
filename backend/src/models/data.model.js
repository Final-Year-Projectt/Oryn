'use strict';

const db = require('../config/db');

// ──────────────────────────────────────────────────────────────
//  Data Model — bulk write + retrieval for business_data table
// ──────────────────────────────────────────────────────────────

/**
 * Bulk-insert parsed data rows inside a single transaction.
 * Uses parameterised multi-row VALUES to minimise round-trips.
 *
 * @param {number}   businessId  - FK to businesses.id
 * @param {Object[]} rows        - Normalised row objects from the parser service
 * @returns {Promise<{ insertedCount: number }>}
 */
const bulkInsertData = async (businessId, rows) => {
  if (rows.length === 0) return { insertedCount: 0 };

  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // Build a single multi-row INSERT statement.
    // Each row occupies 11 parameters ($1…$11, $12…$22, …).
    const COLS_PER_ROW = 11;
    const valuePlaceholders = rows.map((_, i) => {
      const base = i * COLS_PER_ROW;
      return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, $${base + 11})`;
    });

    const sql = `
      INSERT INTO business_data
        (business_id, date, product_id, customer_id, orders, quantity,
         revenue, cost, marketing_spend, inventory, returns)
      VALUES
        ${valuePlaceholders.join(',\n        ')}
    `;

    const values = rows.flatMap((row) => [
      businessId,
      row.date,
      row.product_id,
      row.customer_id,
      row.orders,
      row.quantity,
      row.revenue,
      row.cost,
      row.marketing_spend,
      row.inventory,
      row.returns,
    ]);

    await client.query(sql, values);
    await client.query('COMMIT');

    return { insertedCount: rows.length };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Retrieve all data rows for a business, ordered by date descending.
 * Supports optional pagination via limit / offset.
 *
 * @param {number}  businessId
 * @param {object}  [opts]
 * @param {number}  [opts.limit=1000]
 * @param {number}  [opts.offset=0]
 * @returns {Promise<{ rows: Object[], total: number }>}
 */
const findDataByBusinessId = async (businessId, { limit = 1000, offset = 0 } = {}) => {
  // Run count and data fetch in parallel
  const [countResult, dataResult] = await Promise.all([
    db.query('SELECT COUNT(*)::int AS total FROM business_data WHERE business_id = $1', [
      businessId,
    ]),
    db.query(
      `SELECT id, business_id, date, product_id, customer_id,
              orders, quantity, revenue, cost, marketing_spend,
              inventory, returns, created_at
       FROM   business_data
       WHERE  business_id = $1
       ORDER  BY date DESC, id DESC
       LIMIT  $2 OFFSET $3`,
      [businessId, limit, offset]
    ),
  ]);

  return {
    total: countResult.rows[0].total,
    rows: dataResult.rows,
  };
};

/**
 * Check how many rows already exist for a business.
 * Used by the controller to decide whether to warn about re-uploads.
 *
 * @param {number} businessId
 * @returns {Promise<number>}
 */
const countDataByBusinessId = async (businessId) => {
  const { rows } = await db.query(
    'SELECT COUNT(*)::int AS total FROM business_data WHERE business_id = $1',
    [businessId]
  );
  return rows[0].total;
};

/**
 * Delete all data rows for a business (used before a full re-upload).
 *
 * @param {number} businessId
 * @returns {Promise<number>} Number of deleted rows
 */
const deleteDataByBusinessId = async (businessId) => {
  const { rowCount } = await db.query('DELETE FROM business_data WHERE business_id = $1', [
    businessId,
  ]);
  return rowCount;
};

module.exports = {
  bulkInsertData,
  findDataByBusinessId,
  countDataByBusinessId,
  deleteDataByBusinessId,
};
