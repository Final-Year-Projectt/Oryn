'use strict';

const BusinessModel = require('../models/business.model');
const DataModel = require('../models/data.model');
const AnalysisModel = require('../models/analysis.model');
const KpiService = require('../services/kpi.service');
const MlBridge = require('../services/mlBridge.service');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// ──────────────────────────────────────────────────────────────
//  Shared helper — ownership guard
// ──────────────────────────────────────────────────────────────
const resolveOwnedBusiness = async (businessId, userId) => {
  const business = await BusinessModel.findBusinessById(businessId);
  if (!business) throw ApiError.notFound('Business profile not found.');
  if (business.user_id !== userId)
    throw ApiError.forbidden('You do not have permission to access this business.');
  return business;
};

// ──────────────────────────────────────────────────────────────
//  Problem builder — converts KPIs + ML outputs → problem objects
// ──────────────────────────────────────────────────────────────

/**
 * Rule-based problem detection that operates on KPI outputs.
 * Produces structured problem objects ready for DB persistence.
 *
 * @param {Object} kpis
 * @param {Object} anomalyResult
 * @param {Object} churnResult
 * @param {Object} contributorResult
 * @returns {Object[]}
 */
const buildProblems = (kpis, anomalyResult, churnResult, contributorResult) => {
  const problems = [];
  const { financials, growth, customerMetrics } = kpis;

  // ── 1. Profitability problems ─────────────────────────────
  if (financials.profitMargin < 5) {
    problems.push({
      problemType: 'low_profit_margin',
      severity: financials.profitMargin < 0 ? 'critical' : 'high',
      confidence: 95,
      evidence: {
        profitMargin: financials.profitMargin,
        netProfit: financials.netProfit,
        totalRevenue: financials.totalRevenue,
        totalCost: financials.totalCost,
      },
      recommendations: [
        {
          recommendation:
            'Conduct a detailed cost breakdown to identify and reduce top cost drivers.',
          priority: 'high',
          expectedImpact: 'high',
          difficulty: 'medium',
          risk: 'low',
          reason: `Your profit margin of ${financials.profitMargin}% is critically low. Reducing COGS by even 5% can significantly improve margins.`,
        },
        {
          recommendation:
            'Review pricing strategy — consider value-based pricing for premium segments.',
          priority: 'high',
          expectedImpact: 'high',
          difficulty: 'medium',
          risk: 'medium',
          reason:
            'Increasing prices by 10% with no volume change would directly lift the profit margin.',
        },
      ],
    });
  }

  // ── 2. Revenue decline ────────────────────────────────────
  if (growth.revenueGrowth < -10) {
    problems.push({
      problemType: 'revenue_decline',
      severity: growth.revenueGrowth < -25 ? 'critical' : 'high',
      confidence: 90,
      evidence: {
        revenueGrowth: growth.revenueGrowth,
        priorRevenue: growth.priorPeriodRevenue,
        currentRevenue: growth.currentPeriodRevenue,
      },
      recommendations: [
        {
          recommendation:
            'Identify the top-3 revenue-generating products and increase marketing spend on them.',
          priority: 'critical',
          expectedImpact: 'high',
          difficulty: 'medium',
          risk: 'medium',
          reason: `Revenue declined ${Math.abs(growth.revenueGrowth)}% period-over-period. Concentrating resources on best-sellers reverses decline fastest.`,
        },
        {
          recommendation: 'Launch a re-engagement campaign targeting lapsed customers.',
          priority: 'high',
          expectedImpact: 'medium',
          difficulty: 'easy',
          risk: 'low',
          reason: 'Re-acquiring lapsed customers costs 5× less than acquiring new ones.',
        },
      ],
    });
  }

  // ── 3. High return rate ───────────────────────────────────
  if (financials.returnRate > 15) {
    problems.push({
      problemType: 'high_return_rate',
      severity: financials.returnRate > 30 ? 'high' : 'medium',
      confidence: 88,
      evidence: {
        returnRate: financials.returnRate,
        totalReturns: financials.totalReturns,
        totalOrders: financials.totalOrders,
      },
      recommendations: [
        {
          recommendation:
            'Audit product descriptions and imagery — mismatched expectations are the #1 return driver.',
          priority: 'high',
          expectedImpact: 'medium',
          difficulty: 'easy',
          risk: 'low',
          reason: `A ${financials.returnRate}% return rate erodes margins and increases fulfilment costs.`,
        },
        {
          recommendation:
            'Implement a quality-control checkpoint before dispatch for high-return SKUs.',
          priority: 'medium',
          expectedImpact: 'medium',
          difficulty: 'medium',
          risk: 'low',
          reason:
            'Defective products are typically responsible for 20-40% of returns in e-commerce.',
        },
      ],
    });
  }

  // ── 4. Poor marketing ROI ─────────────────────────────────
  if (financials.marketingROI < 100 && financials.totalMarketingSpend > 0) {
    problems.push({
      problemType: 'low_marketing_roi',
      severity: financials.marketingROI < 0 ? 'high' : 'medium',
      confidence: 85,
      evidence: {
        marketingROI: financials.marketingROI,
        totalMarketingSpend: financials.totalMarketingSpend,
        totalRevenue: financials.totalRevenue,
      },
      recommendations: [
        {
          recommendation:
            'Reallocate marketing budget from low-performing channels to top-converting ones.',
          priority: 'high',
          expectedImpact: 'high',
          difficulty: 'medium',
          risk: 'medium',
          reason: `Marketing ROI of ${financials.marketingROI}% means spend is not generating proportional revenue.`,
        },
        {
          recommendation: 'A/B test ad creatives and landing pages to improve conversion rates.',
          priority: 'medium',
          expectedImpact: 'medium',
          difficulty: 'easy',
          risk: 'low',
          reason: 'Even a 2% improvement in conversion can double marketing ROI.',
        },
      ],
    });
  }

  // ── 5. Low customer retention ─────────────────────────────
  if (customerMetrics.repeatRate < 20 && customerMetrics.uniqueCustomers > 10) {
    problems.push({
      problemType: 'low_customer_retention',
      severity: 'medium',
      confidence: 80,
      evidence: {
        repeatRate: customerMetrics.repeatRate,
        uniqueCustomers: customerMetrics.uniqueCustomers,
        repeatCustomers: customerMetrics.repeatCustomers,
      },
      recommendations: [
        {
          recommendation:
            'Launch a loyalty programme or subscription offering to incentivise repeat purchases.',
          priority: 'high',
          expectedImpact: 'high',
          difficulty: 'medium',
          risk: 'low',
          reason: `Only ${customerMetrics.repeatRate}% of customers make a second purchase. Improving retention by 5% can increase profits 25-95%.`,
        },
        {
          recommendation:
            'Deploy post-purchase email sequences (3-touch within 30 days of first order).',
          priority: 'medium',
          expectedImpact: 'medium',
          difficulty: 'easy',
          risk: 'low',
          reason: 'Automated nurture sequences are one of the highest-ROI retention tactics.',
        },
      ],
    });
  }

  // ── 6. ML anomalies ───────────────────────────────────────
  if (!anomalyResult.isMock && anomalyResult.anomalyCount > 0) {
    problems.push({
      problemType: 'data_anomalies_detected',
      severity: anomalyResult.anomalyRate > 10 ? 'high' : 'medium',
      confidence: 78,
      evidence: {
        anomalyCount: anomalyResult.anomalyCount,
        anomalyRate: anomalyResult.anomalyRate,
        anomalySample: (anomalyResult.anomalies || []).slice(0, 5),
      },
      recommendations: [
        {
          recommendation:
            'Investigate flagged anomalous transactions for data entry errors or fraud signals.',
          priority: 'high',
          expectedImpact: 'medium',
          difficulty: 'medium',
          risk: 'low',
          reason: `${anomalyResult.anomalyCount} anomalous data points were detected by the Isolation Forest model.`,
        },
      ],
    });
  }

  // ── 7. Churn risk ─────────────────────────────────────────
  if (!churnResult.isMock && churnResult.churnRate > 0.2) {
    problems.push({
      problemType: 'high_churn_risk',
      severity: churnResult.churnRate > 0.4 ? 'high' : 'medium',
      confidence: 82,
      evidence: {
        churnRate: churnResult.churnRate,
        atRiskCount: (churnResult.atRiskCustomers || []).length,
      },
      recommendations: [
        {
          recommendation: 'Reach out proactively to at-risk customers with personalised offers.',
          priority: 'high',
          expectedImpact: 'high',
          difficulty: 'medium',
          risk: 'low',
          reason: `Churn rate of ${(churnResult.churnRate * 100).toFixed(1)}% detected. Proactive outreach can recover 15-30% of at-risk customers.`,
        },
      ],
    });
  }

  return problems;
};

