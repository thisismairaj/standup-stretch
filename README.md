<h1 align="center">standup-stretch</h1>

<p align="center">
  Nudges you to stand up and stretch after 90 minutes.<br/>
  Three ways to run it: a Claude Code plugin, a Claude Code skill, or a CLI that works anywhere.
</p>

---

## What it looks like

```
┌──────────────────────────────────────────────────────────────────────────┐
│ You've been at it for 91 minutes — stand up and stretch.                 │
│                                                                           │
│ Plant your feet, place your hands on your lower back, and lean backward  │
│ into a gentle stretch.                                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

Or, in a tmux status bar / shell prompt, a compact `🧘 42m` countdown that flips to `🧘 Stretch!` when it's time.

---

## Why

Coding with an AI pair is fast. It's easy to go heads-down for three hours straight without noticing your shoulders are up around your ears. This is a quiet circuit-breaker: a short, concrete nudge to stand up, delivered on a clock you never have to think about.

---

## Three install surfaces, one set of nudges

| Surface | What it is | Install | Where it works |
| :-- | :-- | :-- | :-- |
| **Plugin** | Zero-dependency Claude Code plugin. Auto-active every session once installed. | `/plugin install` | Inside Claude Code only |
| **CLI** | A standalone, global `standup-stretch` command. | `npm install -g standup-stretch` | Any terminal — tmux status bar, shell prompt, editor status line |
| **Skill** | A thin wrapper that turns the CLI on for a Claude Code session. | Copy a folder, then invoke it once | Inside Claude Code, and shares the CLI's timer with the rest of your terminal |

They're independent — pick one, or combine the CLI with the skill so your stretch clock is the same whether you're mid Claude Code session or just sitting in a shell.

### 1. Plugin (self-contained, zero dependencies)

```
/plugin marketplace add thisismairaj/standup-stretch
/plugin install standup-stretch@standup-stretch
```

Or try it for one session only:

```bash
git clone https://github.com/thisismairaj/standup-stretch
claude --plugin-dir ./standup-stretch
```

**How it works:** a `SessionStart` hook records when your session began. A `Stop` hook fires after every turn, checks elapsed time, and — once 90 minutes have passed — renders a framed nudge via `systemMessage` and resets the clock. State lives in a small per-session file under your OS temp directory; `SessionEnd` cleans it up. No network calls, no npm dependency required.

### 2. CLI (works in any terminal)

```bash
npm install -g standup-stretch
```

```
standup-stretch status          # compact status-line string: "🧘 42m" or "🧘 Stretch!"
standup-stretch check [--json]  # prints the full nudge once 90 minutes are up, then resets; silent otherwise
standup-stretch reset           # reset the timer now (e.g. right after you actually stretch)
```

**tmux status bar:**

```tmux
set -g status-interval 60
set -g status-right '#(standup-stretch status)'
```

**Shell prompt** (anywhere you can hook a precmd/PROMPT_COMMAND):

```bash
# bash: ~/.bashrc
PROMPT_COMMAND="standup-stretch check${PROMPT_COMMAND:+; $PROMPT_COMMAND}"
```

```zsh
# zsh: ~/.zshrc
precmd_functions+=(standup-stretch_check)
standup-stretch_check() { standup-stretch check; }
```

State lives in `~/.standup-stretch/state.json` — a single global timer shared by every terminal, independent of the Claude Code plugin's per-session state.

### 3. Skill (Claude Code, backed by the CLI)

The skill carries no logic of its own — it just registers a `Stop` hook, scoped to the rest of the session, that runs `standup-stretch check --json`. **Requires the CLI installed first** (`npm install -g standup-stretch`).

```bash
cp -r skill/standup-stretch ~/.claude/skills/standup-stretch
```

Then, in a session, either type `/standup-stretch` or just ask Claude to turn on stretch reminders — the skill's description lets Claude auto-invoke it. Once invoked, the hook keeps firing after every turn for the rest of that session.

Because it shells out to the same CLI, a session using this skill shares its clock with any tmux/shell integration you've also set up — one continuous rhythm instead of two independent nags.

---

## How it works (shared core)

```
standup-stretch/
├── .claude-plugin/
│   ├── plugin.json           # Plugin manifest
│   └── marketplace.json      # Makes this repo installable via /plugin
├── hooks/
│   └── hooks.json            # SessionStart, Stop, SessionEnd — the plugin surface
├── scripts/                   # Plugin hook entrypoints (self-contained, no CLI dependency)
│   ├── session-start.js
│   ├── stop.js
│   └── session-end.js
├── bin/
│   └── standup-stretch.js    # CLI entrypoint (status / check / reset)
├── lib/                       # Shared core — used by both the plugin and the CLI
│   ├── constants.js           # The 90-minute interval
│   ├── session-state.js       # Per-Claude-session state (plugin)
│   ├── global-state.js        # Global state (CLI)
│   ├── pick-nudge.js          # Picks a stretch suggestion, avoids immediate repeats
│   ├── render-panel.js        # Framed panel renderer
│   ├── format-status.js       # Compact status-line formatter
│   └── plugin-root.js
├── skill/standup-stretch/
│   └── SKILL.md               # The skill surface — wraps the CLI
└── data/
    └── nudges.json            # 15 short stretch/movement suggestions
```

Nothing is sent anywhere, in any surface. No network calls, no telemetry — just a timestamp written to a local file.

---

## Running tests

```bash
npm test
```

---

## License

MIT
