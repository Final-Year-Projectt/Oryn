'use strict';

const { Router } = require('express');
const { register, login } = require('../controllers/auth.controller');

const router = Router();

// ──────────────────────────────────────────────────────────────
//  Auth Routes  →  mounted at /api/v1/auth  (see app.js)
// ──────────────────────────────────────────────────────────────

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { name: string, email: string, password: string }
 */
router.post('/register', register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and receive JWT
 * @access  Public
 * @body    { email: string, password: string }
 */
router.post('/login', login);

module.exports = router;
