'use strict';

const AppError = require('../utils/AppError');

/**
 * Handle 404 Not Found errors
 */
const notFound = (req, res, next) => {
  const error = new AppError(`Route not found - ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Handle mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid ID: ${err.value}`;
    error = new AppError(message, 400); // 400 Bad Request
  }

  // Handle mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Handle mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // Handle our existing ApiError structure if it was thrown from the service layer
  if (err.success === false && err.statusCode) {
    error.statusCode = err.statusCode;
    error.message = err.message;
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`[APP] ❌  ${err.stack || err.message}`);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = {
  notFound,
  errorHandler
};
