'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Point os.homedir() at a throwaway directory before requiring the module,
// since STATE_PATH is computed once at require-time — this must never touch
// the real ~/.standup-stretch of whoever runs the test suite.
const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'standup-stretch-global-state-test-'));
process.env.HOME = fakeHome;
process.env.USERPROFILE = fakeHome;

const { readGlobalState, writeGlobalState, STATE_PATH } = require('./global-state');
assert.ok(STATE_PATH.startsWith(fakeHome), 'global-state must resolve under the fake home, not the real one');

try {
  // readGlobalState() returns null before anything is written
  assert.strictEqual(readGlobalState(), null);

  // writeGlobalState() then readGlobalState() round-trips the value
  writeGlobalState({ lastNudge: 42, lastIndex: 7 });
  assert.deepStrictEqual(readGlobalState(), { lastNudge: 42, lastIndex: 7 });

  // A malformed or corrupted state file (non-numeric/missing lastNudge) is
  // treated as absent rather than trusted — this is what used to produce
  // nonsense like "You've been at it for 29856118 minutes".
  fs.writeFileSync(STATE_PATH, JSON.stringify({ lastIndex: 7 }), 'utf8');
  assert.strictEqual(readGlobalState(), null);

  fs.writeFileSync(STATE_PATH, JSON.stringify({ lastNudge: 'not-a-number' }), 'utf8');
  assert.strictEqual(readGlobalState(), null);

  fs.writeFileSync(STATE_PATH, 'not even json', 'utf8');
  assert.strictEqual(readGlobalState(), null);

  console.log('global-state.test.js passed');
} finally {
  fs.rmSync(fakeHome, { recursive: true, force: true });
}
