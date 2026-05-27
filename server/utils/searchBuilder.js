'use strict';

/**
 * Escapes regex special characters to prevent errors and optimize matching.
 * 
 * @param {string} text - The search string
 * @returns {string} Escaped search string
 */
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * Builds a MongoDB search filter object from query parameters.
 * Implements case-insensitive regex search.
 * 
 * @param {Object} query - Express request query object
 * @returns {Object} MongoDB query filter object
 */
const buildSearch = (query = {}) => {
  if (!query.q || typeof query.q !== 'string' || query.q.trim() === '') {
    return {};
  }

  // Escape user input to prevent regex injection and ensure optimized matching
  const safeQuery = escapeRegex(query.q.trim());
  const searchRegex = new RegExp(safeQuery, 'i');

  // Search across specified fields
  return {
    $or: [
      { place: searchRegex },
      { country: searchRegex },
      { type: searchRegex },
      { status: searchRegex }
    ]
  };
};

module.exports = buildSearch;
