'use strict';

const mongoose    = require('mongoose');
const Earthquake  = require('../models/Earthquake');
const ApiError    = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Assert that `id` is a valid Mongoose ObjectId.
 * Throws ApiError 400 immediately if not.
 *
 * @param {string} id
 */
const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest(`"${id}" is not a valid earthquake ID.`);
  }
};

/**
 * Parse and clamp pagination query params.
 *
 * @param {object} query       - Express req.query (or equivalent plain object)
 * @returns {{ page: number, limit: number, skip: number }}
 */
const parsePagination = (query = {}) => {
  const page  = Math.max(1, parseInt(query.page,  10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
};

/**
 * Build a Mongoose filter object from query parameters.
 * Only appends a field when the caller actually provided a value.
 *
 * Supported filters:
 *   minMag, maxMag  → magnitude range
 *   country         → exact match (case-insensitive)
 *   status          → exact match
 *   type            → exact match
 *   net             → exact match
 *   tsunami         → boolean ("true" / "false" string accepted)
 *   startDate, endDate → time range (ISO-8601 strings)
 *
 * @param {object} query - Express req.query
 * @returns {object}     - Mongoose filter document
 */
const buildFilter = (query = {}) => {
  const filter = {};

  // Exclude logically-deleted events by default
  filter.status = { $ne: 'deleted' };

  if (query.minMag !== undefined || query.maxMag !== undefined) {
    filter.magnitude = {};
    if (query.minMag !== undefined) filter.magnitude.$gte = parseFloat(query.minMag);
    if (query.maxMag !== undefined) filter.magnitude.$lte = parseFloat(query.maxMag);
  }

  if (query.country) {
    filter.country = { $regex: new RegExp(`^${query.country.trim()}$`, 'i') };
  }

  if (query.status) {
    filter.status = query.status.toLowerCase().trim();
  }

  if (query.type) {
    filter.type = query.type.toLowerCase().trim();
  }

  if (query.net) {
    filter.net = query.net.toLowerCase().trim();
  }

  if (query.tsunami !== undefined) {
    filter.tsunami = query.tsunami === 'true' || query.tsunami === true;
  }

  if (query.startDate || query.endDate) {
    filter.time = {};
    if (query.startDate) filter.time.$gte = new Date(query.startDate);
    if (query.endDate)   filter.time.$lte = new Date(query.endDate);
  }

  return filter;
};

// ─────────────────────────────────────────────────────────────────────────────
// Service Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new Earthquake document.
 *
 * @param {object} data - Raw field values (validated upstream or here)
 * @returns {Promise<ApiResponse>} 201 with the created document
 * @throws  {ApiError} 400 on Mongoose validation failure
 */
const createEarthquake = async (data) => {
  try {
    const earthquake = await Earthquake.create(data);

    return ApiResponse.created('Earthquake created successfully.', earthquake);
  } catch (err) {
    // Surface Mongoose ValidationError as a structured 400
    if (err.name === 'ValidationError') {
      const details = Object.values(err.errors).map((e) => e.message);
      throw ApiError.badRequest('Earthquake validation failed.', details);
    }
    // Re-throw anything else (connection errors, etc.)
    throw err;
  }
};

/**
 * Retrieve a paginated, filtered list of earthquakes.
 *
 * Supported query params (all optional):
 *   page, limit, minMag, maxMag, country, status, type, net,
 *   tsunami, startDate, endDate, sortBy, sortOrder
 *
 * @param {object} query - Express req.query (or plain object with same keys)
 * @returns {Promise<ApiResponse>} 200 with array + pagination metadata
 */
const getAllEarthquakes = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = buildFilter(query);

  // Sorting — default: most recent first
  const sortField = query.sortBy    || 'time';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const sort      = { [sortField]: sortOrder };

  const [earthquakes, total] = await Promise.all([
    Earthquake.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Earthquake.countDocuments(filter),
  ]);

  const pagination = ApiResponse.buildPagination(total, page, limit);

  return ApiResponse.ok(
    `${total} earthquake(s) retrieved successfully.`,
    earthquakes,
    pagination,
  );
};

/**
 * Retrieve a single earthquake by its MongoDB _id.
 *
 * @param {string} id - MongoDB ObjectId string
 * @returns {Promise<ApiResponse>} 200 with the document
 * @throws  {ApiError} 400 for invalid id format | 404 if not found
 */
const getEarthquakeById = async (id) => {
  assertValidId(id);

  const earthquake = await Earthquake.findById(id).lean();

  if (!earthquake) {
    throw ApiError.notFound(`No earthquake found with id "${id}".`);
  }

  return ApiResponse.ok('Earthquake retrieved successfully.', earthquake);
};

/**
 * Update an existing earthquake by id (partial / full update).
 * Uses `runValidators: true` so schema constraints are re-enforced on update.
 *
 * @param {string} id   - MongoDB ObjectId string
 * @param {object} data - Fields to update (partial updates are fine)
 * @returns {Promise<ApiResponse>} 200 with the updated document
 * @throws  {ApiError} 400 for invalid id or validation failure | 404 if not found
 */
const updateEarthquake = async (id, data) => {
  assertValidId(id);

  // Strip fields that must not be mutated externally
  const { _id, __v, createdAt, ...safeData } = data;

  try {
    const updated = await Earthquake.findByIdAndUpdate(
      id,
      { $set: safeData },
      {
        new:            true,   // return the updated document
        runValidators:  true,   // enforce schema validations
        context:        'query',
      },
    ).lean();

    if (!updated) {
      throw ApiError.notFound(`No earthquake found with id "${id}".`);
    }

    return ApiResponse.ok('Earthquake updated successfully.', updated);
  } catch (err) {
    if (err instanceof ApiError) throw err;

    if (err.name === 'ValidationError') {
      const details = Object.values(err.errors).map((e) => e.message);
      throw ApiError.badRequest('Earthquake update validation failed.', details);
    }

    throw err;
  }
};

/**
 * Soft-delete an earthquake by setting status to 'deleted'.
 * A true hard-delete version is also exported for admin use.
 *
 * @param {string}  id       - MongoDB ObjectId string
 * @param {boolean} [hard]   - If true, permanently removes the document
 * @returns {Promise<ApiResponse>} 200 (soft) or 204 (hard)
 * @throws  {ApiError} 400 for invalid id | 404 if not found
 */
const deleteEarthquake = async (id, hard = false) => {
  assertValidId(id);

  const earthquake = await Earthquake.findById(id);

  if (!earthquake) {
    throw ApiError.notFound(`No earthquake found with id "${id}".`);
  }

  if (hard) {
    // Permanent removal — use with caution
    await Earthquake.findByIdAndDelete(id);
    return ApiResponse.noContent('Earthquake permanently deleted.');
  }

  // Soft delete — marks the record as 'deleted', preserves history
  earthquake.status = 'deleted';
  await earthquake.save();

  return ApiResponse.ok('Earthquake deleted (soft) successfully.', { id: earthquake._id });
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  createEarthquake,
  getAllEarthquakes,
  getEarthquakeById,
  updateEarthquake,
  deleteEarthquake,
};