// ══════════════════════════════════════════════════════════════
//  Controllers
// ══════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────
//  POST /api/v1/analysis/run
// ──────────────────────────────────────────────────────────────
/**
 * Trigger a full analysis pipeline for a business.
 *
 * Body: { business_id }
 *
 * Responses:
 *   201 – Created  → { success, message, data: { kpis, problems, mlStatus } }
 *   400 – Bad request
 *   403 – Forbidden
 *   404 – Not found / no data
 */
const runAnalysis = async (req, res, next) => {
  try {
    // ── 1. Validate + ownership ─────────────────────────────
    const businessId = parseInt(req.body.business_id, 10);
    if (isNaN(businessId) || businessId < 1) {
      return next(ApiError.badRequest('A valid "business_id" is required in the request body.'));
    }
    await resolveOwnedBusiness(businessId, req.user.id);

    // ── 2. Load dataset ─────────────────────────────────────
    const { rows, total } = await DataModel.findDataByBusinessId(businessId, { limit: 50000 });
    if (total === 0) {
      return next(
        ApiError.badRequest(
          'No data found for this business. Please upload a dataset before running analysis.'
        )
      );
    }

    // ── 3. Compute KPIs (synchronous, pure) ─────────────────
    const kpis = KpiService.computeAllKPIs(rows);

    // ── 4. ML calls (parallel, each has its own fallback) ───
    const [anomalyResult, churnResult, contributorResult, mlStatus] = await Promise.all([
      MlBridge.detectAnomalies(businessId, rows),
      MlBridge.predictChurn(businessId, rows),
      MlBridge.analyzeContributors(businessId, kpis, rows),
      MlBridge.ping(),
    ]);

    // ── 5. Build problem list from rules + ML outputs ────────
    const problems = buildProblems(kpis, anomalyResult, churnResult, contributorResult);

    // ── 6. Persist (clear stale, then save fresh) ────────────
    await AnalysisModel.clearProblemsForBusiness(businessId);
    const savedProblems = await AnalysisModel.saveProblemsWithRecommendations(businessId, problems);

    return new ApiResponse(201, 'Analysis completed successfully.', {
      businessId,
      rowsAnalysed: total,
      kpis,
      problemCount: savedProblems.length,
      problems: savedProblems.map(formatProblem),
      mlStatus,
    }).send(res);
  } catch (err) {
    return next(err);
  }
};

