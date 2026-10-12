'use strict';

const db = require('../config/db');

// ══════════════════════════════════════════════════════════════
//  Analysis Model — persistence layer for problems & recommendations
// ══════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────
//  Problems
// ──────────────────────────────────────────────────────────────

/**
 * Insert an array of problems + their recommendations in a single
 * transaction.  Problems with zero recommendations are still saved.
 *
 * @param {number}   businessId
 * @param {Array<{
 *   problemType:     string,
 *   severity:        string,
 *   confidence:      number,
 *   evidence:        object,
 *   recommendations: Array<{
 *     recommendation: string,
 *     priority:       string,
 *     expectedImpact: string,
 *     difficulty:     string,
 *     risk:           string,
 *     reason:         string,
 *   }>
 * }>} problems
 * @returns {Promise<Object[]>}  Inserted problem rows (with IDs)
 */
const saveProblemsWithRecommendations = async (businessId, problems) => {
  if (problems.length === 0) return [];

  const client = await db.getClient();
  const savedProblems = [];

  try {
    await client.query('BEGIN');

    for (const p of problems) {
      // Insert problem
      const probResult = await client.query(
        `INSERT INTO problems (business_id, problem_type, severity, confidence, evidence)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, business_id, problem_type, severity, confidence, evidence, created_at`,
        [businessId, p.problemType, p.severity, p.confidence, JSON.stringify(p.evidence ?? {})]
      );
      const problem = probResult.rows[0];

      // Insert associated recommendations
      const recs = p.recommendations ?? [];
      const savedRecs = [];

      for (const r of recs) {
        const recResult = await client.query(
          `INSERT INTO recommendations (problem_id, recommendation, priority, expected_impact, difficulty, risk, reason)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, problem_id, recommendation, priority, expected_impact, difficulty, risk, reason`,
          [
            problem.id,
            r.recommendation,
            r.priority,
            r.expectedImpact,
            r.difficulty,
            r.risk,
            r.reason,
          ]
        );
        savedRecs.push(recResult.rows[0]);
      }

      savedProblems.push({ ...problem, recommendations: savedRecs });
    }

    await client.query('COMMIT');
    return savedProblems;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Delete all problems (and cascaded recommendations) for a business.
 * Called before re-running analysis to avoid stale data.
 *
 * @param {number} businessId
 * @returns {Promise<number>} Deleted row count
 */
const clearProblemsForBusiness = async (businessId) => {
  const { rowCount } = await db.query('DELETE FROM problems WHERE business_id = $1', [businessId]);
  return rowCount;
};

/**
 * Fetch all problems for a business, ordered by severity.
 *
 * @param {number} businessId
 * @returns {Promise<Object[]>}
 */
const findProblemsByBusinessId = async (businessId) => {
  const severityOrder = `CASE severity
    WHEN 'critical' THEN 1
    WHEN 'high'     THEN 2
    WHEN 'medium'   THEN 3
    WHEN 'low'      THEN 4
    ELSE 5 END`;

  const { rows } = await db.query(
    `SELECT id, business_id, problem_type, severity, confidence, evidence, created_at
     FROM   problems
     WHERE  business_id = $1
     ORDER  BY ${severityOrder}, created_at DESC`,
    [businessId]
  );
  return rows;
};

// ──────────────────────────────────────────────────────────────
//  Recommendations
// ──────────────────────────────────────────────────────────────

/**
 * Fetch recommendations for a specific problem, ranked by priority.
 *
 * @param {number} problemId
 * @returns {Promise<Object[]>}
 */
const findRecommendationsByProblemId = async (problemId) => {
  const priorityOrder = `CASE priority
    WHEN 'critical' THEN 1
    WHEN 'high'     THEN 2
    WHEN 'medium'   THEN 3
    WHEN 'low'      THEN 4
    ELSE 5 END`;

  const { rows } = await db.query(
    `SELECT id, problem_id, recommendation, priority, expected_impact, difficulty, risk, reason, created_at
     FROM   recommendations
     WHERE  problem_id = $1
     ORDER  BY ${priorityOrder}`,
    [problemId]
  );
  return rows;
};

module.exports = {
  saveProblemsWithRecommendations,
  clearProblemsForBusiness,
  findProblemsByBusinessId,
  findRecommendationsByProblemId,
};
