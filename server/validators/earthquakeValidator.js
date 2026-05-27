'use strict';

const Joi = require('joi');

const createEarthquakeSchema = {
  body: Joi.object({
    magnitude: Joi.number().required().messages({
      'any.required': 'Magnitude is required',
      'number.base': 'Magnitude must be a number'
    }),
    depth: Joi.number().required().messages({
      'any.required': 'Depth is required',
      'number.base': 'Depth must be a number'
    }),
    latitude: Joi.number().min(-90).max(90).required().messages({
      'any.required': 'Latitude is required',
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90'
    }),
    longitude: Joi.number().min(-180).max(180).required().messages({
      'any.required': 'Longitude is required',
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180'
    }),
    status: Joi.string().valid('automatic', 'reviewed', 'deleted').required().messages({
      'any.required': 'Status is required',
      'any.only': 'Status must be automatic, reviewed, or deleted'
    }),
    magType: Joi.string().required().messages({
      'any.required': 'Magnitude Type is required'
    })
  })
};

const updateEarthquakeSchema = {
  body: Joi.object({
    magnitude: Joi.number().messages({
      'number.base': 'Magnitude must be a number'
    }),
    depth: Joi.number().messages({
      'number.base': 'Depth must be a number'
    }),
    latitude: Joi.number().min(-90).max(90).messages({
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90'
    }),
    longitude: Joi.number().min(-180).max(180).messages({
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180'
    }),
    status: Joi.string().valid('automatic', 'reviewed', 'deleted').messages({
      'any.only': 'Status must be automatic, reviewed, or deleted'
    }),
    magType: Joi.string()
  })
};

module.exports = {
  createEarthquakeSchema,
  updateEarthquakeSchema
};
