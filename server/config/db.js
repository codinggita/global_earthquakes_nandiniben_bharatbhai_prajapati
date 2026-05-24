'use strict';

const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB via Mongoose.
 * Reads the URI from the MONGO_URI environment variable.
 * Should be called once at application startup (inside server.js).
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('[DB] ❌  MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      // These are the recommended production options for Mongoose 6+
      serverSelectionTimeoutMS: 5000,   // fail fast if MongoDB is unreachable
      socketTimeoutMS: 45000,           // close sockets after 45 s of inactivity
    });

    console.log(`[DB] ✅  MongoDB connected → ${conn.connection.host} (db: ${conn.connection.name})`);
  } catch (err) {
    console.error(`[DB] ❌  Connection failed: ${err.message}`);
    process.exit(1); // exit so a process manager (PM2 / Docker) can restart
  }
};

// ── Connection lifecycle events ──────────────────────────────────────────────

mongoose.connection.on('disconnected', () => {
  console.warn('[DB] ⚠️   MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.info('[DB] 🔄  MongoDB reconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[DB] ❌  Mongoose error: ${err.message}`);
});

module.exports = connectDB;
