'use strict';
const fs = require('fs');
const path = require('path');

function loadNudges(pluginRoot) {
  try {
    const raw = fs.readFileSync(path.join(pluginRoot, 'data', 'nudges.json'), 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (_) {}
  return ['Stand up and stretch for a minute.'];
}

function pickNudge(pluginRoot, avoidIndex) {
  const nudges = loadNudges(pluginRoot);
  if (nudges.length === 1) return { text: nudges[0], index: 0 };
  let index = Math.floor(Math.random() * nudges.length);
  if (index === avoidIndex) {
    index = (index + 1) % nudges.length;
  }
  return { text: nudges[index], index };
}

module.exports = { pickNudge, loadNudges };
