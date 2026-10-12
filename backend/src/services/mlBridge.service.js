'use strict';

const axios = require('axios');

// ══════════════════════════════════════════════════════════════
//  ORYN ML Bridge Service
//  Thin HTTP client that proxies requests to the Python FastAPI
//  ML microservice.  All calls include a timeout and fall back
//  to safe mock payloads when the service is unreachable so
//  the Node.js API never returns 500 because of ML downtime.
// ══════════════════════════════════════════════════════════════

const ML_BASE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const ML_TIMEOUT_MS = parseInt(process.env.ML_TIMEOUT_MS, 10) || 15_000;
const ML_API_KEY = process.env.ML_API_KEY || '';

// ──────────────────────────────────────────────────────────────
//  Shared axios instance
// ──────────────────────────────────────────────────────────────
const mlClient = axios.create({
  baseURL: ML_BASE_URL,
  timeout: ML_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    ...(ML_API_KEY && { 'X-API-Key': ML_API_KEY }),
  },
});

// ──────────────────────────────────────────────────────────────
//  Error classifier
// ──────────────────────────────────────────────────────────────
const isServiceUnavailable = (err) =>
  err.code === 'ECONNREFUSED' ||
  err.code === 'ECONNRESET' ||
  err.code === 'ETIMEDOUT' ||
  err.code === 'ENOTFOUND' ||
  axios.isAxiosError(err);

// ──────────────────────────────────────────────────────────────
//  Mock / fallback payloads
//  Returned when the ML service is unreachable so the analysis
//  pipeline can still produce a partial result.
// ──────────────────────────────────────────────────────────────
const MOCK_ANOMALY = {
  anomalies: [],
  anomalyCount: 0,
  anomalyRate: 0,
  note: 'ML service unavailable — anomaly detection skipped.',
  isMock: true,
};

const MOCK_CHURN = {
  churnRisk: 'unavailable',
  churnRate: null,
  atRiskCustomers: [],
  note: 'ML service unavailable — churn prediction skipped.',
  isMock: true,
};

const MOCK_CONTRIBUTORS = {
  topContributors: [],
  note: 'ML service unavailable — contributor analysis skipped.',
  isMock: true,
};

const MOCK_CHAT = (message) => ({
  reply: `The AI assistant is temporarily unavailable. Your question was: "${message}"`,
  isMock: true,
});

// ──────────────────────────────────────────────────────────────
//  API methods
// ──────────────────────────────────────────────────────────────

/**
 * Run anomaly detection (Isolation Forest) on the dataset.
 *
 * @param {number}   businessId
 * @param {Object[]} rows       - Normalised data rows
 * @returns {Promise<Object>}
 */
const detectAnomalies = async (businessId, rows) => {
  try {
    const { data } = await mlClient.post('/ml/anomaly-detection', {
      business_id: businessId,
      data: rows,
    });
    return data;
  } catch (err) {
    if (isServiceUnavailable(err)) {
      console.warn('[ML Bridge] Anomaly detection unavailable — using mock.');
      return MOCK_ANOMALY;
    }
    throw err;
  }
};

/**
 * Run churn prediction on customer data.
 *
 * @param {number}   businessId
 * @param {Object[]} rows
 * @returns {Promise<Object>}
 */
const predictChurn = async (businessId, rows) => {
  try {
    const { data } = await mlClient.post('/ml/churn-prediction', {
      business_id: businessId,
      data: rows,
    });
    return data;
  } catch (err) {
    if (isServiceUnavailable(err)) {
      console.warn('[ML Bridge] Churn prediction unavailable — using mock.');
      return MOCK_CHURN;
    }
    throw err;
  }
};

/**
 * Run top-contributor / feature-importance analysis.
 *
 * @param {number}   businessId
 * @param {Object}   kpis        - Pre-computed KPI summary
 * @param {Object[]} rows
 * @returns {Promise<Object>}
 */
const analyzeContributors = async (businessId, kpis, rows) => {
  try {
    const { data } = await mlClient.post('/ml/contributor-analysis', {
      business_id: businessId,
      kpis,
      data: rows,
    });
    return data;
  } catch (err) {
    if (isServiceUnavailable(err)) {
      console.warn('[ML Bridge] Contributor analysis unavailable — using mock.');
      return MOCK_CONTRIBUTORS;
    }
    throw err;
  }
};

/**
 * Proxy a natural-language question to the LLM/AI assistant.
 *
 * @param {string}  message     - User's natural language question
 * @param {number}  businessId
 * @param {Object}  context     - Optional KPI context for grounding the answer
 * @returns {Promise<Object>}
 */
const chat = async (message, businessId, context = {}) => {
  try {
    const { data } = await mlClient.post('/ml/chat', {
      message,
      business_id: businessId,
      context,
    });
    return data;
  } catch (err) {
    if (isServiceUnavailable(err)) {
      console.warn('[ML Bridge] Chat service unavailable — using mock reply.');
      return MOCK_CHAT(message);
    }
    throw err;
  }
};

// ──────────────────────────────────────────────────────────────
//  Health probe — called by the controller to show ML status
// ──────────────────────────────────────────────────────────────

/**
 * Ping the ML service and return its status.
 * Never throws — returns { online: false } on any error.
 *
 * @returns {Promise<{ online: boolean, latencyMs?: number, detail?: string }>}
 */
const ping = async () => {
  const start = Date.now();
  try {
    await mlClient.get('/health', { timeout: 3000 });
    return { online: true, latencyMs: Date.now() - start };
  } catch {
    return { online: false };
  }
};

module.exports = { detectAnomalies, predictChurn, analyzeContributors, chat, ping };
