'use strict';

// ══════════════════════════════════════════════════════════════
//  ORYN KPI Service
//  Pure deterministic functions — no I/O, no side effects.
//  All functions accept a rows array produced by data.model.js
//  (camelCase keys: revenue, cost, orders, quantity, etc.)
// ══════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────
//  Utility helpers
// ──────────────────────────────────────────────────────────────

/** Safe division — returns 0 instead of Infinity / NaN. */
const safeDivide = (numerator, denominator) => (denominator === 0 ? 0 : numerator / denominator);

/** Round to n decimal places. */
const round = (value, n = 2) => Math.round(value * 10 ** n) / 10 ** n;

/**
 * Convert a DB row (snake_case from model) to numeric fields.
 * Handles both camelCase (controller-formatted) and snake_case (raw DB) rows.
 */
const toNum = (row, key, fallback = 0) => {
  const val = row[key] ?? row[key.replace(/([A-Z])/g, '_$1').toLowerCase()] ?? fallback;
  return parseFloat(val) || 0;
};

// ──────────────────────────────────────────────────────────────
//  Core KPI calculations
// ──────────────────────────────────────────────────────────────

/**
 * Compute core financial KPIs from the full dataset.
 *
 * @param {Object[]} rows  - business_data rows
 * @returns {Object}
 */
const computeFinancials = (rows) => {
  let totalRevenue = 0;
  let totalCost = 0;
  let totalOrders = 0;
  let totalQuantity = 0;
  let totalMarketingSpend = 0;
  let totalReturns = 0;

  for (const r of rows) {
    totalRevenue += toNum(r, 'revenue');
    totalCost += toNum(r, 'cost');
    totalOrders += toNum(r, 'orders');
    totalQuantity += toNum(r, 'quantity');
    totalMarketingSpend += toNum(r, 'marketingSpend') || toNum(r, 'marketing_spend');
    totalReturns += toNum(r, 'returns');
  }

  const netProfit = totalRevenue - totalCost;
  const profitMargin = round(safeDivide(netProfit, totalRevenue) * 100);
  const aov = round(safeDivide(totalRevenue, totalOrders));
  const marketingROI = round(
    safeDivide(totalRevenue - totalMarketingSpend, totalMarketingSpend) * 100
  );
  const returnRate = round(safeDivide(totalReturns, totalOrders) * 100);
  const costToRevenueRatio = round(safeDivide(totalCost, totalRevenue) * 100);

  return {
    totalRevenue: round(totalRevenue),
    totalCost: round(totalCost),
    netProfit: round(netProfit),
    profitMargin,
    totalOrders,
    totalQuantity,
    totalMarketingSpend: round(totalMarketingSpend),
    totalReturns,
    averageOrderValue: aov,
    marketingROI,
    returnRate,
    costToRevenueRatio,
  };
};

// ──────────────────────────────────────────────────────────────
//  Period-over-period growth
// ──────────────────────────────────────────────────────────────

/**
 * Split rows into two halves (first half = older, second = newer)
 * and compute growth rates for the key metrics.
 *
 * @param {Object[]} rows  - sorted ascending by date
 * @returns {Object}
 */
const computeGrowth = (rows) => {
  if (rows.length < 2) {
    return {
      revenueGrowth: 0,
      orderGrowth: 0,
      profitGrowth: 0,
      periodComparison: 'insufficient_data',
    };
  }

  // Sort oldest→newest so first half = prior period
  const sorted = [...rows].sort((a, b) => new Date(a.date) - new Date(b.date));
  const mid = Math.floor(sorted.length / 2);
  const prior = sorted.slice(0, mid);
  const current = sorted.slice(mid);

  const sumField = (arr, key) =>
    arr.reduce(
      (acc, r) => acc + (toNum(r, key) || toNum(r, key.replace(/([A-Z])/g, '_$1').toLowerCase())),
      0
    );

  const growthPct = (curr, prev) => round(safeDivide(curr - prev, Math.abs(prev)) * 100);

  const priorRevenue = sumField(prior, 'revenue');
  const currRevenue = sumField(current, 'revenue');
  const priorOrders = sumField(prior, 'orders');
  const currOrders = sumField(current, 'orders');
  const priorProfit = sumField(prior, 'revenue') - sumField(prior, 'cost');
  const currProfit = sumField(current, 'revenue') - sumField(current, 'cost');

  return {
    revenueGrowth: growthPct(currRevenue, priorRevenue),
    orderGrowth: growthPct(currOrders, priorOrders),
    profitGrowth: growthPct(currProfit, priorProfit),
    priorPeriodRevenue: round(priorRevenue),
    currentPeriodRevenue: round(currRevenue),
    periodComparison: 'half_split',
  };
};

// ──────────────────────────────────────────────────────────────
//  Product-level performance
// ──────────────────────────────────────────────────────────────

