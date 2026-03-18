# Astack Architecture

## Overview

Astack has three components:

1. **Skill files** — Markdown instructions that define agent behavior
2. **Setup script** — Bash that installs symlinks and builds the browser binary
3. **Browser daemon** — Playwright + Bun binary for `/browse` and `/qa`

Everything else (state, reports, plans) lives in `.xstack/` inside the user's project.

---

## Skill files

### Why Markdown

Skill files are plain Markdown. No templates, no codegen, no build step.

The constraint is intentional. Skill files are injected into the model's context window on every invocation. On a Raspberry Pi 3 running qwen3:0.6b, a skill file that is 3,000 tokens vs 300 tokens is the difference between completing and running out of context. Brevity is a hard requirement, not a preference.

Plain Markdown also means any contributor can edit a skill with no tooling. The feedback loop is: edit `.md` → invoke skill → observe behavior → repeat.

### Skill file structure

Each skill follows the same structure:

```markdown
# /[command]

**Mode:** [role name]
**Use when:** [one sentence trigger condition]

---

## Before you start
[What to read/check before acting]

## [Main process]
[Step by step instructions]

## Output format
[Exact output structure]
```

The "before you start" section is load-bearing. It tells the agent to read `CLAUDE.md`, check git state, and gather context before acting. Without this, agents jump straight to the task with incomplete information.

### Model-agnostic design

No skill file uses Claude-specific syntax, tool-use API constructs, or Anthropic-specific formatting. Instructions are plain imperative prose that any instruction-following model can execute.

The quality tradeoff is real — a 600M parameter model following `/review` will find fewer issues than Claude Sonnet 4. But it will follow the same structure, produce the same output format, and integrate with the same pipeline.

---

## The browser daemon

### Why a daemon, not a fresh session per command

Playwright cold start: 3–5 seconds. Established session: ~100ms per command.

If `/browse` spawned a fresh browser for every command, a QA pass over 10 pages would take 30–50 seconds just in startup overhead. With a persistent daemon, the same pass takes 1–2 seconds of actual browser work.

### Architecture

```
Claude Code / OpenClaw
        │
        │  HTTP (localhost)
        ▼
  browse-daemon (Bun)
        │
        │  Playwright API
        ▼
  Chromium (headless)
```

The daemon is a Bun HTTP server. Each incoming request is a browser command (goto, click, screenshot, etc.). The server dispatches to the Playwright Page object and returns the result.

State (cookies, localStorage, tabs) lives in the Chromium process. It persists as long as the daemon is alive. The daemon auto-shuts down after 30 minutes idle.

### Log architecture

Three separate circular buffers, flushed async to disk every 1 second:
- `console.log` — JS console output
- `network` — requests and responses
- `dialog` — browser dialog events (alert, confirm, prompt)

HTTP request handling never blocks on disk I/O. The async flush means a slow disk doesn't stall the browser.

---

## The `.xstack/` state directory

```
.xstack/
  config.json              # project config (user-created)
  config.example.json      # template (committed)
  plans/
    [slug]-product.md      # /plan --product output
    [slug]-arch.md         # /plan --arch output
  qa-reports/
    [timestamp]/
      report.json          # machine-readable QA results
      screenshots/         # one per tested page
  retros/
    [YYYY-MM-DD].json      # weekly retro snapshot
  review-status.json       # last /review gate status
  browser.log              # browse session log
```

`.xstack/` should be gitignored except for `config.example.json`. Plans, QA reports, and retros are local state — they contain potentially sensitive information about your codebase and should not be committed by default.

---

## OpenClaw integration

In Claude Code, skills are discovered via symlinks in `~/.claude/skills/`. Claude Code reads the SKILL.md file when a slash command is invoked and prepends it as context.

In OpenClaw, the integration is different:

1. **Skill registration** — each skill is registered as a named agent capability in the OpenClaw agent config
2. **Context injection** — when a skill is invoked, its SKILL.md is injected as the system prompt for that agent turn
3. **State persistence** — `.xstack/` output survives session restarts and is available to the agent across turns
4. **Model routing** — `model_preference` in config routes each skill to the configured model (local or cloud)
5. **Browser daemon lifecycle** — managed by OpenClaw rather than the shell, so it survives conversation restarts

The key difference: in Claude Code, the user types `/review` and Claude reads the skill. In OpenClaw, the agent selects the appropriate skill based on context, injects it, and executes — without the user having to name it explicitly.

---

## Setup script

`setup` does three things:

1. Creates `~/.claude/skills/` if it doesn't exist
2. Creates a symlink from `~/.claude/skills/[skill]` → `astack/skills/[skill]` for each skill
3. If Bun is available: runs `bun install && bun run build` to compile the browser binary

The symlink approach means editing a skill file in the astack directory takes effect immediately — no reinstall needed.

For project installs (`.claude/skills/astack/`), the same script runs from the project-local path.

---

## Testing

```bash
bun test                      # static tests, <5 seconds
EVALS=1 bun run test:evals    # full E2E + LLM eval suite
bun run eval:watch            # live dashboard during E2E runs
```

Static tests cover: skill file structure validation, config parsing, setup script correctness, browser daemon HTTP API contract.

E2E tests (EVALS=1) require a running local app and real browser. They test actual skill execution end-to-end — including LLM output quality checks. These cost real inference and take ~20 minutes.