// ──────────────────────────────────────────────────────────────
//  GET /api/v1/analysis/:business_id
// ──────────────────────────────────────────────────────────────
/**
 * Retrieve live KPI summary for a business (re-computed on request).
 */
const getAnalysis = async (req, res, next) => {
  try {
    const businessId = parseInt(req.params.business_id, 10);
    if (isNaN(businessId) || businessId < 1) {
      return next(ApiError.badRequest('business_id must be a positive integer.'));
    }
    await resolveOwnedBusiness(businessId, req.user.id);

    const { rows, total } = await DataModel.findDataByBusinessId(businessId, { limit: 50000 });
    if (total === 0) {
      return next(ApiError.notFound('No dataset found for this business.'));
    }

    const kpis = KpiService.computeAllKPIs(rows);

    return new ApiResponse(200, 'KPI analysis retrieved successfully.', {
      businessId,
      rowsAnalysed: total,
      kpis,
    }).send(res);
  } catch (err) {
    return next(err);
  }
};

// ──────────────────────────────────────────────────────────────
//  GET /api/v1/problems/:business_id
// ──────────────────────────────────────────────────────────────
/**
 * Retrieve stored problems for a business (from the last runAnalysis call).
 */
const getProblems = async (req, res, next) => {
  try {
    const businessId = parseInt(req.params.business_id, 10);
    if (isNaN(businessId) || businessId < 1) {
      return next(ApiError.badRequest('business_id must be a positive integer.'));
    }
    await resolveOwnedBusiness(businessId, req.user.id);

    const problems = await AnalysisModel.findProblemsByBusinessId(businessId);

    return new ApiResponse(200, 'Problems retrieved successfully.', {
      businessId,
      count: problems.length,
      problems: problems.map(formatProblem),
    }).send(res);
  } catch (err) {
    return next(err);
  }
};

