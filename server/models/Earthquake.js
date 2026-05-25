'use strict';

const mongoose = require('mongoose');

// ── Constants ─────────────────────────────────────────────────────────────────

/** Accepted USGS magnitude type codes */
const MAG_TYPES = ['md', 'ml', 'ms', 'mw', 'me', 'mi', 'mb', 'mlg'];

/** Accepted USGS review-status values */
const STATUSES = ['automatic', 'reviewed', 'deleted'];

/** Accepted USGS event-type values */
const EVENT_TYPES = [
  'earthquake',
  'quarry blast',
  'explosion',
  'nuclear explosion',
  'chemical explosion',
  'mine collapse',
  'other event',
  'not reported',
];

/** Accepted USGS network / contributor codes (non-exhaustive — extend as needed) */
const NET_CODES = [
  'ak', 'at', 'ci', 'hv', 'ld', 'mb', 'nc', 'nm', 'nn', 'pr',
  'pt', 'se', 'us', 'uu', 'uw', 'av', 'ismpkansas',
];

// ── Schema Definition ─────────────────────────────────────────────────────────

/**
 * @typedef  {object} IEarthquake
 * @property {number}   magnitude  - Richter / moment magnitude value
 * @property {string}   place      - Human-readable location description
 * @property {string}   [country]  - Derived country name (optional in raw feed)
 * @property {number}   depth      - Hypocentral depth in kilometres
 * @property {number}   latitude   - Geographic latitude  (−90 … +90)
 * @property {number}   longitude  - Geographic longitude (−180 … +180)
 * @property {string}   magType    - Magnitude measurement method
 * @property {string}   status     - Review status
 * @property {boolean}  tsunami    - Tsunami hazard flag
 * @property {number}   [rms]      - Root-mean-square travel-time residual (seconds)
 * @property {number}   [gap]      - Largest azimuthal gap (degrees)
 * @property {string}   type       - Seismic event type
 * @property {string}   net        - Preferred contributing network code
 * @property {Date}     time       - UTC origin time of the event
 */
