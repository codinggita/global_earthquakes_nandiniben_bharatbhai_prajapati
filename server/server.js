'use strict';

// ── Load environment variables FIRST (before any other import uses them) ─────
require('dotenv').config();

const app       = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const ENV  = process.env.NODE_ENV || 'development';

// ── Boot sequence ─────────────────────────────────────────────────────────────
const startServer = async () => {
  // 1. Connect to MongoDB — exits the process on failure (see config/db.js)
  await connectDB();

  // 2. Start HTTP server only after DB is ready
  const server = app.listen(PORT, () => {
    console.log(`[SERVER] 🚀  Running in ${ENV} mode on port ${PORT}`);
  });

  // ── Graceful shutdown ───────────────────────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n[SERVER] 🛑  ${signal} received — shutting down gracefully…`);
    server.close(() => {
      console.log('[SERVER] ✅  HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM')); // Docker / Kubernetes stop
  process.on('SIGINT',  () => shutdown('SIGINT'));  // Ctrl-C in terminal
};

// ── Safety net for unhandled async errors ────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('[SERVER] ❌  Unhandled Promise Rejection:', reason);
  process.exit(1);
});

startServer();
