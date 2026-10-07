'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const STATE_DIR = path.join(os.tmpdir(), 'standup-stretch');

function statePath(sessionId) {
  const safeId = String(sessionId || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(STATE_DIR, `${safeId}.json`);
}

function readState(sessionId) {
  try {
    const raw = fs.readFileSync(statePath(sessionId), 'utf8');
    const parsed = JSON.parse(raw);
    if (!Number.isFinite(parsed.lastNudge)) return null;
    return parsed;
  } catch (_) {
    return null;
  }
}

function writeState(sessionId, state) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(statePath(sessionId), JSON.stringify(state), 'utf8');
}

function deleteState(sessionId) {
  try {
    fs.unlinkSync(statePath(sessionId));
  } catch (_) {}
}

module.exports = { statePath, readState, writeState, deleteState, STATE_DIR };
