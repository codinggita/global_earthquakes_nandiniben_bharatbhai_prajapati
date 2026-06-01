'use strict';

/**
 * Seed script — imports or deletes the sample earthquake dataset.
 *
 * Usage:
 *   npm run seed:import   →  import data (skips duplicates)
 *   npm run seed:delete   →  wipe all earthquake documents
 */

const path    = require('path');
const dotenv  = require('dotenv');
const mongoose = require('mongoose');

// Load env vars before importing anything that reads them
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Earthquake = require('../models/Earthquake');
const rawData    = require('./sample_earthquakes.json');

// ─────────────────────────────────────────────────────────────────────────────
// Field normalisation helpers
// ─────────────────────────────────────────────────────────────────────────────

/** magType values accepted by the Earthquake schema */
const VALID_MAG_TYPES = new Set(['md', 'ml', 'ms', 'mw', 'me', 'mi', 'mb', 'mlg']);

/** Map raw USGS magType codes → schema-valid values */
const normaliseMagType = (raw = '') => {
  const lower = raw.toLowerCase();
  if (VALID_MAG_TYPES.has(lower)) return lower;
  // mwr (regional moment) and mww (W-phase moment) both collapse to 'mw'
  if (lower.startsWith('mw')) return 'mw';
  return 'mb'; // safe fallback
};

/** Network codes accepted by the Earthquake schema */
const VALID_NETS = new Set([
  'ak', 'at', 'ci', 'hv', 'ld', 'mb', 'nc', 'nm', 'nn', 'pr',
  'pt', 'se', 'us', 'uu', 'uw', 'av', 'ismpkansas',
]);

/** Map raw USGS net codes → schema-valid values */
const normaliseNet = (raw = '') => {
  const lower = raw.toLowerCase();
  return VALID_NETS.has(lower) ? lower : 'us'; // fallback to USGS global network
};

/** Parse a numeric string to float; returns null for empty / NaN */
const parseNum = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

/**
 * Transform one raw USGS record into a document that matches the
 * Earthquake Mongoose schema.
 *
 * @param {object} raw - One entry from sample_earthquakes.json
 * @returns {object}   - Schema-compatible document
 */
const transform = (raw) => ({
  magnitude: parseFloat(raw.mag),
  place:     raw.place,
  country:   null,                         // not present in USGS feed
  depth:     parseFloat(raw.depth),
  latitude:  parseFloat(raw.latitude),
  longitude: parseFloat(raw.longitude),
  magType:   normaliseMagType(raw.magType),
  status:    raw.status || 'automatic',
  tsunami:   false,                        // not present in feed; default safe
  rms:       parseNum(raw.rms),
  gap:       parseNum(raw.gap),
  type:      raw.type || 'earthquake',
  net:       normaliseNet(raw.net),
  time:      new Date(raw.time),
});

// ─────────────────────────────────────────────────────────────────────────────
// Database helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Open a Mongoose connection using MONGO_URI from .env */
const connect = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('[Seed] ❌  MONGO_URI is not set in .env');
    process.exit(1);
  }
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log(`[Seed] ✅  Connected → ${mongoose.connection.host} (${mongoose.connection.name})`);
};

/** Gracefully close the Mongoose connection */
const disconnect = async () => {
  await mongoose.disconnect();
  console.log('[Seed] 🔌  Disconnected.');
};

// ─────────────────────────────────────────────────────────────────────────────
// Commands
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Import command — upserts all records from sample_earthquakes.json.
 *
 * Uses bulkWrite with updateOne + upsert so running the script twice never
 * creates duplicate documents. The deduplication key is the combination of
 * (latitude, longitude, time) — effectively unique per seismic event.
 */
const importData = async () => {
  await connect();

  const docs = rawData.map(transform);

  // Build one upsert operation per document
  const ops = docs.map((doc) => ({
    updateOne: {
      filter: {
        latitude:  doc.latitude,
        longitude: doc.longitude,
        time:      doc.time,
      },
      update:  { $setOnInsert: doc }, // never overwrite existing records
      upsert:  true,
    },
  }));

  const result = await Earthquake.bulkWrite(ops, { ordered: false });

  const inserted = result.upsertedCount;
  const skipped  = docs.length - inserted;

  console.log(`[Seed] 📥  Import complete.`);
  console.log(`        Inserted : ${inserted}`);
  console.log(`        Skipped  : ${skipped} (already exist)`);
  console.log(`        Total    : ${docs.length}`);

  await disconnect();
};

/**
 * Delete command — permanently removes ALL documents from the
 * earthquakes collection. Use with caution.
 */
const deleteData = async () => {
  await connect();

  const { deletedCount } = await Earthquake.deleteMany({});

  console.log(`[Seed] 🗑️   Deleted ${deletedCount} earthquake document(s).`);

  await disconnect();
};

// ─────────────────────────────────────────────────────────────────────────────
// Entry point — driven by CLI flag
// ─────────────────────────────────────────────────────────────────────────────

const [,, flag] = process.argv;

if (flag === '--import') {
  importData().catch((err) => {
    console.error('[Seed] ❌  Import failed:', err.message);
    process.exit(1);
  });
} else if (flag === '--delete') {
  deleteData().catch((err) => {
    console.error('[Seed] ❌  Delete failed:', err.message);
    process.exit(1);
  });
} else {
  console.log('Usage:');
  console.log('  npm run seed:import   →  import sample data (skips duplicates)');
  console.log('  npm run seed:delete   →  wipe all earthquake documents');
  process.exit(0);
}
