const express = require('express');
const { requestLogger } = require('./requestLogger');

const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = Number(process.env.RATE_LIMIT_MAX) || 300;
const AUTH_RATE_MAX = Number(process.env.AUTH_RATE_LIMIT_MAX) || 20;

const hits = new Map();

function rateLimit({ max = RATE_MAX, windowMs = RATE_WINDOW_MS } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = hits.get(key);
    if (!entry || now - entry.start > windowMs) {
      entry = { start: now, count: 0 };
      hits.set(key, entry);
    }
    entry.count += 1;
    if (entry.count > max) {
      return res.status(429).json({ error: 'Too many requests, try again later' });
    }
    return next();
  };
}

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of hits) {
    if (now - entry.start > RATE_WINDOW_MS) hits.delete(key);
  }
}

const interval = setInterval(cleanup, RATE_WINDOW_MS);
if (interval.unref) interval.unref();

module.exports = {
  rateLimit,
  requestLogger,
  authRateLimit: rateLimit({ max: AUTH_RATE_MAX }),
  globalRateLimit: rateLimit(),
};
