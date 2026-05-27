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

module.exports = {
  getHighestMagnitudeEarthquakes
};
