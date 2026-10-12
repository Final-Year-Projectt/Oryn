'use strict';

const { Router } = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  createBusiness,
  getBusiness,
  getMyBusiness,
} = require('../controllers/business.controller');

const router = Router();

// All business routes require a valid JWT — apply protect globally
router.use(protect);

// ──────────────────────────────────────────────────────────────
//  Business Routes  →  mounted at /api/v1/business  (see app.js)
// ──────────────────────────────────────────────────────────────

/**
 * @route   POST /api/v1/business
 * @desc    Create a business profile for the authenticated user
 * @access  Private (JWT required)
 * @body    { businessName, industry, businessType, businessSize }
 */
router.post('/', createBusiness);

/**
 * @route   GET /api/v1/business/me
 * @desc    Get the authenticated user's own business profile
 * @access  Private (JWT required)
 *
 * NOTE: This route must be declared BEFORE /:id to avoid "me"
 *       being treated as a numeric ID parameter.
 */
router.get('/me', getMyBusiness);

/**
 * @route   GET /api/v1/business/:id
 * @desc    Get a business profile by its database ID
 * @access  Private (JWT required — must own the profile)
 * @param   id  Numeric business record ID
 */
router.get('/:id', getBusiness);

module.exports = router;
