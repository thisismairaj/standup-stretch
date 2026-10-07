import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
export const STATE_DIR = path.join(os.tmpdir(), 'standup-stretch');
export function statePath(sessionId) {
    const safeId = String(sessionId || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_');
    return path.join(STATE_DIR, `${safeId}.json`);
}
export function readState(sessionId) {
    try {
        const raw = fs.readFileSync(statePath(sessionId), 'utf8');
        const parsed = JSON.parse(raw);
        if (!Number.isFinite(parsed.lastNudge))
            return null;
        return parsed;
    }
    catch {
        return null;
    }
}
export function writeState(sessionId, state) {
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(statePath(sessionId), JSON.stringify(state), 'utf8');
}
export function deleteState(sessionId) {
    try {
        fs.unlinkSync(statePath(sessionId));
    }
    catch { }
}
