import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
export const STATE_DIR = path.join(os.homedir(), '.standup-stretch');
export const STATE_PATH = path.join(STATE_DIR, 'state.json');
export function readGlobalState() {
    try {
        const raw = fs.readFileSync(STATE_PATH, 'utf8');
        const parsed = JSON.parse(raw);
        if (!Number.isFinite(parsed.lastNudge))
            return null;
        return parsed;
    }
    catch {
        return null;
    }
}
export function writeGlobalState(state) {
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(STATE_PATH, JSON.stringify(state), 'utf8');
}
