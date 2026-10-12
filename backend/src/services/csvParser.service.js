'use strict';

const { Readable } = require('stream');
const csvParser = require('csv-parser');
const XLSX = require('xlsx');
const path = require('path');
const ApiError = require('../utils/apiError');

// ──────────────────────────────────────────────────────────────
//  Required column names (case-insensitive, flexible separators)
// ──────────────────────────────────────────────────────────────
const REQUIRED_COLUMNS = [
  'date',
  'product_id',
  'customer_id',
  'orders',
  'quantity',
  'revenue',
  'cost',
  'marketing_spend',
  'inventory',
  'returns',
];

// Flexible aliases — maps alternative column names → canonical key
const COLUMN_ALIASES = {
  date: ['date', 'order_date', 'transaction_date', 'sale_date'],
  product_id: ['product_id', 'productid', 'product id', 'sku', 'item_id'],
  customer_id: ['customer_id', 'customerid', 'customer id', 'client_id'],
  orders: ['orders', 'order_count', 'num_orders', 'total_orders'],
  quantity: ['quantity', 'qty', 'units', 'units_sold'],
  revenue: ['revenue', 'sales', 'total_revenue', 'total_sales', 'gross_revenue'],
  cost: ['cost', 'cogs', 'total_cost', 'cost_of_goods'],
  marketing_spend: ['marketing_spend', 'marketing', 'ad_spend', 'advertising_spend', 'ads'],
  inventory: ['inventory', 'stock', 'inventory_level', 'stock_level'],
  returns: ['returns', 'refunds', 'return_count', 'total_returns'],
};

// ──────────────────────────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────────────────────────

/**
 * Build a reverse lookup: raw column name → canonical key.
 * Applied after reading the header row of each file.
 *
 * @param {string[]} rawHeaders
 * @returns {{ map: Object, missing: string[] }}
 */
const buildColumnMap = (rawHeaders) => {
  const normalised = rawHeaders.map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const map = {};

  for (const [canonical, aliases] of Object.entries(COLUMN_ALIASES)) {
    const matched = normalised.find((h) => aliases.includes(h));
    if (matched) {
      // find the original (un-normalised) header that matched
      const original = rawHeaders[normalised.indexOf(matched)];
      map[original] = canonical;
    }
  }

  const mapped = new Set(Object.values(map));
  const missing = REQUIRED_COLUMNS.filter((c) => !mapped.has(c));

  return { map, missing };
};

/**
 * Sanitise and coerce a raw row object into the DB schema shape.
 * Returns null if the row is entirely empty (blank lines).
 *
 * @param {Object} raw         - Raw key-value object from parser
 * @param {Object} columnMap   - { rawKey → canonicalKey }
 * @param {number} rowIndex    - 1-based row number for error messages
 * @returns {{ data: Object|null, errors: string[] }}
 */
const coerceRow = (raw, columnMap, rowIndex) => {
  // Remap keys → canonical names
  const remapped = {};
  for (const [rawKey, value] of Object.entries(raw)) {
    const canonical = columnMap[rawKey];
    if (canonical) remapped[canonical] = value;
  }

  // Skip truly blank rows
  if (Object.values(remapped).every((v) => v === '' || v == null)) {
    return { data: null, errors: [] };
  }

  const errors = [];

  // date — must parse to a valid ISO date
  const rawDate = String(remapped.date || '').trim();
  const parsedDate = new Date(rawDate);
  if (!rawDate || isNaN(parsedDate.getTime())) {
    errors.push(`Row ${rowIndex}: invalid date "${rawDate}".`);
  }

  // String fields
  const productId = String(remapped.product_id || '').trim();
  const customerId = String(remapped.customer_id || '').trim();
  if (!productId) errors.push(`Row ${rowIndex}: product_id is empty.`);
  if (!customerId) errors.push(`Row ${rowIndex}: customer_id is empty.`);

  // Integer fields
  const toInt = (val, field) => {
    const n = parseInt(val, 10);
    if (isNaN(n)) errors.push(`Row ${rowIndex}: "${field}" must be an integer (got "${val}").`);
    return n;
  };

  // Numeric fields
  const toDecimal = (val, field) => {
    const n = parseFloat(val);
    if (isNaN(n)) errors.push(`Row ${rowIndex}: "${field}" must be a number (got "${val}").`);
    return n;
  };

  const orders = toInt(remapped.orders, 'orders');
  const quantity = toInt(remapped.quantity, 'quantity');
  const inventory = toInt(remapped.inventory, 'inventory');
  const returns = toInt(remapped.returns ?? 0, 'returns');
  const revenue = toDecimal(remapped.revenue, 'revenue');
  const cost = toDecimal(remapped.cost, 'cost');
  const marketingSpend = toDecimal(remapped.marketing_spend ?? 0, 'marketing_spend');

  if (errors.length > 0) return { data: null, errors };

  return {
    data: {
      date: parsedDate.toISOString().split('T')[0], // YYYY-MM-DD
      product_id: productId,
      customer_id: customerId,
      orders,
      quantity,
      revenue,
      cost,
      marketing_spend: marketingSpend,
      inventory,
      returns,
    },
    errors: [],
  };
};

