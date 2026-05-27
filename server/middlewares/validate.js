'use strict';

const ApiError = require('../utils/ApiError');

/**
 * Express middleware to validate request data against a provided Joi schema.
 * 
 * @param {Object} schema - Object containing Joi schemas for body, query, or params
 */
const validate = (schema) => (req, res, next) => {
  const validationOptions = {
    abortEarly: false, // Return all errors
    allowUnknown: true, // Allow unknown keys that will be ignored
    stripUnknown: false // Keep unknown keys
  };

  if (schema.body) {
    const { error } = schema.body.validate(req.body, validationOptions);
    if (error) {
      const details = error.details.map((detail) => detail.message.replace(/"/g, ''));
      return next(ApiError.badRequest('Validation Error', details));
    }
  }

  if (schema.query) {
    const { error } = schema.query.validate(req.query, validationOptions);
    if (error) {
      const details = error.details.map((detail) => detail.message.replace(/"/g, ''));
      return next(ApiError.badRequest('Validation Error', details));
    }
  }

  if (schema.params) {
    const { error } = schema.params.validate(req.params, validationOptions);
    if (error) {
      const details = error.details.map((detail) => detail.message.replace(/"/g, ''));
      return next(ApiError.badRequest('Validation Error', details));
    }
  }

  next();
};

module.exports = validate;
