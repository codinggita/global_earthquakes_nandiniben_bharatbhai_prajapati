'use strict';

const express       = require('express');
const cors          = require('cors');
const requestLogger = require('./middlewares/requestLogger');
const { authLimiter, analyticsLimiter, searchLimiter } = require('./middlewares/rateLimiter');

const app = express();

// ── Request logger ──────────────────────────────────────────────────────────
// Mount first so every request is timed from the moment it enters Express.
app.use(requestLogger);

// ── Core middleware ──────────────────────────────────────────────────────────
app.use(cors());                                 // allow cross-origin requests
app.use(express.json());                         // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    status : 'ok',
    uptime : process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ── API routes ───────────────────────────────────────────────────────────────
// Rate limiters are applied per-prefix so every current and future route
// under that prefix is automatically protected.
app.use('/earthquakes', searchLimiter,   require('./routes/earthquakeRoutes'));
app.use('/auth',        authLimiter,     require('./routes/authRoutes'));
app.use('/analytics',   analyticsLimiter, require('./routes/analyticsRoutes'));

// ── Error Handling ───────────────────────────────────────────────────────────
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

module.exports = app;
