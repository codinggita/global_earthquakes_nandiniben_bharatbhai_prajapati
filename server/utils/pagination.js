'use strict';

/**
 * Reusable utility to parse query parameters and calculate pagination metadata for MongoDB queries.
 *
 * @param {Object} query - Express request query object (req.query)
 * @param {Number} totalRecords - Total number of documents matching the query filter
 * @returns {Object} Contains MongoDB skip/limit values and pagination metadata
 */
const getPagination = (query, totalRecords) => {
  const currentPage = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (currentPage - 1) * limit;

  const totalPages = Math.ceil(totalRecords / limit) || 1;

  return {
    skip,
    limit,
    pagination: {
      currentPage,
      totalPages,
      totalRecords,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    }
  };
};

module.exports = getPagination;
