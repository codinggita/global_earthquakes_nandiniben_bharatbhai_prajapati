'use strict';

const rateLimit = require('express-rate-limit');

// ─────────────────────────────────────────────────────────────────────────────
// Shared handler — returns a consistent ApiResponse-style JSON body so that
// rate-limit errors look identical to every other API error in the codebase.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Custom handler called when a client exceeds the limit.
 * Sends a 429 JSON response with retry metadata.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
const onLimitReached = (req, res) => {
  res.status(429).json({
    success:    false,
    statusCode: 429,
    message:    'Too many requests. Please slow down and try again later.',
    retryAfter: res.getHeader('Retry-After'),  // seconds until window resets
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Limiter factory
// Centralises config defaults so each limiter only overrides what differs.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a rate limiter with shared defaults and route-specific overrides.
 *
 * @param {object} options - express-rate-limit options to override
 * @returns {import('express-rate-limit').RateLimitRequestHandler}
 */
const createLimiter = (options) =>
  rateLimit({
    // Send standard Retry-After / RateLimit-* headers (RFC 6585)
    standardHeaders: true,
    // Do NOT expose the deprecated X-RateLimit-* headers
    legacyHeaders: false,
    // Use the shared JSON error handler
    handler: onLimitReached,
    // Skip rate limiting entirely in test environments
    skip: () => process.env.NODE_ENV === 'test',
    ...options,
  });

// ─────────────────────────────────────────────────────────────────────────────
// Named limiters
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Auth limiter — strict.
 * Protects /auth/* (login, register) against brute-force and credential stuffing.
 *
 * Allows 20 attempts per 15-minute window per IP.
 */
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit:    20,
  message:  'Too many authentication attempts. Please wait 15 minutes before retrying.',
});

/**
 * Analytics limiter — moderate.
 * Protects /analytics/* which runs expensive MongoDB aggregations.
 *
 * Allows 60 requests per 60-second window per IP.
 */
const analyticsLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit:    60,
  message:  'Analytics rate limit exceeded. Please wait before making more requests.',
});

/**
 * Search / general API limiter — relaxed.
 * Applied to /earthquakes/* (query + search endpoints).
 *
 * Allows 100 requests per 60-second window per IP.
 */
const searchLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit:    100,
  message:  'Request rate limit exceeded. Please slow down.',
});

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  authLimiter,
  analyticsLimiter,
  searchLimiter,
};
