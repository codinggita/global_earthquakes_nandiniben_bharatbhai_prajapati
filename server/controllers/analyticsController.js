'use strict';

const analyticsService = require('../services/analyticsService');
const asyncHandler    = require('../utils/asyncHandler');

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

/**
 * @desc    Get earthquake count and statistics grouped by country
 * @route   GET /api/analytics/by-country
 * @access  Public
 */
const getEarthquakesByCountry = asyncHandler(async (req, res) => {
  const response = await analyticsService.getEarthquakesByCountry();
  res.status(response.statusCode).json(response);
});

/**
 * @desc    Get earthquake counts grouped and sorted by month
 * @route   GET /api/analytics/monthly-trends
 * @access  Public
 */
const getMonthlyTrends = asyncHandler(async (req, res) => {
  const response = await analyticsService.getMonthlyTrends();
  res.status(response.statusCode).json(response);
});

module.exports = {
  getHighestMagnitudeEarthquakes,
  getEarthquakesByCountry,
  getMonthlyTrends,
};
