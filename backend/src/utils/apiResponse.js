'use strict';

/**
 * Standardised success response envelope.
 *
 * Shape:
 * {
 *   "success": true,
 *   "message": "...",
 *   "data": { ... }        // present when data is provided
 * }
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (2xx)
   * @param {string} message    - Human-readable success message
   * @param {*}      [data]     - Optional payload to include under "data"
   */
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    if (data !== null && data !== undefined) {
      this.data = data;
    }
  }

  /**
   * Send this response via an Express `res` object.
   *
   * @param {import('express').Response} res
   */
  send(res) {
    const body = { success: this.success, message: this.message };
    if (this.data !== undefined) body.data = this.data;
    return res.status(this.statusCode).json(body);
  }
}

module.exports = ApiResponse;
