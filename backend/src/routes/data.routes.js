'use strict';

const { Router } = require('express');
const { protect } = require('../middleware/auth.middleware');
const { uploadFile } = require('../middleware/multer.middleware');
const { uploadData, getData } = require('../controllers/data.controller');

const router = Router();

// All data routes require a valid JWT
router.use(protect);

// ──────────────────────────────────────────────────────────────
//  Data Routes  →  mounted at /api/v1/data  (see app.js)
// ──────────────────────────────────────────────────────────────

/**
 * @route   POST /api/v1/data/upload
 * @desc    Upload a CSV / Excel dataset and ingest it into the database
 * @access  Private (JWT required)
 * @body    multipart/form-data:
 *            file        — .csv / .xls / .xlsx (max 10 MB)
 *            business_id — target business profile ID (string/number)
 *            replace     — "true" to delete existing rows before insert (optional)
 */
router.post('/upload', uploadFile, uploadData);

/**
 * @route   GET /api/v1/data/:business_id
 * @desc    Retrieve stored dataset rows for a business
 * @access  Private (JWT required — must own the business)
 * @param   business_id  Numeric business record ID
 * @query   limit   Max rows to return (default 1000, max 5000)
 * @query   offset  Pagination offset (default 0)
 */
router.get('/:business_id', getData);

module.exports = router;
