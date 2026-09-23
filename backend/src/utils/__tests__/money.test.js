// Money helper tests.
const assert = require('node:assert');
const { oppositeType, formatMoney } = require('../money');

assert.strictEqual(oppositeType('INCOME'), 'EXPENSE');
assert.strictEqual(oppositeType('EXPENSE'), 'INCOME');
assert.strictEqual(formatMoney(1234.5), '$1,234.50');
assert.strictEqual(formatMoney(-99.9), '-$99.90');
assert.strictEqual(formatMoney(NaN), '$0.00');
assert.strictEqual(formatMoney(0), '$0.00');

console.log('Money tests passed');
