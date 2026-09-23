function sanitizeInput(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = { sanitizeInput, escapeHtml };
