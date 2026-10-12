'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

const SALT_ROUNDS = 12;

// ──────────────────────────────────────────────────────────────
//  Helper — sign a JWT for a given user payload
// ──────────────────────────────────────────────────────────────
const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ──────────────────────────────────────────────────────────────
//  POST /api/v1/auth/register
// ──────────────────────────────────────────────────────────────
/**
 * Register a new user.
 *
 * Body: { name, email, password }
 *
 * Responses:
 *   201 – Created  → { success, message, data: { token, user } }
 *   400 – Bad Request (missing / invalid fields)
 *   409 – Conflict (email already registered)
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // ── 1. Input validation ─────────────────────────────────
    const errors = [];
    if (!name || String(name).trim().length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: 'email', message: 'A valid email address is required.' });
    }
    if (!password || password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters.' });
    }
    if (errors.length > 0) {
      return next(ApiError.badRequest('Validation failed.', errors));
    }

    // ── 2. Duplicate email check ────────────────────────────
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await UserModel.findUserByEmail(normalizedEmail);
    if (existing) {
      return next(ApiError.conflict('An account with this email already exists.'));
    }

    // ── 3. Hash password ────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // ── 4. Persist user ─────────────────────────────────────
    const newUser = await UserModel.createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    // ── 5. Issue JWT ────────────────────────────────────────
    const token = signToken(newUser);

    return new ApiResponse(201, 'Registration successful.', {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.created_at,
      },
    }).send(res);
  } catch (err) {
    return next(err);
  }
};

// ──────────────────────────────────────────────────────────────
//  POST /api/v1/auth/login
// ──────────────────────────────────────────────────────────────
/**
 * Authenticate an existing user.
 *
 * Body: { email, password }
 *
 * Responses:
 *   200 – OK      → { success, message, data: { token, user } }
 *   400 – Bad Request (missing fields)
 *   401 – Unauthorized (wrong credentials)
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ── 1. Input validation ─────────────────────────────────
    if (!email || !password) {
      return next(ApiError.badRequest('Email and password are required.'));
    }

    // ── 2. Fetch user ────────────────────────────────────────
    const normalizedEmail = email.trim().toLowerCase();
    const user = await UserModel.findUserByEmail(normalizedEmail);

    // ── 3. Constant-time comparison (guards against timing attacks) ──
    // We always run bcrypt even when the user doesn't exist so the
    // response time gives no information about whether the email exists.
    const dummyHash = '$2a$12$invalidhashusedtoblocktimingattack000000000000000000000';
    const isMatch = user
      ? await bcrypt.compare(password, user.password_hash)
      : await bcrypt.compare(password, dummyHash).then(() => false);

    if (!user || !isMatch) {
      return next(ApiError.unauthorized('Invalid email or password.'));
    }

    // ── 4. Issue JWT ────────────────────────────────────────
    const token = signToken(user);

    return new ApiResponse(200, 'Login successful.', {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
    }).send(res);
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, login };
