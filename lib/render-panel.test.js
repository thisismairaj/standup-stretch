'use strict';
const assert = require('assert');
const { renderPanel, wrap } = require('./render-panel');

// wrap() never produces a line longer than the given width
{
  const lines = wrap('a '.repeat(50) + 'verylongwordthatwontfit', 10);
  for (const line of lines) {
    assert.ok(line.length <= Math.max(10, 'verylongwordthatwontfit'.length));
  }
}

// renderPanel() draws a box whose top and bottom borders match in length
{
  const panel = renderPanel({ heading: 'Heads up', body: 'Stand up and stretch.' }, { cols: 80 });
  const rows = panel.split('\n');
  assert.strictEqual(rows[0].length, rows[rows.length - 1].length);
  assert.ok(rows[0].startsWith('┌') && rows[0].endsWith('┐'));
  assert.ok(rows[rows.length - 1].startsWith('└') && rows[rows.length - 1].endsWith('┘'));
}

// renderPanel() includes the heading and body text somewhere in the box
{
  const panel = renderPanel({ heading: 'Heads up', body: 'Stand up and stretch.' }, { cols: 80 });
  assert.ok(panel.includes('Heads up'));
  assert.ok(panel.includes('Stand up and stretch.'));
}

console.log('render-panel.test.js passed');
