/**
 * Configurable CORS origins.
 * - If CORS_ALLOWED_ORIGINS is unset → allow all (dev default, existing behavior).
 * - If set → comma-separated list, e.g. https://app.example.com,https://www.example.com
 */
function buildCorsOptions() {
  const raw = process.env.CORS_ALLOWED_ORIGINS;
  if (!raw || !raw.trim()) {
    return { origin: true, credentials: false };
  }
  const allowed = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    origin(origin, callback) {
      if (!origin || allowed.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS not allowed for origin ${origin}`));
    },
    credentials: false,
  };
}

module.exports = { buildCorsOptions };