/**
 * Rank products by revenue and compute per-product margin.
 *
 * @param {Object[]} rows
 * @returns {Object[]}  Top-N products sorted by revenue desc
 */
const computeProductPerformance = (rows, topN = 10) => {
  const map = new Map();

  for (const r of rows) {
    const pid = String(r.productId || r.product_id || 'unknown');
    const rev = toNum(r, 'revenue');
    const cost = toNum(r, 'cost');
    const orders = toNum(r, 'orders');
    const qty = toNum(r, 'quantity');
    const returns = toNum(r, 'returns');

    if (!map.has(pid)) {
      map.set(pid, { productId: pid, revenue: 0, cost: 0, orders: 0, quantity: 0, returns: 0 });
    }
    const entry = map.get(pid);
    entry.revenue += rev;
    entry.cost += cost;
    entry.orders += orders;
    entry.quantity += qty;
    entry.returns += returns;
  }

  return [...map.values()]
    .map((p) => ({
      ...p,
      revenue: round(p.revenue),
      cost: round(p.cost),
      profit: round(p.revenue - p.cost),
      margin: round(safeDivide(p.revenue - p.cost, p.revenue) * 100),
      returnRate: round(safeDivide(p.returns, p.orders) * 100),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, topN);
};

// ──────────────────────────────────────────────────────────────
//  Monthly time-series aggregation
// ──────────────────────────────────────────────────────────────

/**
 * Aggregate rows by month (YYYY-MM) for charting.
 *
 * @param {Object[]} rows
 * @returns {Object[]}  Sorted by month ascending
 */
const computeMonthlySeries = (rows) => {
  const map = new Map();

  for (const r of rows) {
    const dateStr = String(r.date || '').slice(0, 7); // "YYYY-MM"
    if (!dateStr || dateStr.length < 7) continue;

    if (!map.has(dateStr)) {
      map.set(dateStr, {
        month: dateStr,
        revenue: 0,
        cost: 0,
        orders: 0,
        quantity: 0,
        marketingSpend: 0,
        returns: 0,
      });
    }

    const entry = map.get(dateStr);
    entry.revenue += toNum(r, 'revenue');
    entry.cost += toNum(r, 'cost');
    entry.orders += toNum(r, 'orders');
    entry.quantity += toNum(r, 'quantity');
    entry.marketingSpend += toNum(r, 'marketingSpend') || toNum(r, 'marketing_spend');
    entry.returns += toNum(r, 'returns');
  }

  return [...map.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((m) => ({
      ...m,
      revenue: round(m.revenue),
      cost: round(m.cost),
      marketingSpend: round(m.marketingSpend),
      profit: round(m.revenue - m.cost),
      profitMargin: round(safeDivide(m.revenue - m.cost, m.revenue) * 100),
    }));
};

// ──────────────────────────────────────────────────────────────
//  Repeat customer rate (proxy via customer_id frequency)
// ──────────────────────────────────────────────────────────────

/**
 * Estimate repeat customer rate from unique vs repeated customer IDs.
 *
 * @param {Object[]} rows
 * @returns {{ uniqueCustomers: number, repeatCustomers: number, repeatRate: number }}
 */
const computeCustomerMetrics = (rows) => {
  const freq = new Map();
  for (const r of rows) {
    const cid = String(r.customerId || r.customer_id || '');
    if (!cid) continue;
    freq.set(cid, (freq.get(cid) || 0) + 1);
  }

  const uniqueCustomers = freq.size;
  const repeatCustomers = [...freq.values()].filter((v) => v > 1).length;
  const repeatRate = round(safeDivide(repeatCustomers, uniqueCustomers) * 100);

  return { uniqueCustomers, repeatCustomers, repeatRate };
};

// ──────────────────────────────────────────────────────────────
//  Master runner — returns the full KPI object
// ──────────────────────────────────────────────────────────────

/**
 * Run all KPI computations in one call.
 *
 * @param {Object[]} rows  - Raw rows from DataModel.findDataByBusinessId
 * @returns {Object}       - Complete KPI summary
 */
const computeAllKPIs = (rows) => {
  if (!rows || rows.length === 0) {
    return { error: 'No data rows available for analysis.' };
  }

  const financials = computeFinancials(rows);
  const growth = computeGrowth(rows);
  const topProducts = computeProductPerformance(rows);
  const monthlySeries = computeMonthlySeries(rows);
  const customerMetrics = computeCustomerMetrics(rows);

  return {
    rowCount: rows.length,
    financials,
    growth,
    customerMetrics,
    topProducts,
    monthlySeries,
  };
};

module.exports = {
  computeAllKPIs,
  computeFinancials,
  computeGrowth,
  computeProductPerformance,
  computeMonthlySeries,
  computeCustomerMetrics,
};
