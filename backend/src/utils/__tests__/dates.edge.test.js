// Smoke test for summary edge cases without HTTP.
const { parseMonth, lastSixMonths, startOfMonth, endOfMonth } = require('../dates');
const assert = require('node:assert');

assert.ok(startOfMonth() <= endOfMonth());
assert.strictEqual(lastSixMonths().length, 6);
assert.strictEqual(parseMonth('2026-02')?.label, '2026-02');
assert.strictEqual(parseMonth('2026-02-30'), null);

const months = lastSixMonths();
const first = parseMonth(months[0]);
assert.ok(first.start < first.end);

console.log('Date edge-case tests passed');
