'use strict';

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀  ORYN API server running`);
  console.log(`   ➜  Mode : ${process.env.NODE_ENV}`);
  console.log(`   ➜  Port : http://localhost:${PORT}\n`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n[${signal}] Shutting down gracefully…`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