// ──────────────────────────────────────────────────────────────
//  CSV Parser  (uses csv-parser streaming on an in-memory buffer)
// ──────────────────────────────────────────────────────────────

/**
 * Parse a CSV buffer into an array of normalised row objects.
 *
 * @param {Buffer} buffer
 * @returns {Promise<{ rows: Object[], parseErrors: string[], missing: string[] }>}
 */
const parseCsv = (buffer) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    const parseErrors = [];
    let columnMap = null;
    let missing = [];
    let rowIndex = 1;

    const stream = Readable.from(buffer);

    stream
      .pipe(csvParser({ mapHeaders: ({ header }) => header.trim() }))
      .on('headers', (headers) => {
        const result = buildColumnMap(headers);
        columnMap = result.map;
        missing = result.missing;
      })
      .on('data', (raw) => {
        rowIndex += 1;
        if (missing.length > 0) return; // don't process rows if headers are already wrong

        const { data, errors } = coerceRow(raw, columnMap, rowIndex);
        if (errors.length > 0) parseErrors.push(...errors);
        else if (data) rows.push(data);
      })
      .on('end', () => resolve({ rows, parseErrors, missing }))
      .on('error', (err) => reject(ApiError.badRequest(`CSV parse error: ${err.message}`)));
  });
};

// ──────────────────────────────────────────────────────────────
//  Excel Parser  (xlsx works entirely in memory from Buffer)
// ──────────────────────────────────────────────────────────────

/**
 * Parse an XLS / XLSX buffer into an array of normalised row objects.
 *
 * @param {Buffer} buffer
 * @returns {{ rows: Object[], parseErrors: string[], missing: string[] }}
 */
const parseExcel = (buffer) => {
  let workbook;
  try {
    workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  } catch (err) {
    throw ApiError.badRequest(`Excel parse error: ${err.message}`);
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw ApiError.badRequest('The Excel file contains no sheets.');

  const sheet = workbook.Sheets[sheetName];
  // header:1 → first row becomes an array of header strings
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (rawData.length < 2) {
    throw ApiError.badRequest('The Excel file contains no data rows.');
  }

  const rawHeaders = rawData[0].map(String);
  const { map: columnMap, missing } = buildColumnMap(rawHeaders);

  const rows = [];
  const parseErrors = [];

  for (let i = 1; i < rawData.length; i++) {
    const rawRow = rawData[i];
    // Convert array row → { headerName: value } object
    const raw = {};
    rawHeaders.forEach((h, idx) => {
      raw[h] = rawRow[idx] !== undefined ? rawRow[idx] : '';
    });

    if (missing.length > 0) break; // header error — no point parsing

    const { data, errors } = coerceRow(raw, columnMap, i + 1);
    if (errors.length > 0) parseErrors.push(...errors);
    else if (data) rows.push(data);
  }

  return { rows, parseErrors, missing };
};

// ──────────────────────────────────────────────────────────────
//  Public API
// ──────────────────────────────────────────────────────────────

/**
 * Dispatch to the correct parser based on file extension.
 *
 * @param {Buffer} buffer          - In-memory file buffer from multer
 * @param {string} originalname    - Original filename (for extension detection)
 * @returns {Promise<{ rows: Object[], parseErrors: string[], missing: string[] }>}
 */
const parseFile = async (buffer, originalname) => {
  const ext = path.extname(originalname).toLowerCase();

  if (ext === '.csv') {
    return parseCsv(buffer);
  }

  if (ext === '.xls' || ext === '.xlsx') {
    // parseExcel is synchronous; wrap in a resolved promise for a consistent API
    return Promise.resolve(parseExcel(buffer));
  }

  throw ApiError.badRequest(`Unsupported file extension "${ext}".`);
};

module.exports = { parseFile, REQUIRED_COLUMNS };
