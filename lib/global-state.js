'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const STATE_DIR = path.join(os.homedir(), '.standup-stretch');
const STATE_PATH = path.join(STATE_DIR, 'state.json');

function readGlobalState() {
  try {
    const raw = fs.readFileSync(STATE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Number.isFinite(parsed.lastNudge)) return null;
    return parsed;
  } catch (_) {
    return null;
  }
}

function writeGlobalState(state) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state), 'utf8');
}

module.exports = { readGlobalState, writeGlobalState, STATE_DIR, STATE_PATH };
