# Astack 🧙‍♂️

**A universal AI development workflow stack. Model-agnostic. Stack-agnostic. Fully open source.**

> Built on top of the ideas in gstack.  
> Rebuilt from scratch to work with any model, any language, any team.  
> The official skill layer for [OpenClaw](https://github.com/aegiswizard/openclaw) — and free to use with Claude Code, or any agent that can execute slash commands.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Part of Aegis Wizard](https://img.shields.io/badge/Aegis%20Wizard-%F0%9F%A7%99%E2%80%8D%E2%99%82%EF%B8%8F-blueviolet)](https://github.com/aegiswizard)
[![Works with OpenClaw](https://img.shields.io/badge/OpenClaw-native-blue)](https://github.com/aegiswizard/openclaw)

---

## Table of Contents

1. [Origin Story — Where This Came From](#origin-story)
2. [Why Astack Exists — The Problem We're Solving](#why-astack-exists)
3. [What Astack Is](#what-astack-is)
4. [The Relationship Between Astack and OpenClaw](#astack-and-openclaw)
5. [What Was Studied — gstack Deep Dive](#what-was-studied)
6. [What Was Cut and Why](#what-was-cut)
7. [What Was Added and Why](#what-was-added)
8. [Skill Reference — Complete](#skill-reference)
9. [Architecture and Design Principles](#architecture)
10. [Configuration](#configuration)
11. [Install Guide](#install)
12. [Roadmap](#roadmap)
13. [Contributing](#contributing)
14. [License](#license)

---

## Origin Story

### Where this came from

The AI coding assistant space exploded in 2026. Tools like Claude Code, GitHub Copilot, Cursor, and Aider made it possible for a single developer to move at speeds that were previously impossible. But the tools had a problem: they were generic.

A generic AI assistant is like a brilliant new hire who has read every programming book ever written but has no idea what role they're supposed to be playing right now. Are they a product manager? A senior engineer? A QA tester? A release coordinator? Without explicit direction, they default to doing exactly what was asked — literally, conservatively, and without context.

In 2026, Garry Tan — President & CEO of Y Combinator — published **gstack**, an opinionated set of Claude Code slash commands that addressed this directly. The idea was right: give the AI explicit cognitive modes. Tell it what kind of thinking to do right now. Plan differently from how you review. Review differently from how you ship.

gstack was valuable. It proved the concept worked. But it had limitations:

- It was tightly coupled to Rails and a specific JavaScript toolchain
- It required Greptile (a third-party service) as a hard dependency
- It embedded a YC recruiting advertisement in the README
- Its skill files were verbose philosophy documents rather than executable instructions
- It was designed for one person's workflow, not a general-purpose team tool
- It had no concept of working with non-Claude models
- It had no path to being embedded into an agent framework

**Astack is the answer to those limitations.**

We studied gstack completely — the README, the architecture docs, the CLAUDE.md, every SKILL.md file, the open issues, the community feedback. We took what was genuinely good (the role-based mode concept, the browser automation, the QA automation), cut what was opinionated or unnecessary, and rebuilt the rest to be universal, lean, and embeddable.

---

### The Aegis Wizard context

Astack lives inside the **Aegis Wizard** GitHub organization. Aegis Wizard is the umbrella project for a self-hosted, model-agnostic AI infrastructure stack built on top of **OpenClaw** — an open agent framework — running local inference via Ollama, with WhatsApp and other channels as delivery interfaces.

The key insight driving Aegis Wizard is this: **the best AI infrastructure is one you own and control.** Local models, local memory, local execution, with cloud fallback only when you choose it.

Astack is the skill and workflow layer of that stack. It defines how AI agents within OpenClaw think, plan, review, test, and ship software. It is not a plugin or a wrapper — it is embedded into OpenClaw as core behavior.

---

## Why Astack Exists

### The problem with generic AI assistants

When you ask a generic AI coding assistant to "review my PR," you get whatever depth it happens to be in the mood for today. Sometimes it finds the race condition. Sometimes it compliments your variable naming. There's no consistent standard, no structured output, no agreed severity scale.

When you ask it to "ship this," it starts a conversation. It asks what branch you're on. It asks what tests to run. It asks whether you want to open a PR. Every time. The things that should be automated aren't automated. The things that should require thought don't get it.

The core problem is that **AI assistants don't know what role they're playing.** A product planning session requires different thinking than a security review. A release pipeline should be mechanical and consistent. A bug investigation should be focused and disciplined, not creative.

Astack solves this with explicit, named cognitive modes. You tell the agent what job it's doing right now. It switches into that mode completely. The planning agent is not the same as the review agent is not the same as the release agent — even though they're the same underlying model.

### The problem with model lock-in

gstack is Claude Code only. Claude Code is Anthropic only. That's fine for many people, but the trajectory of AI development is clearly toward model diversity. Different models have different strengths. Local models running on your own hardware give you privacy, cost control, and independence from API availability.

Astack is designed from the start to work with:
- **Claude Code** (Anthropic) — the reference implementation
- **OpenClaw** (any model via Ollama or OpenRouter) — the native integration
- **Any other agent framework** that can execute Markdown-defined slash commands

The skills are plain Markdown. They have no hard dependencies on any specific model's capabilities. They work with what the model can do.

### The problem with stack lock-in

gstack hardcodes Rails test commands. It assumes a specific JavaScript toolchain. It assumes you deploy via a specific PR flow. Most software teams don't work this way.

Astack auto-detects your stack. It works with Python, Go, Rust, TypeScript, Ruby, Elixir, Java, or any combination. It detects your test runner, your dev server, your CI setup. If it can't detect something, it has a clean configuration override. It never makes you fight the tool to make it fit your project.

### The mission

Build the definitive open-source AI development workflow layer:

- **Universal** — any model, any language, any team
- **Embeddable** — ships as OpenClaw core, not a plugin
- **Lean** — minimal, precise skill files that work with constrained models
- **Honest** — no ad copy, no philosophy lectures, just instructions
- **Owned** — MIT license, self-hostable, no required external services

---

## What Astack Is

Astack is a collection of **nine slash commands** that give AI agents explicit, specialized cognitive modes for software development.

Each skill is a Markdown file that defines:
- The role the agent is playing
- The exact process it follows
- How it communicates findings
- When it stops and asks vs when it acts

| Command | Role | Job |
|---|---|---|
| `/plan` | Product thinker + Tech lead | Pressure-test the idea, then lock the architecture |
| `/review` | Paranoid staff engineer | Find what passes CI but blows up in production |
| `/fix` | Production firefighter | Reproduce → isolate → hypothesize → fix → verify → regression test |
| `/ship` | Release engineer | Sync, test, resolve comments, push, open PR. No conversation. |
| `/browse` | QA engineer with eyes | Real Chromium browser. Navigate, screenshot, fill forms, check console. |
| `/qa` | QA lead | Diff-aware automated testing. Reads your git changes, tests affected routes. |
| `/sync-cookies` | Session manager | Import real browser sessions into the headless browser for authenticated testing. |
| `/retro` | Engineering manager | Weekly analysis: commits, LOC, test ratios, per-person feedback. |
| `/context` | Onboarding specialist | Reads your codebase, writes or refreshes CLAUDE.md / agent context. |

### The typical development loop

```
Start here:
  /plan          →  Is this the right thing? How should it be built?
                    [implement the plan]
  /review        →  What still breaks before we ship?
                    [fix CRITICAL issues]
  /qa            →  Does it work in the browser?
  /ship          →  Sync, test, push, PR. Done.

Maintenance:
  /fix [bug]     →  Focused bug investigation and fix
  /retro         →  Weekly: what shipped, what improved, what didn't

Project health:
  /context       →  Write or refresh CLAUDE.md / agent context file
```

---

## Astack and OpenClaw

### What OpenClaw is

OpenClaw is an open agent framework built for local-first AI infrastructure. It routes requests to models (local via Ollama, cloud via OpenRouter), manages agent personas, handles multi-channel delivery (WhatsApp, HTTP, etc.), and executes agentic workflows.

The OpenClaw architecture is built around:
- Model registration via `~/.pi/agent/models.json` (or equivalent config path)
- Provider routing (local Ollama → cloud fallback)
- Agent personas defined as configuration, not code
- Skill execution via slash-command dispatch

### How Astack integrates with OpenClaw

In a standard Claude Code deployment, Astack lives in `.claude/skills/` and Claude picks up the skills as slash commands.

In an OpenClaw deployment, Astack is embedded differently — it is part of the **core agent behavior layer**, not an optional add-on. This means:

1. **Skills are registered as agent capabilities** — each Astack skill maps to a named capability in the OpenClaw agent config
2. **The skill Markdown becomes the system prompt context** for that mode — when an agent switches into `/review` mode, the review SKILL.md is injected as the behavioral context
3. **The agent persona (e.g., Aegis Wizard) orchestrates skill selection** — rather than the user typing `/review`, the agent can select the appropriate skill based on context
4. **Results are persisted to `.xstack/`** — plans, QA reports, review findings, and retro snapshots are written to disk and available across sessions

This means OpenClaw + Astack gives you an AI development team that:
- Runs locally on your hardware (Raspberry Pi, a local server, or a cloud VM you own)
- Uses whatever model is best for the task (local 0.6b for fast tasks, cloud models for complex reasoning)
- Maintains state and history across sessions
- Works through WhatsApp, HTTP, or any other registered channel

### The embedding plan

The work to embed Astack into OpenClaw core follows this sequence:

**Phase 1 — Skill files (complete)**
The nine SKILL.md files are written and tested. These define the behavioral instructions for each mode.

**Phase 2 — OpenClaw registration**
Each skill is registered in OpenClaw's agent config. The agent knows which skills exist and when to route to them.

**Phase 3 — Context injection**
When a skill is invoked, its SKILL.md is injected into the active model's context window. The agent operates under those instructions for the duration of the task.

**Phase 4 — State persistence**
`.astack/` output (plans, reviews, QA reports, retros) is readable by the agent across sessions. Past decisions inform future work.

**Phase 5 — Cross-skill orchestration**
The agent can chain skills automatically. A `/ship` invocation checks review status, runs `/qa` if needed, and proceeds only when gates are cleared — without user intervention.

---

## What Was Studied

### gstack deep dive

Before writing a single line of Astack, we read the complete gstack codebase:

- `README.md` — the public-facing documentation and philosophy
- `ARCHITECTURE.md` — internal design decisions and system internals  
- `CLAUDE.md` — the project's own agent context file
- `SKILL.md` for every skill: plan-ceo-review, plan-eng-review, review, ship, browse, qa, setup-browser-cookies, retro
- `BROWSER.md` — the Playwright/Chromium browser daemon architecture
- `CONTRIBUTING.md` — dev setup, testing infrastructure, eval framework
- `conductor.json` — integration with the Conductor parallel-session tool
- Open issues on GitHub — what users were complaining about
- Community feedback and forks — what people were changing

### What gstack got right

The fundamental insight is sound: **role-based cognitive modes make AI assistants dramatically more useful.** When you tell an AI "you are a paranoid staff engineer, find what breaks in production" vs "review my code," you get qualitatively different results. The explicit framing matters.

The browser automation approach is also genuinely good. A persistent Playwright daemon with ~100ms response times after cold start is the right architecture. Giving the AI actual eyes on a running app closes the feedback loop in a way that changes how you develop.

The structured workflow — plan → implement → review → qa → ship — is the correct sequence. It maps to how good software teams actually work.

### What needed fixing

**The Rails assumption.** `/ship` in gstack hardcodes Rails-specific test commands. This was the most common complaint in open issues. Any team not on Rails had to modify the skill file just to get basic functionality. Stack auto-detection is the obvious fix — detect what's present and use it.

**The Greptile hard dependency.** Greptile is a good product, but requiring users to have it installed and configured on their repo in order to use `/review` and `/ship` is a high barrier. It should be opt-in. Most teams don't have it. The skills should work without it.

**The philosophy essays.** The skill files in gstack contain lengthy philosophical justifications for why each mode exists. This is fine in a README. Inside a SKILL.md that gets read by the AI on every invocation, it is expensive token waste, especially on smaller models. Skill files should be instructions, not essays. Every word in a skill file costs inference compute.

**The command proliferation.** `/plan-ceo-review` and `/plan-eng-review` are the same concept with different emphases. They can be one command with flags. `/qa-only` and `/qa-design-review` are redundant. `/document-release` belongs inside `/ship`. `/gstack-upgrade` is a wrapper around `git pull`. Fewer commands, more power per command.

**The model assumption.** gstack is Claude Code only. Every design decision assumes you're running Claude Sonnet via Anthropic's API. For a tool that is supposed to be used by serious engineers who want infrastructure they own, this is a significant limitation.

**The missing skills.** There was no `/fix` mode — a disciplined bug investigation pipeline. There was no `/context` mode — a way to read a codebase and write accurate agent context. These are common, high-value use cases that were absent.

---

## What Was Cut

| Removed | Reason |
|---|---|
| `/plan-ceo-review` + `/plan-eng-review` as separate commands | Merged into `/plan --product`, `/plan --arch`, `/plan --both`. Same capability, unified interface. |
| `/qa-only`, `/qa-design-review` | Redundant. Unified into `/qa` with `--quick`, `--full`, `--regression` flags. |
| `/plan-design-review` + `/design-consultation` | Too opinionated for a general-purpose tool. Add your own if your team needs it. |
| `/document-release` | Absorbed into `/ship` step 6. PR body now includes structured release notes automatically. |
| `/gstack-upgrade` | Replaced by `git pull && ./setup`. No special tooling needed for a `git pull`. |
| Rails-specific test commands in `/ship` | Stack auto-detection covers 8 runtimes. No hardcoded assumptions. |
| `SKILL.md.tmpl` + codegen pipeline | Skills are plain Markdown. Edit directly, no compile step. |
| Greptile as hard dependency | Optional via `.xstack/config.json` `greptile: true`. Off by default. |
| YC recruiting advertisement in README | Not a feature. |
| Philosophy essays in skill files | Instructions only. Skill files are executed on every invocation — they must be lean. |
| `conductor.json` (Conductor integration) | Conductor is a paid external service. Not appropriate as a core dependency. Parallel sessions can be handled by OpenClaw natively. |

---

## What Was Added

| Added | Why |
|---|---|
| **`/fix [description]`** | A disciplined, non-wandering bug mode. Reproduce → isolate → hypothesize → fix → verify → regression test. Does not refactor, does not add features, does not wander. This was the most obvious missing skill. |
| **`/context`** | Reads your codebase and writes or refreshes CLAUDE.md. Critical for onboarding new projects, keeping context current, and making the AI useful on repos it hasn't seen before. |
| **`.astack/config.json`** | Universal portability config. `test_command`, `dev_server`, `greptile`, `skip_eng_review`. The tool adapts to your setup instead of requiring your setup to adapt to the tool. |
| **Stack auto-detection in `/ship`** | Detects: bun → npm → yarn → pytest → go test → cargo test → mix test → bundle exec rspec. Works with any language. The first thing every non-Rails user had to patch in gstack. |
| **Structured review output with blocking semantics** | CRITICAL → HIGH → MEDIUM → INFO. CRITICAL findings block `/ship`. Everything else is advisory. Review results are deterministic and actionable, not free-form commentary. |
| **`/plan` saves decisions to `.xstack/plans/`** | Plans survive beyond the conversation window. The agent can reference past decisions in future sessions. |
| **QA reports to `.xstack/qa-reports/`** | QA scores tracked over time. `--regression` mode diffs against previous runs. |
| **`/retro --compare` mode** | Side-by-side week-over-week analysis. Shows trends, not just snapshots. |
| **Linux cookie import for `/sync-cookies`** | gstack was macOS-only for cookie import. Astack reads Linux browser profiles directly. |
| **OpenClaw-native embedding path** | Skills are designed to be injected as system prompt context by OpenClaw, not just read by Claude Code. |

---

## Skill Reference

### `/plan [--product | --arch | --both]`

**Role:** Product thinker (--product) + Engineering lead (--arch)  
**Default:** `--both`

The planning command runs in two passes.

**Product pass (`--product`):**  
The agent does not implement what was asked. It first asks whether what was asked is the right thing to build. It maps the user job to be done, surfaces the 10-star version of the feature, and explicitly presents scope options: hold scope, selective expansion, or full expansion. Each option is presented as a question with a recommendation. The user approves direction before architecture begins.

**Architecture pass (`--arch`):**  
After direction is locked, the agent produces: component architecture diagram, state machine (if applicable), async job boundaries, failure modes for each external dependency, edge cases, trust boundaries, test matrix, and deployment considerations. Each significant tradeoff is surfaced as a question before proceeding.

Plans are written to `.xstack/plans/[slug]-product.md` and `.xstack/plans/[slug]-arch.md`.

---

### `/review`

**Role:** Paranoid staff engineer  
**Finds:** What passes CI but breaks in production

Structured audit across five categories: data layer (N+1 queries, stale reads, missing indexes), concurrency (race conditions, idempotency, double-writes), trust boundaries (untrusted inputs, external data in prompts, auth gaps), error handling (silent failures, partial states, runaway retries), and security (injection, XSS, SSRF, secrets in logs).

Output is always CRITICAL → HIGH → MEDIUM → INFO. CRITICAL findings block `/ship`. CRITICAL findings prompt the user individually, never batched.

Greptile triage is available when enabled in config: classifies PR comments as VALID / ALREADY-FIXED / FALSE-POSITIVE and handles responses automatically.

---

### `/fix [description of bug]`

**Role:** Production firefighter  
**Rule:** Does not wander. Does not refactor. Does not add features. Minimal targeted change only.

Six-step pipeline:
1. **Reproduce** — minimal repro case, confirm failure. STOP if cannot reproduce.
2. **Isolate** — narrow to the responsible code path. State conclusion before moving on.
3. **Hypothesize** — root cause as a falsifiable claim before touching code.
4. **Fix** — minimal targeted change. STOP and confirm if scope exceeds ~50 lines.
5. **Verify** — re-run the repro case. Run existing tests. If still failing, return to step 2 — do not stack changes.
6. **Regression test** — write a test that would have caught this. State what it covers.

Ends with a one-paragraph summary: root cause, what changed, how it was verified, what the regression test covers.

---

### `/ship`

**Role:** Release engineer  
**For:** A ready branch. Not for deciding what to build.

Pre-flight: checks review gate (CRITICAL issues cleared unless `skip_eng_review: true`) and branch state (no uncommitted changes). If either fails, reports once and stops.

Pipeline: sync with main → detect and run tests → Greptile triage (if enabled) → push → open PR with structured body (What / How / Testing / Review status).

No back-and-forth. If it can proceed, it proceeds. If something is broken, it reports once and stops.

---

### `/browse [url] [instruction]`

**Role:** QA engineer with real browser  
**Underlying tech:** Playwright + Bun, persistent Chromium daemon

Cold start ~3 seconds. Subsequent calls ~100ms. Session stays alive 30 minutes idle.

Full browser capability: navigate, screenshot, read accessibility tree, extract text/HTML, check console output, view network requests, click/fill/select/hover/scroll, manage tabs.

State persists: cookies, localStorage, and tabs carry over between commands in the same session. Treat this as a real browser — it is one.

---

### `/qa [url] [--quick | --full | --regression baseline]`

**Role:** QA lead  
**Default on a feature branch:** Diff-aware

**Diff-aware mode:** reads `git diff main --name-only`, identifies affected routes and components, tests each one specifically. Fastest path from "I just wrote code" to "it works."

**`--quick`:** 30-second smoke test. Homepage + top 5 nav targets. Checks for console errors and visual breakage.

**`--full`:** Systematic exploration. Maps all routes, tests primary flows, screenshots each page, generates health score (0–100) with issues ranked by severity.

**`--regression [baseline.json]`:** Runs full mode, diffs against a previous report. Shows resolved issues, new issues, and score delta.

Reports written to `.xstack/qa-reports/[timestamp]/` with screenshots. Needs authenticated pages? Run `/sync-cookies` first.

---

### `/sync-cookies [domain]`

**Role:** Session manager  
**Supported browsers:** Chrome, Arc, Brave, Edge, Chromium

macOS: reads from system Keychain (one-time prompt per browser — "Always Allow" to avoid future prompts).  
Linux: reads browser profile directly.

Interactive mode (no domain argument): opens picker in browser, shows available domains across all installed browsers, user selects what to import. Cookie values never displayed or logged.

Targeted mode: `/sync-cookies staging.example.com` — imports just that domain immediately.

---

### `/retro [--week | --month | --compare]`

**Role:** Engineering manager  
**Default:** `--week` (last 7 days)

Collects from git: commits, LOC added/removed/net per author, test file ratio, active days, hotspot files, coding session detection from commit timestamps.

Output per contributor:
- Tweetable header: commits, LOC, test ratio, peak hour, shipping streak
- What they shipped (specific — cites actual commits)
- What they did well (specific — not "great week")
- One growth opportunity (honest — not harsh)

Team section: top 3 wins, top 3 areas to improve, top 3 habits to carry forward.

Hotspot list: top 5 most-changed files. Files appearing in every retro for 3+ periods are flagged as architectural smells.

Saves JSON snapshot to `.xstack/retros/[YYYY-MM-DD].json` for trend tracking.

`--compare` mode: side-by-side table showing this period vs last with delta column.

---

### `/context`

**Role:** Onboarding specialist  
**Use when:** Starting a new project, CLAUDE.md is missing or stale, onboarding Claude or another agent to an existing repo

Reads: directory structure (2 levels), package manifests, existing docs, last 20 git commits, test setup, CI config, `.env.example`, existing CLAUDE.md.

Writes a structured `CLAUDE.md` covering: what the project is, the full stack, architecture overview, directory map, code conventions, things to know before coding, and explicit anti-patterns to avoid.

If `CLAUDE.md` already exists: preserves intentional hand-written notes, marks stale sections, shows a diff summary of what changed.

---

## Architecture and Design Principles

### Skills are Markdown. Keep them that way.

Every Astack skill is a single `.md` file. No templates, no codegen, no build step. This is intentional.

Skill files are read by the AI model on every invocation. Every token in a skill file is a token that must fit in the context window and costs inference compute. On a Raspberry Pi 3 running a 600M parameter model, a skill file that is 3,000 tokens instead of 300 tokens is the difference between a task completing and running out of context.

This constraint also enforces discipline: if you can't say what the skill should do in a page of Markdown, you don't understand what it should do.

### The browser daemon architecture

`/browse` and `/qa` run a persistent Chromium process via Playwright. The key insight from gstack (which we carry forward) is: **the expensive part is starting the browser, not using it.** A cold-start Playwright session takes 3–5 seconds. An established session processes commands in ~100ms.

The daemon runs as a local HTTP server. Each command is a request to that server. The server never blocks on disk I/O — console messages, network events, and dialog events are written to circular buffers and flushed asynchronously. Browser state (cookies, tabs, localStorage) persists until the session idles out at 30 minutes.

On OpenClaw, the browser daemon lifecycle is managed by the agent framework rather than the shell session — so it can survive conversation restarts and be shared across agent tasks.

### The `.xstack/` state directory

All persistent state goes to `.xstack/` in your project root:

```
.astack/
  config.json           # project configuration
  plans/                # /plan output — product and arch documents
  qa-reports/           # /qa output — reports and screenshots
  retros/               # /retro snapshots — JSON for trend tracking
  review-status.json    # /review results — gates /ship
  browser.log           # /browse session log (circular buffer)
```

This is the memory layer. An agent can reference prior plans when doing architecture. `/ship` can check `/review` gate status. `/retro --compare` can diff against last week's snapshot. `/qa --regression` can compare against a baseline run.

On OpenClaw, this directory is part of the agent's persistent context — it survives session restarts and is readable across agent personas.

### Model-agnostic design

Skill files do not use any Claude-specific syntax. They do not reference "use the tool" or "call a function" in ways that depend on tool-use APIs. Instructions are written in plain imperative prose that any instruction-following model can execute.

This means the same SKILL.md works whether the underlying model is:
- Claude Sonnet 4.x (cloud, via Claude Code)
- Claude Haiku 4.x (cloud, cost-optimized)
- qwen2.5-coder:1.5b (local, Ollama, Raspberry Pi)
- qwen3:0.6b (local, Ollama, constrained hardware)
- Any model via OpenRouter

The tradeoffs are quality, not compatibility. A 600M parameter model following the `/review` skill will find fewer issues than Claude Sonnet 4. But it will follow the same structure, produce the same output format, and integrate with the same pipeline.

---

## Configuration

Create `.xstack/config.json` in your project root. All fields are optional.

```json
{
  "test_command": "pytest -x",
  "dev_server": "localhost:8000",
  "skip_eng_review": false,
  "greptile": false,
  "model_preference": {
    "plan": "cloud",
    "review": "cloud",
    "fix": "local",
    "ship": "local",
    "qa": "local",
    "retro": "local",
    "context": "local"
  }
}
```

| Key | Default | Description |
|---|---|---|
| `test_command` | auto-detect | Override test runner command |
| `dev_server` | auto-detect | URL for `/browse` and `/qa` |
| `skip_eng_review` | `false` | Allow `/ship` without a cleared review gate |
| `greptile` | `false` | Enable Greptile PR comment triage in `/review` and `/ship` |
| `model_preference` | — | (OpenClaw only) Route each skill to `"cloud"` or `"local"` model |

**Test runner auto-detection order:**  
`bun test` → `npm test` → `yarn test` → `pytest` → `go test ./...` → `cargo test` → `mix test` → `bundle exec rspec`

**Dev server auto-detection order:**  
Checks which of these ports accepts a connection: 3000, 4000, 5000, 5173, 8000, 8080, 8888

The `model_preference` field is an OpenClaw-specific extension. It allows high-reasoning tasks (plan, review) to be routed to cloud models while mechanical tasks (ship, qa, retro) run on local hardware. This is the key optimization for cost and latency when running a mixed local+cloud setup.

---

## Install Guide

### Requirements

| Tool | Required for | Install |
|---|---|---|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | Claude Code deployment | See Anthropic docs |
| [OpenClaw](https://github.com/aegiswizard/openclaw) | OpenClaw deployment | See OpenClaw docs |
| Git | All | Pre-installed on most systems |
| [Bun](https://bun.sh/) v1.0+ | `/browse`, `/qa` | `curl -fsSL https://bun.sh/install \| bash` |

---

### Claude Code — Global Install

Paste this into Claude Code:

```
Install Astack: run git clone https://github.com/aegiswizard/astack.git ~/.claude/skills/astack && cd ~/.claude/skills/astack && ./setup

Then add an "Astack" section to CLAUDE.md:

## Astack
Available skills: /plan, /review, /fix, /ship, /browse, /qa, /sync-cookies, /retro, /context
Use /browse for all web browsing and testing. Never use mcp__claude-in-chrome__* tools.
If skills stop working, run: cd ~/.claude/skills/astack && ./setup
```

---

### Claude Code — Project Install (share with teammates)

Paste this into Claude Code:

```
Add Astack to this project: run cp -Rf ~/.claude/skills/astack .claude/skills/astack && rm -rf .claude/skills/astack/.git && cd .claude/skills/astack && ./setup

Then add an "Astack" section to this project's CLAUDE.md with the same skill list above.

Teammates clone the repo normally. They run: cd .claude/skills/astack && ./setup
```

Real files are committed to the repo — not a submodule. `git clone` just works. Binary and `node_modules` are gitignored.

---

### OpenClaw — Native Embed

Astack is embedded in OpenClaw by default from version `[TBD]`. No separate install step needed.

To configure, create `.xstack/config.json` in your project root (see [Configuration](#configuration) above).

To verify Astack is active in your OpenClaw agent:

```bash
openclaw status --skills
```

Expected output includes: `plan, review, fix, ship, browse, qa, sync-cookies, retro, context`

---

### Manual install (any environment)

```bash
git clone https://github.com/aegiswizard/astack.git
cd astack
./setup
```

`setup` creates symlinks in `~/.claude/skills/` and builds the browser binary if Bun is available. Everything lives inside `.claude/` — nothing touches your PATH or runs in the background.

---

## Roadmap

### v1.0 — Foundation (current)
- [x] Nine core skills: plan, review, fix, ship, browse, qa, sync-cookies, retro, context
- [x] Stack auto-detection in /ship (8 runtimes)
- [x] `.astack/config.json` configuration system
- [x] Model-agnostic Markdown skill files
- [x] Structured output formats (CRITICAL/HIGH/MEDIUM/INFO)
- [x] Persistent state in `.xstack/`

### v1.1 — OpenClaw integration
- [ ] Register skills as OpenClaw agent capabilities
- [ ] System prompt injection pipeline for skill contexts
- [ ] `model_preference` routing in config
- [ ] Cross-skill orchestration (auto-gate in /ship)
- [ ] Session-persistent browser daemon managed by OpenClaw

### v1.2 — Cross-session memory
- [ ] `/plan` can reference previous plans when doing architecture
- [ ] `/retro` trend visualization over multiple weeks
- [ ] `/review` learns from false-positive history per codebase
- [ ] `/qa` baseline management and score trend charts

### v1.3 — Multi-model optimization
- [ ] Skill-level model routing (heavy reasoning → cloud, mechanical → local)
- [ ] Compressed skill variants for sub-1B parameter models
- [ ] Benchmark suite: skill quality vs model size tradeoffs

### v2.0 — Autonomous mode
- [ ] Astack can run full plan → review → qa → ship autonomously with approval gates
- [ ] PR monitoring: agent watches for review comments and responds
- [ ] Scheduled retros with digest delivery (WhatsApp, email, Slack)
- [ ] Multi-repo support (monorepo-aware diff analysis)

---

## Contributing

Astack is MIT licensed and fully open source. Contributions are welcome.

### How to contribute

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-improvement`
3. Make your changes
4. Test with: `bun test` (static tests, <5s)
5. For browser/QA changes: `EVALS=1 bun run test:evals` (~20min, requires live app)
6. Open a PR with the structured template

### What we're looking for

**High priority:**
- Skill improvements that make instructions more precise or more model-agnostic
- Stack auto-detection for additional runtimes
- OpenClaw integration work
- Linux compatibility fixes for `/browse` and `/sync-cookies`
- Compressed skill variants for small models (< 1B params)

**Community contributions:**
- Language-specific skill extensions (e.g., `/review` additions for Python async, Go concurrency patterns)
- Framework-specific QA flows (Next.js, Django, Phoenix, etc.)
- Integration guides for specific OpenClaw deployments

### What we don't want

- Opinion-based rewrites of skill philosophy
- Hard dependencies on external paid services
- Model-specific syntax (no Claude-only constructs)
- Bloated skill files that don't fit in small context windows

### Repo structure

```
astack/
  README.md                    # this file
  ARCHITECTURE.md              # internals, design decisions
  CONTRIBUTING.md              # this section in full
  BROWSER.md                   # browse/qa daemon reference
  setup                        # install script
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
  bin/                         # CLI utilities
  test/                        # static tests
```

---

## Acknowledgements

Astack was built by studying **gstack** by [Garry Tan](https://github.com/garrytan/gstack). The core concept — role-based cognitive modes for AI coding assistants — originated there. We are grateful for that work and have tried to build something that extends and improves on it in a way that serves the broader community.

The browser automation architecture is built on [Playwright](https://playwright.dev/) by Microsoft and [Bun](https://bun.sh/).

Astack is maintained by the **Aegis Wizard** project — a self-hosted, model-agnostic AI infrastructure stack built on OpenClaw.

---

## License

MIT License

Copyright (c) 2026 Aegis Wizard

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

*Built by Aegis Wizard 🧙‍♂️ — open source, self-hosted, model-agnostic AI infrastructure.*
