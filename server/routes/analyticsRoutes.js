'use strict';

const express = require('express');
const router = express.Router();

const { getHighestMagnitudeEarthquakes } = require('../controllers/analyticsController');

// ── Analytics Routes ─────────────────────────────────────────────────────────

router.get('/highest-magnitude', getHighestMagnitudeEarthquakes);

module.exports = router;
