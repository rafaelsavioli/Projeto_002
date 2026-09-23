const { AppError } = require('../utils/AppError');

function notFound(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}

function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation failed', details: err.issues });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Unique constraint violated' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = { notFound, errorHandler };
