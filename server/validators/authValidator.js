'use strict';

const Joi = require('joi');

const registerSchema = {
  body: Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': 'Please provide a name',
      'any.required': 'Please provide a name'
    }),
    email: Joi.string().email().trim().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Please provide an email',
      'any.required': 'Please provide an email'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Please provide a password',
      'any.required': 'Please provide a password'
    }),
    role: Joi.string().valid('user', 'admin').default('user')
  })
};

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().trim().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Please provide an email',
      'any.required': 'Please provide an email'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Please provide a password',
      'any.required': 'Please provide a password'
    })
  })
};

module.exports = {
  registerSchema,
  loginSchema
};
