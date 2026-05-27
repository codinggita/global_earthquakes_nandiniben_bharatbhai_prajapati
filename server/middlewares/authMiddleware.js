'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const { verifyToken } = require('../utils/jwtUtils');

/**
 * Middleware to protect routes by validating the JWT token.
 * Extracts the token, verifies it, and attaches the user to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Standard "Bearer <token>" format
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Reject unauthorized access if no token is found
  if (!token) {
    return next(ApiError.unauthorized('Not authorized to access this route. No token provided.'));
  }

  try {
    // 3. Verify JWT token using our utility function
    const decoded = verifyToken(token);

    // 4. Find the user by ID from the decoded payload and attach to req.user
    // Exclude the password field just to be absolutely sure it never propagates
    const currentUser = await User.findById(decoded.id).select('-password');

    if (!currentUser) {
      return next(ApiError.unauthorized('The user belonging to this token no longer exists.'));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    // 5. Handle invalid and expired tokens specifically
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Your token has expired. Please log in again.'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token. Please log in again.'));
    }
    
    // Fallback for any other verification errors
    return next(ApiError.unauthorized('Not authorized to access this route.'));
  }
});

/**
 * Middleware to restrict routes to specific user roles.
 * Must be executed AFTER the 'protect' middleware so that req.user is populated.
 * 
 * @param {...string} roles - An array of allowed roles (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // 1. Verify req.user exists (set by the protect middleware)
    if (!req.user) {
      return next(ApiError.unauthorized('User not authenticated. Please log in first.'));
    }

    // 2. Check if the user's role is in the list of allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(`User role '${req.user.role}' is not authorized to access this route.`)
      );
    }

    // 3. Authorization successful
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
