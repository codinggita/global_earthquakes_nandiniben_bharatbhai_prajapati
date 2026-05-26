'use strict';

/**
 * Wraps an async route handler or middleware.
 * Automatically catches any rejected promises (errors) and passes them to next().
 * This removes the need for repetitive try/catch blocks in every controller.
 *
 * @param {Function} fn - The asynchronous function to wrap
 * @returns {Function} Express middleware/route handler function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
