'use strict';
const assert = require('assert');
const fs = require('fs');
const { readState, writeState, deleteState, statePath } = require('./session-state');

const testId = `test-${Date.now()}-${Math.random().toString(36).slice(2)}`;

// readState() returns null before anything is written
assert.strictEqual(readState(testId), null);

// writeState() then readState() round-trips the value
writeState(testId, { sessionStart: 1, lastNudge: 2, lastIndex: 3 });
assert.deepStrictEqual(readState(testId), { sessionStart: 1, lastNudge: 2, lastIndex: 3 });

// A malformed or corrupted state file (non-numeric/missing lastNudge) is
// treated as absent rather than trusted — this is what used to produce
// nonsense like "You've been at it for 29856118 minutes".
fs.writeFileSync(statePath(testId), JSON.stringify({ lastIndex: 3 }), 'utf8');
assert.strictEqual(readState(testId), null);

fs.writeFileSync(statePath(testId), 'not even json', 'utf8');
assert.strictEqual(readState(testId), null);

// deleteState() removes it
writeState(testId, { sessionStart: 1, lastNudge: 2, lastIndex: 3 });
deleteState(testId);
assert.strictEqual(readState(testId), null);

console.log('session-state.test.js passed');
