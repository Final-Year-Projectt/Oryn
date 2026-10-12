'use strict';

const BusinessModel = require('../models/business.model');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// ── Allowed enum values (for optional validation) ─────────────
const ALLOWED_BUSINESS_TYPES = [
  'sole_proprietorship',
  'partnership',
  'corporation',
  'llc',
  'other',
];
const ALLOWED_BUSINESS_SIZES = ['micro', 'small', 'medium', 'large'];

// UUID format validation regex (v4 or general UUID)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isValidUuid = (id) => typeof id === 'string' && UUID_REGEX.test(id);

// ──────────────────────────────────────────────────────────────
//  POST /api/v1/business
//  Create a business profile for the authenticated user.
// ──────────────────────────────────────────────────────────────
/**
 * @param {import('express').Request}  req  - req.user set by auth middleware
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 *
 * Body: { name / businessName, industry?, businessType?, businessSize? }
 *
 * Responses:
 *   201 – Created    → { success, message, data: { business } }
 *   400 – Validation error
 *   409 – Conflict (profile/membership already exists for this user)
 */
const createBusiness = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, businessName, industry, businessType, businessSize } = req.body;
    const resolvedName = name || businessName;

    // ── 1. Input validation ─────────────────────────────────
    const errors = [];

    if (!resolvedName || String(resolvedName).trim().length < 2) {
      errors.push({ field: 'name', message: 'Business name must be at least 2 characters.' });
    }

    // TODO: The fields 'industry', 'businessType', and 'businessSize' do not exist in the Prisma database schema yet.
    // They need new columns from the database owner. For now, accept and validate only if present, but do not store.
    if (industry !== undefined && industry !== null && String(industry).trim() !== '') {
      if (String(industry).trim().length < 2) {
        errors.push({ field: 'industry', message: 'Industry must be at least 2 characters.' });
      }
    }

    if (businessType !== undefined && businessType !== null && String(businessType).trim() !== '') {
      if (!ALLOWED_BUSINESS_TYPES.includes(String(businessType).toLowerCase().trim())) {
        errors.push({
          field: 'businessType',
          message: `businessType must be one of: ${ALLOWED_BUSINESS_TYPES.join(', ')}.`,
        });
      }
    }

    if (businessSize !== undefined && businessSize !== null && String(businessSize).trim() !== '') {
      if (!ALLOWED_BUSINESS_SIZES.includes(String(businessSize).toLowerCase().trim())) {
        errors.push({
          field: 'businessSize',
          message: `businessSize must be one of: ${ALLOWED_BUSINESS_SIZES.join(', ')}.`,
        });
      }
    }

    if (errors.length > 0) {
      return next(ApiError.badRequest('Validation failed.', errors));
    }

    // ── 2. One-profile-per-user enforcement ────────────────
    const existing = await BusinessModel.findBusinessesByUserId(userId);
    if (existing.length > 0) {
      return next(
        ApiError.conflict(
          'A business profile already exists for this account. Use the update endpoint to modify it.'
        )
      );
    }

    // ── 3. Persist the profile (in one transaction with ADMIN membership) ──
    const business = await BusinessModel.createBusiness({
      userId,
      name: String(resolvedName).trim(),
    });

    return new ApiResponse(201, 'Business profile created successfully.', {
      business: formatBusiness(business),
    }).send(res);
  } catch (err) {
    return next(err);
  }
};

// ──────────────────────────────────────────────────────────────
//  GET /api/v1/business/:id
//  Retrieve a business profile by its ID (UUID).
//  The requesting user must be a member of the business.
// ──────────────────────────────────────────────────────────────
/**
 * Responses:
 *   200 – OK         → { success, message, data: { business } }
 *   400 – Invalid ID (not a UUID)
 *   403 – Forbidden  (user has no membership in this business)
 *   404 – Not found
 */
const getBusiness = async (req, res, next) => {
  try {
    const requestingUserId = req.user.id;
    const businessId = req.params.id;

    if (!isValidUuid(businessId)) {
      return next(ApiError.badRequest('Business ID must be a valid UUID.'));
    }

    const business = await BusinessModel.findBusinessById(businessId);
    if (!business) {
      return next(ApiError.notFound('Business profile not found.'));
    }

    // Ownership check = findMembership (not user_id comparison)
    const membership = await BusinessModel.findMembership(requestingUserId, businessId);
    if (!membership) {
      return next(ApiError.forbidden('You do not have permission to view this business profile.'));
    }

    return new ApiResponse(200, 'Business profile retrieved successfully.', {
      business: formatBusiness({
        ...business,
        role: membership.role,
      }),
    }).send(res);
  } catch (err) {
    return next(err);
  }
};

// ──────────────────────────────────────────────────────────────
//  GET /api/v1/business/me
//  Retrieve the authenticated user's own business profile.
// ──────────────────────────────────────────────────────────────
/**
 * Responses:
 *   200 – OK         → { success, message, data: { business } }
 *   404 – No profile found for this user
 */
const getMyBusiness = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const profiles = await BusinessModel.findBusinessesByUserId(userId);

    if (profiles.length === 0) {
      return next(ApiError.notFound('No business profile found for your account.'));
    }

    return new ApiResponse(200, 'Business profile retrieved successfully.', {
      business: formatBusiness(profiles[0]),
    }).send(res);
  } catch (err) {
    return next(err);
  }
};

// ──────────────────────────────────────────────────────────────
//  Private helper — normalise DB row to required response shape:
//  { id, name, businessName (same as name), slug, role, createdAt }
// ──────────────────────────────────────────────────────────────
const formatBusiness = (row) => ({
  id: row.id,
  name: row.name,
  businessName: row.name,
  slug: row.slug,
  role: row.role || 'ADMIN',
  createdAt: row.createdAt || row.created_at,
});

module.exports = { createBusiness, getBusiness, getMyBusiness };
