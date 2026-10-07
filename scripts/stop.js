'use strict';
const { readStdinJson, resolvePluginRoot } = require('../lib/plugin-root');
const { readState, writeState } = require('../lib/session-state');
const { pickNudge } = require('../lib/pick-nudge');
const { renderPanel } = require('../lib/render-panel');
const { INTERVAL_MS } = require('../lib/constants');

function main() {
  const input = readStdinJson();
  const sessionId = input.session_id || process.env.CLAUDE_SESSION_ID || 'unknown';
  const now = Date.now();

  const state = readState(sessionId) || { sessionStart: now, lastNudge: now, lastIndex: -1 };
  const elapsed = now - state.lastNudge;

  if (elapsed < INTERVAL_MS) {
    process.exit(0);
    return;
  }

  const pluginRoot = resolvePluginRoot();
  const nudge = pickNudge(pluginRoot, state.lastIndex);
  const minutes = Math.round(elapsed / 60000);

  const panel = renderPanel({
    heading: `You've been at it for ${minutes} minutes — stand up and stretch.`,
    body: nudge.text,
  }, { cols: process.stdout.columns || 80 });

  writeState(sessionId, { ...state, lastNudge: now, lastIndex: nudge.index });
  process.stdout.write(JSON.stringify({ systemMessage: panel }));
  process.exit(0);
}

try {
  main();
} catch (_) {
  process.exit(0);
}
