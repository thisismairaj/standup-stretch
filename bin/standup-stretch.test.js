'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const binPath = path.join(__dirname, 'standup-stretch.js');
const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'standup-stretch-cli-test-'));

function run(args) {
  return execFileSync(process.execPath, [binPath, ...args], {
    env: { ...process.env, HOME: fakeHome, USERPROFILE: fakeHome },
    encoding: 'utf8',
  });
}

try {
  // status on a fresh fake home starts the timer and reports the full countdown
  const status1 = run(['status']).trim();
  assert.strictEqual(status1, '🧘 90m');

  // check before 90 minutes have passed prints nothing
  const check1 = run(['check']);
  assert.strictEqual(check1, '');

  // check --json before 90 minutes prints an empty systemMessage
  const checkJson1 = JSON.parse(run(['check', '--json']));
  assert.strictEqual(checkJson1.systemMessage, '');

  // reset confirms and keeps the countdown at the top
  const resetOutput = run(['reset']);
  assert.ok(resetOutput.includes('Timer reset'));
  const status2 = run(['status']).trim();
  assert.strictEqual(status2, '🧘 90m');

  // --version prints a bare semver-ish string
  const version = run(['--version']).trim();
  assert.ok(/^\d+\.\d+\.\d+$/.test(version));

  console.log('standup-stretch.test.js passed');
} finally {
  fs.rmSync(fakeHome, { recursive: true, force: true });
}
