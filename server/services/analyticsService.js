'use strict';

const Earthquake = require('../models/Earthquake');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Get the highest magnitude earthquakes using MongoDB aggregation pipeline.
 * Utilizes $sort, $limit, and $project stages.
 * 
 * @param {number} limit - The number of top records to return (default 10)
 * @returns {Promise<ApiResponse>} A 200 OK response with the aggregated data
 */
const getHighestMagnitudeEarthquakes = async (limit = 10) => {
  const topEarthquakes = await Earthquake.aggregate([
    // 1. Sort all earthquakes by magnitude in descending order (highest first)
    { $sort: { magnitude: -1 } },
    
    // 2. Limit the result set to the specified top N records
    { $limit: parseInt(limit, 10) },
    
    // 3. Project only the relevant fields to optimize the payload
    {
      $project: {
        _id: 1,
        magnitude: 1,
        place: 1,
        time: 1,
        depth: 1,
        type: 1,
        status: 1
      }
    }
  ]);

  return ApiResponse.ok('Highest magnitude earthquakes retrieved successfully.', topEarthquakes);
};

/**
 * Get earthquake statistics grouped by country using MongoDB aggregation.
 * Pipeline stages: $group → $sort → $project
 *
 * @returns {Promise<ApiResponse>} A 200 OK response with grouped country data
 */
const getEarthquakesByCountry = async () => {
  const countryStats = await Earthquake.aggregate([
    // ── Stage 1: $group ─────────────────────────────────────────────────────
    // Group all documents by the `country` field.
    // Accumulate: total count, average magnitude, maximum magnitude.
    {
      $group: {
        _id: '$country',               // group key
        earthquakeCount: { $sum: 1 },  // count documents per country
        avgMagnitude:    { $avg: '$magnitude' },
        maxMagnitude:    { $max: '$magnitude' },
      },
    },

    // ── Stage 2: $sort ──────────────────────────────────────────────────────
    // Sort countries by highest earthquake count first (descending).
    { $sort: { earthquakeCount: -1 } },

    // ── Stage 3: $project ───────────────────────────────────────────────────
    // Reshape output: rename _id → country, round floating-point values.
    {
      $project: {
        _id: 0,
        country:        { $ifNull: ['$_id', 'Unknown'] },
        earthquakeCount: 1,
        avgMagnitude:   { $round: ['$avgMagnitude', 2] },
        maxMagnitude:   1,
      },
    },
  ]);

  return ApiResponse.ok(
    'Country-wise earthquake statistics retrieved successfully.',
    {
      totalCountries: countryStats.length,
      countries: countryStats,
    }
  );
};

/**
 * Get monthly earthquake trends using MongoDB aggregation.
 * Pipeline stages: $group (with $month / $year) → $sort
 *
 * @returns {Promise<ApiResponse>} A 200 OK response with monthly trend data
 */
const getMonthlyTrends = async () => {
  const MONTH_NAMES = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const monthlyStats = await Earthquake.aggregate([
    // ── Stage 1: $group ─────────────────────────────────────────────────────
    // Extract the numeric year and month from the `time` Date field using
    // the $year and $month date operators, then group on that compound key.
    {
      $group: {
        _id: {
          year:  { $year:  '$time' },   // e.g. 2024
          month: { $month: '$time' },   // 1 (Jan) … 12 (Dec)
        },
        earthquakeCount: { $sum: 1 },
        avgMagnitude:    { $avg: '$magnitude' },
        maxMagnitude:    { $max: '$magnitude' },
      },
    },

    // ── Stage 2: $sort ──────────────────────────────────────────────────────
    // Sort chronologically: oldest year first, then month ascending (1 → 12).
    // This guarantees correct month order regardless of insertion order.
    {
      $sort: {
        '_id.year':  1,
        '_id.month': 1,
      },
    },

    // ── Stage 3: $project ───────────────────────────────────────────────────
    // Reshape: expose year, month number, and a human-readable month label.
    {
      $project: {
        _id:            0,
        year:           '$_id.year',
        month:          '$_id.month',
        earthquakeCount: 1,
        avgMagnitude:   { $round: ['$avgMagnitude', 2] },
        maxMagnitude:   1,
      },
    },
  ]);

  // Attach a human-readable month name to each bucket after aggregation
  const enriched = monthlyStats.map((entry) => ({
    ...entry,
    monthName: MONTH_NAMES[entry.month] || 'Unknown',
    period:    `${entry.year}-${String(entry.month).padStart(2, '0')}`,
  }));

  return ApiResponse.ok(
    'Monthly earthquake trends retrieved successfully.',
    {
      totalMonths: enriched.length,
      trends: enriched,
    }
  );
};

module.exports = {
  getHighestMagnitudeEarthquakes,
  getEarthquakesByCountry,
  getMonthlyTrends,
};
