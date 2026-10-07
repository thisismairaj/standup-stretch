#!/usr/bin/env node
'use strict';
const path = require('path');
const { readGlobalState, writeGlobalState } = require('../lib/global-state');
const { pickNudge } = require('../lib/pick-nudge');
const { renderPanel } = require('../lib/render-panel');
const { formatStatus } = require('../lib/format-status');
const { INTERVAL_MS } = require('../lib/constants');

const pkg = require('../package.json');
const pluginRoot = path.resolve(__dirname, '..');

// `now` is captured once by the caller and passed in, so a freshly
// initialized state's lastNudge is never later than the elapsed-time
// calculation that follows it — otherwise elapsedMs can go negative.
function loadOrInitState(now) {
  const existing = readGlobalState();
  if (existing) return existing;
  const fresh = { lastNudge: now, lastIndex: -1 };
  writeGlobalState(fresh);
  return fresh;
}

function cmdStatus() {
  const now = Date.now();
  const state = loadOrInitState(now);
  const elapsedMs = now - state.lastNudge;
  const isDue = elapsedMs >= INTERVAL_MS;
  process.stdout.write(formatStatus({ elapsedMs, intervalMs: INTERVAL_MS, isDue }) + '\n');
}

function cmdCheck(args) {
  const asJson = args.includes('--json');
  const now = Date.now();
  const state = loadOrInitState(now);
  const elapsedMs = now - state.lastNudge;

  if (elapsedMs < INTERVAL_MS) {
    if (asJson) process.stdout.write(JSON.stringify({ systemMessage: '' }) + '\n');
    return;
  }

  const nudge = pickNudge(pluginRoot, state.lastIndex);
  const minutes = Math.round(elapsedMs / 60000);
  const panel = renderPanel({
    heading: `You've been at it for ${minutes} minute${minutes === 1 ? '' : 's'} — stand up and stretch.`,
    body: nudge.text,
  }, { cols: process.stdout.columns || 80 });

  writeGlobalState({ lastNudge: now, lastIndex: nudge.index });

  if (asJson) {
    process.stdout.write(JSON.stringify({ systemMessage: panel }) + '\n');
  } else {
    process.stdout.write(panel + '\n');
  }
}

function cmdReset() {
  writeGlobalState({ lastNudge: Date.now(), lastIndex: -1 });
  const minutes = Math.round(INTERVAL_MS / 60000);
  process.stdout.write(`Timer reset. Next stretch reminder in ${minutes} minute${minutes === 1 ? '' : 's'}.\n`);
}

function cmdHelp() {
  process.stdout.write(`standup-stretch v${pkg.version}

Nudges you to stand up and stretch after 90 minutes.

Usage:
  standup-stretch status          Print a compact status-line string (e.g. "🧘 42m" or "🧘 Stretch!")
  standup-stretch check [--json]  Print the full nudge if 90 minutes are up, then reset the timer; silent otherwise
  standup-stretch reset           Reset the timer now (e.g. after you actually stretch)
  standup-stretch --help          Show this help
  standup-stretch --version       Show the version

Shell integration:
  tmux status-right: '#(standup-stretch status)'   with 'set -g status-interval 60'
  Shell prompt hook:  run 'standup-stretch check' from your precmd/PROMPT_COMMAND

State is kept in ~/.standup-stretch/state.json — no network calls, no telemetry.
`);
}

function main() {
  const [, , cmd, ...args] = process.argv;

  if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') return cmdHelp();
  if (cmd === '--version' || cmd === '-v' || cmd === 'version') {
    process.stdout.write(`${pkg.version}\n`);
    return;
  }

  switch (cmd) {
    case 'status':
      return cmdStatus();
    case 'check':
      return cmdCheck(args);
    case 'reset':
    case 'done':
      return cmdReset();
    default:
      process.stderr.write(`Unknown command: ${cmd}\n\n`);
      cmdHelp();
      process.exitCode = 1;
  }
}

main();
