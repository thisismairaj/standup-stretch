import assert from 'node:assert';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pickNudge, loadNudges } from './pick-nudge.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(__dirname, '..', '..');
// loadNudges() reads the real data file and finds more than one entry
{
    const nudges = loadNudges(pluginRoot);
    assert.ok(Array.isArray(nudges));
    assert.ok(nudges.length > 1);
}
// pickNudge() never immediately repeats the avoided index
{
    const nudges = loadNudges(pluginRoot);
    for (let avoidIndex = 0; avoidIndex < nudges.length; avoidIndex++) {
        for (let i = 0; i < 20; i++) {
            const { index } = pickNudge(pluginRoot, avoidIndex);
            assert.notStrictEqual(index, avoidIndex);
        }
    }
}
// pickNudge() falls back to a single default when the data file is missing
{
    const { text, index } = pickNudge('/nonexistent/path/xyz', -1);
    assert.strictEqual(index, 0);
    assert.strictEqual(typeof text, 'string');
}
console.log('pick-nudge.test.js passed');
