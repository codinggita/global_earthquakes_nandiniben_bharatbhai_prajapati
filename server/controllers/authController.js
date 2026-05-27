'use strict';

const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res, next) => {
  // Pass the request body (name, email, password, role) to the service layer
  const response = await authService.registerUser(req.body);
  
  // Send back the standardized API response (which includes the token and secure user object)
  res.status(response.statusCode).json(response);
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res, next) => {
  // Pass the request body (email, password) to the service layer
  const response = await authService.loginUser(req.body);
  
  // Send back the standardized API response
  res.status(response.statusCode).json(response);
});

module.exports = {
  register,
  login
};
