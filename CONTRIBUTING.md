# Contributing to standup-stretch

Thanks for considering a contribution — this is a small project, so keep changes focused.

## Before you start

For anything beyond a typo fix, please open an issue first to discuss the change.

## Setup

```bash
git clone https://github.com/thisismairaj/standup-stretch
cd standup-stretch
npm install
npm test        # builds (tsc) and runs the full test suite
```

## Making changes

- Source lives in `src/` (TypeScript); `dist/` is compiled output and is committed to the repo — don't hand-edit it, run `npm run build` (or `npm test`, which builds first) instead.
- Add or update tests alongside the module you're touching (`src/lib/*.test.ts`, `src/bin/*.test.ts`). `npm test` must pass.
- The plugin, the CLI, and the skill all share `src/lib/` — keep their behavior consistent rather than branching logic per surface.
- If you touch `hooks/hooks.json` or anything under `.claude-plugin/`, run `claude plugin validate .` before opening a PR.

## Submitting

1. Fork the repo and create a branch named `your-username/short-description`.
2. Commit with a clear message explaining *why*, not just what changed.
3. Open a pull request against `master` describing the change and linking any related issue.

## Code style

- This project intentionally stays near-zero-dependency — discuss in the issue first before adding one.
- Match the existing style: small functions, minimal comments (only where the *why* genuinely isn't obvious from the code).
