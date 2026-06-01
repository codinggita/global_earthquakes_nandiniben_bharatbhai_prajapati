'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// ANSI colour helpers (no external dependency required)
// ─────────────────────────────────────────────────────────────────────────────

const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const DIM    = '\x1b[2m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const CYAN   = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const WHITE  = '\x1b[37m';

/**
 * Map an HTTP status code to an ANSI colour string.
 *
 * @param {number} code
 * @returns {string} ANSI colour escape
 */
const statusColour = (code) => {
  if (code >= 500) return RED;
  if (code >= 400) return YELLOW;
  if (code >= 300) return CYAN;
  return GREEN;
};

/**
 * Map an HTTP method to an ANSI colour string.
 *
 * @param {string} method
 * @returns {string} ANSI colour escape
 */
const methodColour = (method) => {
  const map = {
    GET:    GREEN,
    POST:   CYAN,
    PUT:    YELLOW,
    PATCH:  MAGENTA,
    DELETE: RED,
  };
  return map[method] || WHITE;
};

/**
 * Format elapsed high-resolution time as a human-readable string.
 *
 * @param {[number, number]} hrStart - Value from process.hrtime()
 * @returns {string}  e.g. "12.34 ms" or "1234.56 ms"
 */
const formatDuration = (hrStart) => {
  const [sec, ns] = process.hrtime(hrStart);
  const ms = (sec * 1_000 + ns / 1_000_000).toFixed(2);
  return `${ms} ms`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────

const isDev = process.env.NODE_ENV === 'development';

/**
 * @middleware requestLogger
 *
 * Logs every inbound HTTP request and its eventual response.
 *
 * Always logged (all environments):
 *   METHOD  route  timestamp  status  responseTime
 *
 * Additionally logged in development only:
 *   - Query params  (if any)
 *   - Request body  (if any, and only for mutating methods)
 *   - Response headers
 *
 * Uses process.hrtime() for nanosecond-precision response time measurement
 * — independent of system-clock skew.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const requestLogger = (req, res, next) => {
  // Capture high-resolution start time before any downstream work runs.
  const hrStart   = process.hrtime();
  const timestamp = new Date().toISOString();

  // ── Development: log incoming request details ────────────────────────────
  if (isDev) {
    const mCol = methodColour(req.method);
    console.log(
      `\n${DIM}┌─ Incoming Request ──────────────────────────────────────────${RESET}`,
    );
    console.log(
      `${DIM}│${RESET} ${BOLD}${mCol}${req.method.padEnd(7)}${RESET} ${BOLD}${req.originalUrl}${RESET}`,
    );
    console.log(`${DIM}│${RESET} Timestamp : ${timestamp}`);

    const hasQuery = Object.keys(req.query).length > 0;
    if (hasQuery) {
      console.log(`${DIM}│${RESET} Query     : ${JSON.stringify(req.query)}`);
    }

    const isBodyMethod = ['POST', 'PUT', 'PATCH'].includes(req.method);
    if (isBodyMethod && req.body && Object.keys(req.body).length > 0) {
      // Mask sensitive fields to avoid leaking credentials in logs.
      const safeBody = { ...req.body };
      ['password', 'passwordConfirm', 'token', 'secret'].forEach((key) => {
        if (safeBody[key]) safeBody[key] = '***';
      });
      console.log(`${DIM}│${RESET} Body      : ${JSON.stringify(safeBody)}`);
    }

    console.log(
      `${DIM}└─────────────────────────────────────────────────────────────${RESET}`,
    );
  }

  // ── Hook into response finish to log outcome ─────────────────────────────
  res.on('finish', () => {
    const duration  = formatDuration(hrStart);
    const { statusCode } = res;
    const sCol      = statusColour(statusCode);
    const mCol      = methodColour(req.method);

    if (isDev) {
      // Detailed development log
      console.log(
        `\n${DIM}┌─ Response ───────────────────────────────────────────────────${RESET}`,
      );
      console.log(
        `${DIM}│${RESET} ${BOLD}${mCol}${req.method.padEnd(7)}${RESET}` +
        ` ${BOLD}${req.originalUrl}${RESET}`,
      );
      console.log(
        `${DIM}│${RESET} Status    : ${BOLD}${sCol}${statusCode}${RESET}`,
      );
      console.log(`${DIM}│${RESET} Time      : ${BOLD}${duration}${RESET}`);
      console.log(`${DIM}│${RESET} Timestamp : ${timestamp}`);

      // Log response headers only in dev
      const relevantHeaders = {
        'content-type':   res.getHeader('content-type'),
        'content-length': res.getHeader('content-length'),
        'x-powered-by':   res.getHeader('x-powered-by'),
      };
      const filteredHeaders = Object.fromEntries(
        Object.entries(relevantHeaders).filter(([, v]) => v !== undefined),
      );
      if (Object.keys(filteredHeaders).length > 0) {
        console.log(`${DIM}│${RESET} Headers   : ${JSON.stringify(filteredHeaders)}`);
      }

      console.log(
        `${DIM}└─────────────────────────────────────────────────────────────${RESET}\n`,
      );
    } else {
      // Concise single-line log for production / test environments
      console.log(
        `[${timestamp}] ${BOLD}${mCol}${req.method}${RESET}` +
        ` ${req.originalUrl}` +
        ` ${BOLD}${sCol}${statusCode}${RESET}` +
        ` ${DIM}${duration}${RESET}`,
      );
    }
  });

  next();
};

module.exports = requestLogger;
