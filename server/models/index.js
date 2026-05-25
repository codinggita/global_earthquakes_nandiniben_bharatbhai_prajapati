'use strict';

/**
 * Central model barrel — import all Mongoose models from a single entry point.
 *
 * Usage:
 *   const { Earthquake } = require('./models');
 */

const Earthquake = require('./Earthquake');
const User       = require('./User');
const AuditLog   = require('./AuditLog');

module.exports = {
  Earthquake,
  User,
  AuditLog,
};
