---
name: standup-stretch
description: Turns on a periodic nudge to stand up and stretch after 90 minutes of this session. Use when the user asks to enable stretch/movement/posture reminders, a break timer, or to be nudged to stand up periodically.
when_to_use: The user asks to turn on stretch reminders, a movement/posture nudge, a break timer, or says something like "remind me to stand up every so often".
hooks:
  Stop:
    - hooks:
        - type: command
          command: standup-stretch check --json
---

# standup-stretch

Requires the `standup-stretch` CLI on the user's `PATH` (`npm install -g standup-stretch`). This skill itself carries no logic — invoking it only registers a `Stop` hook that runs `standup-stretch check --json` after every turn for the rest of the session. That command is silent until 90 minutes have passed since the last nudge (or since this was turned on), then prints one framed reminder and resets its own clock.

When this skill is invoked, do nothing else: just tell the user in one short sentence that stretch reminders are on for the rest of this session, and that running `standup-stretch reset` resets the clock early (e.g. right after they actually stretch). If `standup-stretch` isn't installed, tell them to run `npm install -g standup-stretch` first.
