import { readStdinJson } from '../lib/plugin-root.js'
import { writeState } from '../lib/session-state.js'

function main(): void {
  const input = readStdinJson()
  const sessionId = input.session_id || process.env.CLAUDE_SESSION_ID || 'unknown'
  const now = Date.now()
  writeState(sessionId, { sessionStart: now, lastNudge: now, lastIndex: -1 })
  process.stdout.write(JSON.stringify({ systemMessage: '' }))
  process.exit(0)
}

try {
  main()
} catch {
  process.stdout.write(JSON.stringify({ systemMessage: '' }))
  process.exit(0)
}
