'use strict';

const { Router } = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  runAnalysis,
  getAnalysis,
  getProblems,
  getRecommendations,
  handleChat,
} = require('../controllers/analysis.controller');

const router = Router();

// All analysis routes require a valid JWT
router.use(protect);

// ──────────────────────────────────────────────────────────────
//  Analysis Routes  →  mounted at /api/v1  (see app.js)
//  (routes span multiple resource paths, mounted individually)
// ──────────────────────────────────────────────────────────────

/**
 * @route   POST /api/v1/analysis/run
 * @desc    Trigger full KPI + ML analysis pipeline for a business
 * @access  Private (JWT required)
 * @body    { business_id: number }
 */
router.post('/analysis/run', runAnalysis);

/**
 * @route   GET /api/v1/analysis/:business_id
 * @desc    Get live KPI summary for a business (re-computed on request)
 * @access  Private (JWT required — must own the business)
 */
router.get('/analysis/:business_id', getAnalysis);

/**
 * @route   GET /api/v1/problems/:business_id
 * @desc    Get stored detected problems for a business
 * @access  Private (JWT required — must own the business)
 */
router.get('/problems/:business_id', getProblems);

/**
 * @route   GET /api/v1/recommendations/:problem_id
 * @desc    Get ranked recommendations for a specific problem
 * @access  Private (JWT required)
 */
router.get('/recommendations/:problem_id', getRecommendations);

/**
 * @route   POST /api/v1/chat
 * @desc    AI Business Assistant — proxy NL questions to ML bridge
 * @access  Private (JWT required)
 * @body    { message: string, business_id: number, includeKpis?: boolean }
 */
router.post('/chat', handleChat);

module.exports = router;
