import { readStdinJson } from '../lib/plugin-root.js';
import { deleteState } from '../lib/session-state.js';
function main() {
    const input = readStdinJson();
    const sessionId = input.session_id || process.env.CLAUDE_SESSION_ID || 'unknown';
    deleteState(sessionId);
    process.exit(0);
}
try {
    main();
}
catch {
    process.exit(0);
}
