'use strict';

const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

// ──────────────────────────────────────────────────────────────
//  protect — JWT authentication middleware
// ──────────────────────────────────────────────────────────────
/**
 * Extracts a Bearer token from the Authorization header, verifies
 * it against JWT_SECRET, and attaches the decoded payload to
 * `req.user` so downstream handlers can read `req.user.id` and
 * `req.user.email`.
 *
 * On failure it forwards a 401 ApiError to the global error handler.
 */
const protect = (req, _res, next) => {
  try {
    // ── 1. Extract token ──────────────────────────────────────
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('No authentication token provided.'));
    }

    const token = authHeader.slice(7).trim(); // strip "Bearer "

    if (!token) {
      return next(ApiError.unauthorized('Authentication token is empty.'));
    }

    // ── 2. Verify token ───────────────────────────────────────
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ── 3. Attach minimal payload to request ──────────────────
    // We only store id + email — never the full DB row — to keep
    // the surface area small and avoid stale data issues.
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    return next();
  } catch (err) {
    // Distinguish expiry from other JWT errors for clearer messages
    if (err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Authentication token has expired. Please log in again.'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid authentication token.'));
    }
    return next(err);
  }
};

module.exports = { protect };
