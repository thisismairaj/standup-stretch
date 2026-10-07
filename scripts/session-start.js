'use strict';
const { readStdinJson } = require('../lib/plugin-root');
const { writeState } = require('../lib/session-state');

function main() {
  const input = readStdinJson();
  const sessionId = input.session_id || process.env.CLAUDE_SESSION_ID || 'unknown';
  const now = Date.now();
  writeState(sessionId, { sessionStart: now, lastNudge: now, lastIndex: -1 });
  process.stdout.write(JSON.stringify({ systemMessage: '' }));
  process.exit(0);
}

try {
  main();
} catch (_) {
  process.stdout.write(JSON.stringify({ systemMessage: '' }));
  process.exit(0);
}
