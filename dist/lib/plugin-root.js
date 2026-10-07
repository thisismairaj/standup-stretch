import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Resolve the plugin root using three strategies in priority order:
// 1. CLAUDE_PLUGIN_ROOT env var (set for every hook invocation)
// 2. ~/.claude/plugins/installed_plugins.json (marketplace installs, fallback)
// 3. __dirname relative — dist/lib/ is two levels below root (works for --plugin-dir)
export function resolvePluginRoot() {
    if (process.env.CLAUDE_PLUGIN_ROOT) {
        try {
            fs.accessSync(process.env.CLAUDE_PLUGIN_ROOT);
            return process.env.CLAUDE_PLUGIN_ROOT;
        }
        catch { }
    }
    try {
        const installFile = path.join(process.env.HOME || process.env.USERPROFILE || '', '.claude', 'plugins', 'installed_plugins.json');
        const data = JSON.parse(fs.readFileSync(installFile, 'utf8'));
        const plugins = data.plugins || {};
        for (const [key, val] of Object.entries(plugins)) {
            if (key.includes('standup-stretch') && val.installPath) {
                return val.installPath.replace(/[\\/]$/, '');
            }
        }
    }
    catch { }
    return path.resolve(__dirname, '..', '..');
}
export function readStdinJson() {
    try {
        const raw = fs.readFileSync(0, 'utf8');
        return JSON.parse(raw);
    }
    catch {
        return {};
    }
}
