'use strict';

const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/apiError');

// ──────────────────────────────────────────────────────────────
//  Allowed file types
// ──────────────────────────────────────────────────────────────
const ALLOWED_EXTENSIONS = new Set(['.csv', '.xls', '.xlsx']);
const ALLOWED_MIME_TYPES = new Set([
  'text/csv',
  'application/csv',
  'text/plain', // some OS agents send .csv as text/plain
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/octet-stream', // generic binary fallback
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// ──────────────────────────────────────────────────────────────
//  Storage — memory storage keeps the buffer in req.file.buffer
//  so the parser service can consume it directly without
//  touching the filesystem.
// ──────────────────────────────────────────────────────────────
const storage = multer.memoryStorage();

// ──────────────────────────────────────────────────────────────
//  File filter
// ──────────────────────────────────────────────────────────────
const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  if (ALLOWED_EXTENSIONS.has(ext) || ALLOWED_MIME_TYPES.has(mime)) {
    return cb(null, true);
  }

  return cb(
    ApiError.badRequest(
      `Unsupported file type "${ext}". Only .csv, .xls, and .xlsx files are accepted.`
    ),
    false
  );
};

// ──────────────────────────────────────────────────────────────
//  Multer instance
// ──────────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1, // single file per request
  },
});

// ──────────────────────────────────────────────────────────────
//  Exported middleware — wraps multer to convert its errors into
//  ApiErrors so the global handler renders them consistently.
// ──────────────────────────────────────────────────────────────

/**
 * Single-file upload middleware keyed to the form-data field "file".
 * Attach to routes as:  router.post('/', uploadFile, controller)
 */
const uploadFile = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (!err) return next();

    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(ApiError.badRequest('File exceeds the 10 MB size limit.'));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(ApiError.badRequest('Only one file may be uploaded per request.'));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(ApiError.badRequest('Unexpected field name. Use "file" as the form-data key.'));
    }

    // Re-throw ApiErrors (from fileFilter) or wrap unknowns
    if (err instanceof ApiError) return next(err);
    return next(ApiError.badRequest(err.message || 'File upload failed.'));
  });
};

module.exports = { uploadFile };
