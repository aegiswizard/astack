# Astack

## What this is
Astack is a universal AI development workflow stack — nine slash commands that give AI agents explicit, specialized cognitive modes for software development. It is model-agnostic, stack-agnostic, and MIT licensed. It is the native skill layer for OpenClaw (Aegis Wizard).

## Stack
- Language: Bash (setup script), Markdown (skills), TypeScript (browser daemon)
- Runtime: Bun v1.0+ (browser binary only)
- Test runner: `bun test`
- No framework dependencies

## Architecture
Skills are plain Markdown files in `skills/[name]/SKILL.md`. The `setup` script creates symlinks in `~/.claude/skills/` so Claude Code discovers them as slash commands. The browser daemon (`/browse`, `/qa`) is a Bun-compiled Playwright binary — it runs as a persistent Chromium process over localhost HTTP. All state goes to `.xstack/` in the user's project root.

```
astack/
  README.md                  # full documentation
  CLAUDE.md                  # this file
  setup                      # install script (bash)
  .xstack/
    config.example.json      # config template
  skills/
    plan/SKILL.md
    review/SKILL.md
    fix/SKILL.md
    ship/SKILL.md
    browse/SKILL.md
    qa/SKILL.md
    sync-cookies/SKILL.md
    retro/SKILL.md
    context/SKILL.md
```

## Conventions
- Skill files are instructions only — no philosophy, no preamble
- Every skill file must work on models as small as 600M parameters (qwen3:0.6b)
- Keep skill files under 300 lines — token cost matters on small models
- Shell commands in setup use `set -euo pipefail`
- Config keys use snake_case
- State output goes to `.xstack/` — never to the project root directly

## What NOT to do
- Do not add Claude-specific syntax to SKILL.md files — they must be model-agnostic
- Do not add hard dependencies on external paid services (Greptile, Conductor, etc.)
- Do not bloat skill files with explanatory prose — instructions only
- Do not hardcode language/framework assumptions in /ship — use auto-detection
- Do not store secrets or API keys in `.xstack/`

## Available skills
/plan, /review, /fix, /ship, /browse, /qa, /sync-cookies, /retro, /context

Use /browse for all web browsing. Never use mcp__claude-in-chrome__* tools.
If skills stop working: `cd ~/.claude/skills/astack && ./setup`
