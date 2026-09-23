/**
 * Returns the opposite transaction type.
 * @param {'INCOME'|'EXPENSE'} type
 * @returns {'INCOME'|'EXPENSE'}
 */
function oppositeType(type) {
  return type === 'INCOME' ? 'EXPENSE' : 'INCOME';
}

/**
 * Formats a number as USD without Intl (fallback / tests).
 * @param {number} amount
 * @returns {string}
 */
function formatMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '$0.00';
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  const fixed = abs.toFixed(2);
  const [int, dec] = fixed.split('.');
  const withSeparators = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}$${withSeparators}.${dec}`;
}

module.exports = { oppositeType, formatMoney };
