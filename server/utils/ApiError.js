'use strict';

/**
 * @class ApiError
 * @extends Error
 *
 * Structured error for the API layer.
 * Throw this from service functions and catch it in controllers / error middleware.
 *
 * @example
 *   throw new ApiError(404, 'Earthquake not found.');
 *   throw new ApiError(400, 'Validation failed.', ['magnitude is required']);
 */
class ApiError extends Error {
  /**
   * @param {number}   statusCode - HTTP status code (4xx / 5xx)
   * @param {string}   message    - Human-readable error message
   * @param {string[]} [details]  - Optional array of granular error details
   * @param {string}   [stack]    - Optional stack override (useful in tests)
   */
  constructor(statusCode, message = 'Something went wrong.', details = [], stack = '') {
    super(message);

    this.statusCode = statusCode;
    this.message    = message;
    this.details    = details;
    this.success    = false;

    // Capture stack trace cleanly (excludes constructor frame)
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // ── Factory helpers ──────────────────────────────────────────────────────

  /** 400 Bad Request */
  static badRequest(message = 'Bad request.', details = []) {
    return new ApiError(400, message, details);
  }

  /** 401 Unauthorized */
  static unauthorized(message = 'Unauthorized.') {
    return new ApiError(401, message);
  }

  /** 403 Forbidden */
  static forbidden(message = 'Forbidden.') {
    return new ApiError(403, message);
  }

  /** 404 Not Found */
  static notFound(message = 'Resource not found.') {
    return new ApiError(404, message);
  }

  /** 409 Conflict */
  static conflict(message = 'Conflict.', details = []) {
    return new ApiError(409, message, details);
  }

  /** 422 Unprocessable Entity */
  static unprocessable(message = 'Unprocessable entity.', details = []) {
    return new ApiError(422, message, details);
  }

  /** 500 Internal Server Error */
  static internal(message = 'Internal server error.') {
    return new ApiError(500, message);
  }

  /**
   * Serialise to a plain object — safe to send as JSON response body.
   * @returns {{ success: false, statusCode: number, message: string, details: string[] }}
   */
  toJSON() {
    return {
      success:    false,
      statusCode: this.statusCode,
      message:    this.message,
      details:    this.details,
    };
  }
}

module.exports = ApiError;
