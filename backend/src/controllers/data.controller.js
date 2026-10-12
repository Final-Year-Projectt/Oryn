'use strict';

const BusinessModel = require('../models/business.model');
const DataModel = require('../models/data.model');
const { parseFile, REQUIRED_COLUMNS } = require('../services/csvParser.service');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// ──────────────────────────────────────────────────────────────
//  Shared helper — verify business ownership
// ──────────────────────────────────────────────────────────────
/**
 * Resolves and ownership-checks a businessId.
 * Throws ApiError if not found or not owned by the requesting user.
 *
 * @param {number} businessId
 * @param {number} userId
 * @returns {Promise<object>} The business row
 */
const resolveOwnedBusiness = async (businessId, userId) => {
  const business = await BusinessModel.findBusinessById(businessId);
  if (!business) throw ApiError.notFound('Business profile not found.');
  if (business.user_id !== userId)
    throw ApiError.forbidden('You do not have permission to manage this business data.');
  return business;
};

// ──────────────────────────────────────────────────────────────
//  POST /api/v1/data/upload
// ──────────────────────────────────────────────────────────────
/**
 * Upload & ingest a CSV / XLS / XLSX dataset for a business.
 *
 * Multipart form-data fields:
 *   file        — the data file (handled by multer middleware)
 *   business_id — the target business profile ID
 *   replace     — optional "true" to wipe existing data before insert
 *
 * Responses:
 *   201 – Created      → { success, message, data: { insertedCount, skippedErrors, summary } }
 *   400 – Bad request  (missing file, missing columns, parse errors)
 *   403 – Forbidden    (business belongs to another user)
 *   404 – Business not found
 */
const uploadData = async (req, res, next) => {
  try {
    // ── 1. File presence check ─────────────────────────────────
    if (!req.file) {
      return next(
        ApiError.badRequest(
          'No file received. Attach a .csv, .xls, or .xlsx file under the "file" field.'
        )
      );
    }

    // ── 2. Business ID validation ──────────────────────────────
    const rawBusinessId = req.body.business_id;
    const businessId = parseInt(rawBusinessId, 10);
    if (!rawBusinessId || isNaN(businessId) || businessId < 1) {
      return next(ApiError.badRequest('A valid "business_id" form field is required.'));
    }

    // ── 3. Ownership check ─────────────────────────────────────
    await resolveOwnedBusiness(businessId, req.user.id);

    // ── 4. Parse the file ──────────────────────────────────────
    const { rows, parseErrors, missing } = await parseFile(req.file.buffer, req.file.originalname);

    // ── 5. Missing-column pre-flight ───────────────────────────
    if (missing.length > 0) {
      return next(
        ApiError.badRequest(
          `The file is missing required column(s): ${missing.join(', ')}. ` +
            `Required columns are: ${REQUIRED_COLUMNS.join(', ')}.`,
          missing.map((col) => ({ field: col, message: `Column "${col}" not found in file.` }))
        )
      );
    }

    // ── 6. Parse-error report (allow partial success) ──────────
    // If every single row failed we reject; otherwise we insert
    // the clean rows and report the bad ones.
    if (rows.length === 0 && parseErrors.length > 0) {
      return next(
        ApiError.badRequest(
          'No valid rows could be parsed from the file. Please check the format.',
          parseErrors.map((e) => ({ message: e }))
        )
      );
    }

    // ── 7. Optional replace mode ───────────────────────────────
    let deletedCount = 0;
    if (req.body.replace === 'true') {
      deletedCount = await DataModel.deleteDataByBusinessId(businessId);
    }

    // ── 8. Bulk insert ─────────────────────────────────────────
    const { insertedCount } = await DataModel.bulkInsertData(businessId, rows);

    // ── 9. Respond ─────────────────────────────────────────────
    return new ApiResponse(201, 'Dataset uploaded and processed successfully.', {
      insertedCount,
      skippedRows: parseErrors.length,
      deletedRows: deletedCount,
      filename: req.file.originalname,
      fileSize: `${(req.file.size / 1024).toFixed(1)} KB`,
      ...(parseErrors.length > 0 && {
        parseWarnings: parseErrors.slice(0, 20), // cap at 20 to avoid huge responses
      }),
    }).send(res);
  } catch (err) {
    return next(err);
  }
};

// ──────────────────────────────────────────────────────────────
//  GET /api/v1/data/:business_id
// ──────────────────────────────────────────────────────────────
/**
 * Retrieve stored dataset rows for a business.
 *
 * Query params:
 *   limit  — number of rows to return (default 1000, max 5000)
 *   offset — pagination offset (default 0)
 *
 * Responses:
 *   200 – OK       → { success, message, data: { total, limit, offset, rows } }
 *   400 – Invalid params
 *   403 – Forbidden
 *   404 – Not found
 */
const getData = async (req, res, next) => {
  try {
    // ── 1. Validate business_id param ─────────────────────────
    const businessId = parseInt(req.params.business_id, 10);
    if (isNaN(businessId) || businessId < 1) {
      return next(ApiError.badRequest('business_id must be a positive integer.'));
    }

    // ── 2. Ownership check ────────────────────────────────────
    await resolveOwnedBusiness(businessId, req.user.id);

    // ── 3. Parse pagination params ────────────────────────────
    const rawLimit = parseInt(req.query.limit, 10);
    const rawOffset = parseInt(req.query.offset, 10);

    const limit = isNaN(rawLimit) ? 1000 : Math.min(rawLimit, 5000);
    const offset = isNaN(rawOffset) ? 0 : Math.max(rawOffset, 0);

    // ── 4. Fetch data ─────────────────────────────────────────
    const { total, rows } = await DataModel.findDataByBusinessId(businessId, { limit, offset });

    // ── 5. Normalise column names to camelCase for the client ──
    const formatted = rows.map((r) => ({
      id: r.id,
      businessId: r.business_id,
      date: r.date,
      productId: r.product_id,
      customerId: r.customer_id,
      orders: r.orders,
      quantity: r.quantity,
      revenue: parseFloat(r.revenue),
      cost: parseFloat(r.cost),
      marketingSpend: parseFloat(r.marketing_spend),
      inventory: r.inventory,
      returns: r.returns,
      createdAt: r.created_at,
    }));

    return new ApiResponse(200, 'Dataset retrieved successfully.', {
      total,
      limit,
      offset,
      count: formatted.length,
      rows: formatted,
    }).send(res);
  } catch (err) {
    return next(err);
  }
};

module.exports = { uploadData, getData };
