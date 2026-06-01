'use strict';

const express = require('express');
const router = express.Router();

const { getHighestMagnitudeEarthquakes, getEarthquakesByCountry, getMonthlyTrends } = require('../controllers/analyticsController');

// ── Analytics Routes ─────────────────────────────────────────────────────────

/**
 * GET /api/analytics/highest-magnitude
 * Returns top N earthquakes sorted by magnitude (desc).
 */
router.get('/highest-magnitude', getHighestMagnitudeEarthquakes);

/**
 * GET /api/analytics/by-country
 * Returns earthquake count & stats grouped by country, sorted by count (desc).
 * Aggregation stages used: $group → $sort → $project
 */
router.get('/by-country', getEarthquakesByCountry);

/**
 * GET /api/analytics/monthly-trends
 * Returns earthquake counts grouped by year+month, sorted chronologically.
 * Aggregation stages used: $group ($year/$month) → $sort → $project
 */
router.get('/monthly-trends', getMonthlyTrends);

module.exports = router;
