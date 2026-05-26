'use strict';

// Import the service layer that contains all our business logic and database interactions
const earthquakeService = require('../services/earthquakeService');

/**
 * @desc    Get all earthquakes with filtering, sorting, and pagination
 * @access  Public
 */
const getAllEarthquakes = async (req, res, next) => {
  try {
    // req.query contains the URL parameters (e.g., ?page=1&limit=10&minMag=5)
    // We pass these directly to the service to handle filtering and pagination
    const response = await earthquakeService.getAllEarthquakes(req.query);
    
    // Send back the standardized response with the appropriate HTTP status code
    res.status(response.statusCode).json(response);
  } catch (err) {
    // If anything goes wrong, pass the error to Express's global error handler
    next(err);
  }
};

/**
 * @desc    Get a single earthquake by ID
 * @access  Public
 */
const getEarthquakeById = async (req, res, next) => {
  try {
    // req.params.id extracts the 'id' parameter from the URL path (e.g., /api/earthquakes/123)
    const earthquakeId = req.params.id;
    
    // Call the service to find the earthquake by its unique ID
    const response = await earthquakeService.getEarthquakeById(earthquakeId);
    
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new earthquake
 * @access  Private/Admin
 */
const createEarthquake = async (req, res, next) => {
  try {
    // req.body contains the JSON payload sent by the client in the HTTP request
    const earthquakeData = req.body;
    
    // Call the service to validate the data and save the new earthquake to the database
    const response = await earthquakeService.createEarthquake(earthquakeData);
    
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an earthquake by ID
 * @access  Private/Admin
 */
const updateEarthquake = async (req, res, next) => {
  try {
    const earthquakeId = req.params.id;
    const updateData = req.body;
    
    // Pass both the ID of the earthquake to update and the new data to the service
    const response = await earthquakeService.updateEarthquake(earthquakeId, updateData);
    
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete an earthquake by ID (soft delete by default, ?hard=true for hard delete)
 * @access  Private/Admin
 */
const deleteEarthquake = async (req, res, next) => {
  try {
    const earthquakeId = req.params.id;
    
    // Check if the user specifically requested a hard (permanent) delete via URL query
    const isHardDelete = req.query.hard === 'true';
    
    // Ask the service to perform the deletion
    const response = await earthquakeService.deleteEarthquake(earthquakeId, isHardDelete);
    
    // A 204 No Content status means success but there is no JSON body to return
    if (response.statusCode === 204) {
      return res.status(204).send();
    }
    
    // For soft deletes, we might return a 200 OK with a success message
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEarthquakes,
  getEarthquakeById,
  createEarthquake,
  updateEarthquake,
  deleteEarthquake,
};
