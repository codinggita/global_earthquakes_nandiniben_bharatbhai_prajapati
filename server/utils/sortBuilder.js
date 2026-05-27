'use strict';

/**
 * Builds a MongoDB sort object from query parameters.
 * Validates against allowed sort fields and determines sort order.
 * 
 * @param {Object} query - Express request query object
 * @returns {Object} Mongoose compatible sort object
 */
const buildSort = (query = {}) => {
  const allowedSortFields = ['magnitude', 'depth', 'time', 'gap', 'rms'];
  
  // Default sorting is by time descending
  let sortField = 'time';
  let sortOrder = -1;

  // Validate and set sort field
  if (query.sortBy && allowedSortFields.includes(query.sortBy)) {
    sortField = query.sortBy;
  }

  // Validate and set sort order (asc = 1, desc = -1)
  if (query.sortOrder && query.sortOrder.toLowerCase() === 'asc') {
    sortOrder = 1;
  } else if (query.sortOrder && query.sortOrder.toLowerCase() === 'desc') {
    sortOrder = -1;
  }

  return { [sortField]: sortOrder };
};

module.exports = buildSort;
