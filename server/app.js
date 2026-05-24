'use strict';

const express = require('express');
const cors    = require('cors');

const app = express();

// ── Core middleware ──────────────────────────────────────────────────────────
app.use(cors());                              // allow cross-origin requests
app.use(express.json());                      // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    status : 'ok',
    uptime : process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ── Placeholder for future API routes ────────────────────────────────────────
// app.use('/api/v1/earthquakes', require('./routes/earthquakeRoutes'));

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[APP] ❌  ${err.stack || err.message}`);
  res.status(statusCode).json({
    success : false,
    message : err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
