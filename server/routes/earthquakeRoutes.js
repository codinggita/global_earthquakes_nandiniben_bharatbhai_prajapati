'use strict';

const express = require('express');
const router = express.Router();

const {
  getAllEarthquakes,
  getEarthquakeById,
  createEarthquake,
  updateEarthquake,
  deleteEarthquake,
} = require('../controllers/earthquakeController');

// ── Earthquake Routes ────────────────────────────────────────────────────────

router
  .route('/')
  .get(getAllEarthquakes)
  .post(createEarthquake);

router
  .route('/:id')
  .get(getEarthquakeById)
  .patch(updateEarthquake)
  .delete(deleteEarthquake);

module.exports = router;