// ──────────────────────────────────────────────────────────────
//  GET /api/v1/recommendations/:problem_id
// ──────────────────────────────────────────────────────────────
/**
 * Retrieve ranked recommendations for a specific problem.
 */
const getRecommendations = async (req, res, next) => {
  try {
    const problemId = parseInt(req.params.problem_id, 10);
    if (isNaN(problemId) || problemId < 1) {
      return next(ApiError.badRequest('problem_id must be a positive integer.'));
    }

    const recommendations = await AnalysisModel.findRecommendationsByProblemId(problemId);

    if (recommendations.length === 0) {
      return next(ApiError.notFound('No recommendations found for this problem.'));
    }

    return new ApiResponse(200, 'Recommendations retrieved successfully.', {
      problemId,
      count: recommendations.length,
      recommendations: recommendations.map(formatRecommendation),
    }).send(res);
  } catch (err) {
    return next(err);
  }
};

// ──────────────────────────────────────────────────────────────
//  POST /api/v1/chat
// ──────────────────────────────────────────────────────────────
/**
 * Proxy an AI chat message to the ML bridge.
 *
 * Body: { message, business_id, includeKpis? }
 */
const handleChat = async (req, res, next) => {
  try {
    const { message, business_id: rawBusinessId, includeKpis = false } = req.body;

    if (!message || String(message).trim().length === 0) {
      return next(ApiError.badRequest('A non-empty "message" is required.'));
    }

    const businessId = parseInt(rawBusinessId, 10);
    if (isNaN(businessId) || businessId < 1) {
      return next(ApiError.badRequest('A valid "business_id" is required.'));
    }

    await resolveOwnedBusiness(businessId, req.user.id);

    // Optionally enrich the chat context with live KPIs
    let context = {};
    if (includeKpis) {
      const { rows } = await DataModel.findDataByBusinessId(businessId, { limit: 50000 });
      if (rows.length > 0) {
        context.kpis = KpiService.computeAllKPIs(rows);
      }
    }

    const chatResult = await MlBridge.chat(message.trim(), businessId, context);

    return new ApiResponse(200, 'Chat response received.', {
      message: message.trim(),
      reply: chatResult.reply ?? chatResult,
      isMock: chatResult.isMock ?? false,
    }).send(res);
  } catch (err) {
    return next(err);
  }
};

// ──────────────────────────────────────────────────────────────
//  Private formatters — DB row → camelCase response shape
// ──────────────────────────────────────────────────────────────

const formatProblem = (row) => ({
  id: row.id,
  businessId: row.business_id,
  problemType: row.problem_type,
  severity: row.severity,
  confidence: parseFloat(row.confidence),
  evidence: row.evidence,
  createdAt: row.created_at,
  ...(row.recommendations && { recommendations: row.recommendations.map(formatRecommendation) }),
});

const formatRecommendation = (row) => ({
  id: row.id,
  problemId: row.problem_id,
  recommendation: row.recommendation,
  priority: row.priority,
  expectedImpact: row.expected_impact,
  difficulty: row.difficulty,
  risk: row.risk,
  reason: row.reason,
  createdAt: row.created_at,
});

module.exports = { runAnalysis, getAnalysis, getProblems, getRecommendations, handleChat };
