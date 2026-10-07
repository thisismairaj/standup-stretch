export interface FormatStatusInput {
  elapsedMs: number
  intervalMs: number
  isDue: boolean
}

// Compact single-line text for a status line (tmux, shell prompt, editor statusline).
export function formatStatus({ elapsedMs, intervalMs, isDue }: FormatStatusInput): string {
  if (isDue) return '🧘 Stretch!'
  const remainingMin = Math.max(0, Math.ceil((intervalMs - elapsedMs) / 60000))
  return `🧘 ${remainingMin}m`
}
