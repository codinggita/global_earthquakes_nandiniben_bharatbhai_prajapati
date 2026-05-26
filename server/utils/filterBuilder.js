'use strict';

/**
 * Reusable utility to build a MongoDB filter object from query parameters.
 * Supports exact matches, $in for multiple comma-separated values, and ranges ($gte, $lte).
 *
 * @param {Object} query - Express request query object (req.query)
 * @returns {Object} MongoDB filter document
 */
const buildFilter = (query = {}) => {
  const filter = {};

  // Exclude logically-deleted events by default, unless status is specifically queried
  if (query.status) {
    const statuses = query.status.split(',').map(s => s.toLowerCase().trim());
    filter.status = { $in: statuses };
  } else {
    filter.status = { $ne: 'deleted' };
  }

  // Magnitude Range
  if (query.minMagnitude !== undefined || query.maxMagnitude !== undefined) {
    filter.magnitude = {};
    if (query.minMagnitude !== undefined) filter.magnitude.$gte = parseFloat(query.minMagnitude);
    if (query.maxMagnitude !== undefined) filter.magnitude.$lte = parseFloat(query.maxMagnitude);
  }

  // Depth Range
  if (query.minDepth !== undefined || query.maxDepth !== undefined) {
    filter.depth = {};
    if (query.minDepth !== undefined) filter.depth.$gte = parseFloat(query.minDepth);
    if (query.maxDepth !== undefined) filter.depth.$lte = parseFloat(query.maxDepth);
  }

  // Country (Case-insensitive match, supports multiple via comma-separation)
  if (query.country) {
    const countries = query.country.split(',').map(c => new RegExp(`^${c.trim()}$`, 'i'));
    filter.country = { $in: countries };
  }

  // MagType
  if (query.magType) {
    const types = query.magType.split(',').map(t => t.toLowerCase().trim());
    filter.magType = { $in: types };
  }

  // Network (maps to 'net' in schema)
  if (query.network) {
    const networks = query.network.split(',').map(n => n.toLowerCase().trim());
    filter.net = { $in: networks };
  }

  // --- Maintain backward compatibility for other commonly used fields ---
  if (query.type) {
    const types = query.type.split(',').map(t => t.toLowerCase().trim());
    filter.type = { $in: types };
  }

  if (query.tsunami !== undefined) {
    filter.tsunami = query.tsunami === 'true' || query.tsunami === true;
  }

  if (query.startDate || query.endDate) {
    filter.time = {};
    if (query.startDate) filter.time.$gte = new Date(query.startDate);
    if (query.endDate)   filter.time.$lte = new Date(query.endDate);
  }

  return filter;
};

module.exports = buildFilter;
