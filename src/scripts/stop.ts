import { readStdinJson, resolvePluginRoot } from '../lib/plugin-root.js'
import { readState, writeState, type SessionState } from '../lib/session-state.js'
import { pickNudge } from '../lib/pick-nudge.js'
import { renderPanel } from '../lib/render-panel.js'
import { INTERVAL_MS } from '../lib/constants.js'

function main(): void {
  const input = readStdinJson()
  const sessionId = input.session_id || process.env.CLAUDE_SESSION_ID || 'unknown'
  const now = Date.now()

  const state: SessionState = readState(sessionId) || { sessionStart: now, lastNudge: now, lastIndex: -1 }
  const elapsed = now - state.lastNudge

  if (elapsed < INTERVAL_MS) {
    process.exit(0)
    return
  }

  const pluginRoot = resolvePluginRoot()
  const nudge = pickNudge(pluginRoot, state.lastIndex)
  const minutes = Math.round(elapsed / 60000)

  const panel = renderPanel({
    heading: `You've been at it for ${minutes} minute${minutes === 1 ? '' : 's'} — stand up and stretch.`,
    body: nudge.text,
  }, { cols: process.stdout.columns || 80 })

  writeState(sessionId, { ...state, lastNudge: now, lastIndex: nudge.index })
  process.stdout.write(JSON.stringify({ systemMessage: panel }))
  process.exit(0)
}

try {
  main()
} catch {
  process.exit(0)
}
