'use strict';

/**
 * Custom application error that extends the native Error class.
 * Carry an HTTP status code and an optional array of field errors
 * so the global error handler can produce consistent JSON.
 *
 * Shape produced by the global error handler:
 * {
 *   "success": false,
 *   "message": "...",
 *   "errors": [ ... ]   // only when field errors are present
 * }
 */
class ApiError extends Error {
  /**
   * @param {number}   statusCode        - HTTP status code (4xx / 5xx)
   * @param {string}   message           - Human-readable error message
   * @param {Array}    [errors=[]]       - Optional field-level error details
   * @param {string}   [stack='']        - Optional pre-existing stack trace
   */
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // ── Convenience factories ─────────────────────────────────

  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Conflict') {
    return new ApiError(409, message);
  }

  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
