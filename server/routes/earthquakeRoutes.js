'use strict';

const express = require('express');
const router = express.Router();

const {
  getAllEarthquakes,
  getEarthquakeById,
  createEarthquake,
  updateEarthquake,
  deleteEarthquake
} = require('../controllers/earthquakeController');

const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createEarthquakeSchema, updateEarthquakeSchema } = require('../validators/earthquakeValidator');

// ── Earthquake Routes ────────────────────────────────────────────────────────

router
  .route('/')
  .get(getAllEarthquakes)
  .post(protect, authorize('admin'), validate(createEarthquakeSchema), createEarthquake);

router
  .route('/:id')
  .get(getEarthquakeById)
  .patch(protect, authorize('admin'), validate(updateEarthquakeSchema), updateEarthquake)
  .delete(protect, authorize('admin'), deleteEarthquake);

module.exports = router;
