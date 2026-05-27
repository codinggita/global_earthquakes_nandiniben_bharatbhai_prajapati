'use strict';

const analyticsService = require('../services/analyticsService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get highest magnitude earthquakes
 * @route   GET /api/analytics/highest-magnitude
 * @access  Public
 */
const getHighestMagnitudeEarthquakes = asyncHandler(async (req, res, next) => {
  // Allow client to specify how many top records they want via query parameter (default to 10)
  const limit = req.query.limit || 10;
  
  const response = await analyticsService.getHighestMagnitudeEarthquakes(limit);
  
  res.status(response.statusCode).json(response);
});

module.exports = {
  getHighestMagnitudeEarthquakes
};
