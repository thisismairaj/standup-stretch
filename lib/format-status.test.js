'use strict';
const assert = require('assert');
const { formatStatus } = require('./format-status');

// Shows the due marker once the interval has elapsed
assert.strictEqual(formatStatus({ elapsedMs: 90 * 60 * 1000, intervalMs: 90 * 60 * 1000, isDue: true }), '🧘 Stretch!');

// Shows a rounded-up minute countdown before it's due
assert.strictEqual(formatStatus({ elapsedMs: 0, intervalMs: 90 * 60 * 1000, isDue: false }), '🧘 90m');
assert.strictEqual(formatStatus({ elapsedMs: 89 * 60 * 1000, intervalMs: 90 * 60 * 1000, isDue: false }), '🧘 1m');

console.log('format-status.test.js passed');
