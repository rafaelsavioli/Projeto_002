// Lightweight unit tests without external deps — run via `npm run test:unit`.

const assert = require('node:assert');
const { oppositeType } = require('../money');
const { parseMonth, lastSixMonths } = require('../dates');

function testOppositeType() {
  assert.strictEqual(oppositeType('INCOME'), 'EXPENSE');
  assert.strictEqual(oppositeType('EXPENSE'), 'INCOME');
}

function testParseMonth() {
  assert.strictEqual(parseMonth('2026-13'), null);
  assert.strictEqual(parseMonth('bad'), null);
  const range = parseMonth('2026-09');
  assert.ok(range);
  assert.strictEqual(range.label, '2026-09');
  assert.strictEqual(range.start.getMonth(), 8);
}

function testLastSixMonths() {
  const months = lastSixMonths();
  assert.strictEqual(months.length, 6);
  assert.match(months[0], /^\d{4}-\d{2}$/);
}

testOppositeType();
testParseMonth();
testLastSixMonths();
console.log('All unit tests passed');
