/**
 * Returns the opposite transaction type.
 * @param {'INCOME'|'EXPENSE'} type
 * @returns {'INCOME'|'EXPENSE'}
 */
function oppositeType(type) {
  return type === 'INCOME' ? 'EXPENSE' : 'INCOME';
}

module.exports = { oppositeType };
