'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const ApiError = require('./utils/apiError');

// ── Route modules ─────────────────────────────────────────────
const authRoutes = require('./routes/auth.routes');
const businessRoutes = require('./routes/business.routes');
const dataRoutes = require('./routes/data.routes');
const analysisRoutes = require('./routes/analysis.routes');

const app = express();

// ──────────────────────────────────────────────
// CORS — allowed origin list
// ──────────────────────────────────────────────
// Sources: CORS_ORIGINS env var (comma-separated) with sane dev defaults.
// Supports React :3000, Vite :5173, and any production domain you add.
const DEFAULT_ORIGINS = [
  'http://localhost:3000', // CRA / Next.js dev
  'http://localhost:5173', // Vite dev
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

const buildAllowedOrigins = () => {
  const envOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
        .map((o) => o.trim())
        .filter(Boolean)
    : [];
  // Merge env list with dev defaults (deduped)
  return [...new Set([...DEFAULT_ORIGINS, ...envOrigins])];
};

const ALLOWED_ORIGINS = buildAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server / Postman requests (no Origin header)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked request from origin: ${origin}`);
    callback(new Error(`CORS: origin "${origin}" is not allowed.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// ──────────────────────────────────────────────
// Security & request logging
// ──────────────────────────────────────────────
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ──────────────────────────────────────────────
// Body parsers
// ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ──────────────────────────────────────────────
// Health check
// ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    project: 'ORYN',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ──────────────────────────────────────────────
// API Routes  (versioned under /api/v1)
// ──────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/business', businessRoutes);
app.use('/api/v1/data', dataRoutes);
app.use('/api/v1', analysisRoutes); // analysis, problems, recommendations, chat

// ──────────────────────────────────────────────
// 404 handler — unknown routes
// ──────────────────────────────────────────────
app.use((req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
});

// ──────────────────────────────────────────────
// Global error handler
// ──────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // Known application errors — send structured response
  if (err instanceof ApiError) {
    const body = { success: false, message: err.message };
    if (err.errors && err.errors.length > 0) body.errors = err.errors;
    return res.status(err.statusCode).json(body);
  }

  // Unexpected / unhandled errors — log and return 500
  console.error('[Unhandled Error]', err);
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

module.exports = app;
