import assert from 'node:assert';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { INTERVAL_MS } from '../lib/constants.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const binPath = path.join(__dirname, 'standup-stretch.js');
const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'standup-stretch-cli-test-'));
const intervalMinutes = Math.round(INTERVAL_MS / 60000);
const expectedStatus = `🧘 ${intervalMinutes}m`;
function run(args) {
    return execFileSync(process.execPath, [binPath, ...args], {
        env: { ...process.env, HOME: fakeHome, USERPROFILE: fakeHome },
        encoding: 'utf8',
    });
}
try {
    // status on a fresh fake home starts the timer and reports the full countdown
    const status1 = run(['status']).trim();
    assert.strictEqual(status1, expectedStatus);
    // check before the interval has passed prints nothing
    const check1 = run(['check']);
    assert.strictEqual(check1, '');
    // check --json before the interval has passed prints an empty systemMessage
    const checkJson1 = JSON.parse(run(['check', '--json']));
    assert.strictEqual(checkJson1.systemMessage, '');
    // reset confirms with the real interval (this regressed once: it used to
    // hardcode "90 minutes" even when INTERVAL_MS was something else) and
    // keeps the countdown at the top
    const resetOutput = run(['reset']);
    assert.ok(resetOutput.includes('Timer reset'));
    assert.ok(resetOutput.includes(`${intervalMinutes} minute`), `reset message should mention the real interval (${intervalMinutes}m), got: ${resetOutput}`);
    const status2 = run(['status']).trim();
    assert.strictEqual(status2, expectedStatus);
    // --version prints a bare semver-ish string
    const version = run(['--version']).trim();
    assert.ok(/^\d+\.\d+\.\d+$/.test(version));
    console.log('standup-stretch.test.js passed');
}
finally {
    fs.rmSync(fakeHome, { recursive: true, force: true });
}
