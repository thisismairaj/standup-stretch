'use strict';
const { readStdinJson } = require('../lib/plugin-root');
const { deleteState } = require('../lib/session-state');

function main() {
  const input = readStdinJson();
  const sessionId = input.session_id || process.env.CLAUDE_SESSION_ID || 'unknown';
  deleteState(sessionId);
  process.exit(0);
}

try {
  main();
} catch (_) {
  process.exit(0);
}
