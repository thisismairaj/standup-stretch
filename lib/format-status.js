'use strict';

// Compact single-line text for a status line (tmux, shell prompt, editor statusline).
function formatStatus({ elapsedMs, intervalMs, isDue }) {
  if (isDue) return '🧘 Stretch!';
  const remainingMin = Math.max(0, Math.ceil((intervalMs - elapsedMs) / 60000));
  return `🧘 ${remainingMin}m`;
}

module.exports = { formatStatus };
