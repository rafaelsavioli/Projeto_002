const { env } = require('../config/env');

function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    if (env.nodeEnv !== 'test') {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`);
    }
  });
  next();
}

module.exports = { requestLogger };
