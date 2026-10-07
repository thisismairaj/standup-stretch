import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

export interface SessionState {
  sessionStart: number
  lastNudge: number
  lastIndex: number
}

export const STATE_DIR = path.join(os.tmpdir(), 'standup-stretch')

export function statePath(sessionId: string): string {
  const safeId = String(sessionId || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_')
  return path.join(STATE_DIR, `${safeId}.json`)
}

export function readState(sessionId: string): SessionState | null {
  try {
    const raw = fs.readFileSync(statePath(sessionId), 'utf8')
    const parsed = JSON.parse(raw)
    if (!Number.isFinite(parsed.lastNudge)) return null
    return parsed as SessionState
  } catch {
    return null
  }
}

export function writeState(sessionId: string, state: SessionState): void {
  fs.mkdirSync(STATE_DIR, { recursive: true })
  fs.writeFileSync(statePath(sessionId), JSON.stringify(state), 'utf8')
}

export function deleteState(sessionId: string): void {
  try {
    fs.unlinkSync(statePath(sessionId))
  } catch {}
}
