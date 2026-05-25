'use strict';

/**
 * @class ApiResponse
 *
 * Standardised success envelope returned by every service function.
 * Keeps controller responses consistent and easy to consume on the client.
 *
 * Shape:
 * {
 *   success:    true,
 *   statusCode: 200,
 *   message:    'Earthquakes retrieved successfully.',
 *   data:       { ... },          // payload (object, array, or null)
 *   pagination: { ... } | null,   // present on paginated list responses
 * }
 *
 * @example
 *   return new ApiResponse(200, 'Done.', earthquake);
 *   return ApiResponse.ok('Fetched.', list, pagination);
 */
class ApiResponse {
  /**
   * @param {number}      statusCode  - HTTP status code (2xx)
   * @param {string}      message     - Human-readable success message
   * @param {*}           [data]      - Response payload
   * @param {object|null} [pagination]- Pagination metadata (for list endpoints)
   */
  constructor(statusCode, message = 'Success.', data = null, pagination = null) {
    this.success    = true;
    this.statusCode = statusCode;
    this.message    = message;
    this.data       = data;

    if (pagination) {
      this.pagination = pagination;
    }
  }

  // ── Factory helpers ──────────────────────────────────────────────────────

  /** 200 OK */
  static ok(message, data = null, pagination = null) {
    return new ApiResponse(200, message, data, pagination);
  }

  /** 201 Created */
  static created(message, data = null) {
    return new ApiResponse(201, message, data);
  }

  /** 204 No Content — data will always be null */
  static noContent(message = 'Deleted successfully.') {
    return new ApiResponse(204, message, null);
  }

  /**
   * Build a pagination metadata object.
   *
   * @param {number} total   - Total number of matching documents
   * @param {number} page    - Current page (1-indexed)
   * @param {number} limit   - Page size
   * @returns {{ total: number, page: number, limit: number, totalPages: number, hasNext: boolean, hasPrev: boolean }}
   */
  static buildPagination(total, page, limit) {
    const totalPages = Math.ceil(total / limit) || 1;
    return {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Serialise to plain object — pass directly as JSON response body.
   * @returns {object}
   */
  toJSON() {
    const obj = {
      success:    this.success,
      statusCode: this.statusCode,
      message:    this.message,
      data:       this.data,
    };

    if (this.pagination) obj.pagination = this.pagination;

    return obj;
  }
}

module.exports = ApiResponse;