const earthquakeSchema = new mongoose.Schema(
  {
    // ── Core seismic measurements ──────────────────────────────────────────

    magnitude: {
      type: Number,
      required: [true, 'Magnitude is required.'],
      min: [-2, 'Magnitude cannot be less than −2.'],
      max: [10, 'Magnitude cannot exceed 10.'],
    },

    place: {
      type: String,
      required: [true, 'Place description is required.'],
      trim: true,
      maxlength: [300, 'Place description must be 300 characters or fewer.'],
    },

    country: {
      type: String,
      trim: true,
      default: null,
      maxlength: [100, 'Country name must be 100 characters or fewer.'],
    },

    depth: {
      type: Number,
      required: [true, 'Depth is required.'],
      min: [0, 'Depth cannot be negative.'],
      max: [1000, 'Depth cannot exceed 1 000 km.'],
      // depth in kilometres; deepest recorded quake was ~700 km
    },

    // ── Geographic coordinates ─────────────────────────────────────────────

    latitude: {
      type: Number,
      required: [true, 'Latitude is required.'],
      min: [-90, 'Latitude must be ≥ −90.'],
      max: [90, 'Latitude must be ≤ 90.'],
    },

    longitude: {
      type: Number,
      required: [true, 'Longitude is required.'],
      min: [-180, 'Longitude must be ≥ −180.'],
      max: [180, 'Longitude must be ≤ 180.'],
    },

    // ── Classification & metadata ──────────────────────────────────────────

    magType: {
      type: String,
      required: [true, 'Magnitude type (magType) is required.'],
      lowercase: true,
      trim: true,
      enum: {
        values: MAG_TYPES,
        message: '"{VALUE}" is not a recognised magnitude type.',
      },
    },

    status: {
      type: String,
      required: [true, 'Status is required.'],
      lowercase: true,
      trim: true,
      enum: {
        values: STATUSES,
        message: '"{VALUE}" is not a valid review status.',
      },
      default: 'automatic',
    },

    tsunami: {
      type: Boolean,
      required: [true, 'Tsunami flag is required.'],
      default: false,
    },

    // ── Quality indicators ─────────────────────────────────────────────────

    rms: {
      type: Number,
      default: null,
      min: [0, 'RMS cannot be negative.'],
      // Root-mean-square travel-time residual in seconds
    },

    gap: {
      type: Number,
      default: null,
      min: [0, 'Azimuthal gap cannot be negative.'],
      max: [360, 'Azimuthal gap cannot exceed 360°.'],
    },

    // ── Event classification ───────────────────────────────────────────────

    type: {
      type: String,
      required: [true, 'Event type is required.'],
      lowercase: true,
      trim: true,
      enum: {
        values: EVENT_TYPES,
        message: '"{VALUE}" is not a recognised event type.',
      },
      default: 'earthquake',
    },

    net: {
      type: String,
      required: [true, 'Network code (net) is required.'],
      lowercase: true,
      trim: true,
      enum: {
        values: NET_CODES,
        message: '"{VALUE}" is not a recognised network code.',
      },
    },

    // ── Temporal ──────────────────────────────────────────────────────────

    time: {
      type: Date,
      required: [true, 'Event time is required.'],
      validate: {
        validator: (v) => v instanceof Date && !isNaN(v.getTime()),
        message: 'Event time must be a valid date.',
      },
    },
  },

  // ── Schema options ─────────────────────────────────────────────────────────
  {
    timestamps: true,          // adds createdAt & updatedAt
    versionKey: '__v',         // keep Mongoose version key explicit
    collection: 'earthquakes', // explicit collection name
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtuals ──────────────────────────────────────────────────────────────────

/**
 * Human-friendly severity label derived from magnitude.
 * @returns {'Minor' | 'Light' | 'Moderate' | 'Strong' | 'Major' | 'Great'}
 */
earthquakeSchema.virtual('severity').get(function () {
  const m = this.magnitude;
  if (m < 3.0) return 'Minor';
  if (m < 4.0) return 'Light';
  if (m < 5.0) return 'Moderate';
  if (m < 6.0) return 'Strong';
  if (m < 7.0) return 'Major';
  return 'Great';
});

/**
 * GeoJSON-compatible coordinates array [longitude, latitude].
 * Useful for map-layer consumption without transforming the document.
 */
earthquakeSchema.virtual('coordinates').get(function () {
  return [this.longitude, this.latitude];
});

// ── Indexes ───────────────────────────────────────────────────────────────────

// Primary query patterns: filter by time range (most common dashboard query)
earthquakeSchema.index({ time: -1 });

// Magnitude-range filters & sorting (e.g., "show all M ≥ 6.0")
earthquakeSchema.index({ magnitude: -1 });

// Geographic bounding-box & proximity queries
earthquakeSchema.index({ latitude: 1, longitude: 1 });

// Country-level aggregation & filtering
earthquakeSchema.index({ country: 1 });

// Compound: time + magnitude — covers the most frequent analytics query
earthquakeSchema.index({ time: -1, magnitude: -1 });

// Compound: country + time — dashboard "events per country over period"
earthquakeSchema.index({ country: 1, time: -1 });

// Status filtering (e.g., exclude 'deleted' events)
earthquakeSchema.index({ status: 1 });

// Tsunami alert queries
earthquakeSchema.index({ tsunami: 1 });

// Network-level analytics
earthquakeSchema.index({ net: 1, time: -1 });

// ── Static Helpers ────────────────────────────────────────────────────────────

/**
 * Fetch recent significant earthquakes above a magnitude threshold.
 *
 * @param {number} [minMag=5.0]   - Minimum magnitude
 * @param {number} [limitDays=30] - Look-back window in days
 * @returns {Promise<IEarthquake[]>}
 */
earthquakeSchema.statics.findSignificant = function (minMag = 5.0, limitDays = 30) {
  const since = new Date();
  since.setDate(since.getDate() - limitDays);

  return this.find({
    magnitude: { $gte: minMag },
    time: { $gte: since },
    status: { $ne: 'deleted' },
  }).sort({ time: -1 });
};

/**
 * Fetch all earthquakes within a geographic bounding box.
 *
 * @param {number} minLat
 * @param {number} maxLat
 * @param {number} minLon
 * @param {number} maxLon
 * @returns {Promise<IEarthquake[]>}
 */
earthquakeSchema.statics.findInBoundingBox = function (minLat, maxLat, minLon, maxLon) {
  return this.find({
    latitude:  { $gte: minLat,  $lte: maxLat },
    longitude: { $gte: minLon, $lte: maxLon },
    status: { $ne: 'deleted' },
  }).sort({ time: -1 });
};

// ── Pre-save Hook ─────────────────────────────────────────────────────────────

/**
 * Normalise the country field to title-case before persisting.
 */
earthquakeSchema.pre('save', function (next) {
  if (this.country && typeof this.country === 'string') {
    this.country = this.country
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
  next();
});

// ── Model Export ──────────────────────────────────────────────────────────────

const Earthquake = mongoose.model('Earthquake', earthquakeSchema);

module.exports = Earthquake;
