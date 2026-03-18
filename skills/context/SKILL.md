# /context

**Mode:** Project onboarding
**Use when:** Starting a new project, CLAUDE.md is missing or stale, or you need Claude to accurately understand the current state of a repo.

---

## What this does

Reads your codebase and writes (or refreshes) `CLAUDE.md` with accurate, current project context.

A good CLAUDE.md means Claude Code doesn't start every session from scratch. It knows your stack, your conventions, your architecture, and what to avoid.

---

## Reading pass

Collect information from:

1. **Directory structure** — top 2 levels, understand the shape of the project
2. **Package manifests** — `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `Gemfile`, etc. → language, framework, key dependencies
3. **Existing docs** — `README.md`, any `docs/` or `wiki/` content
4. **Recent git history** — last 20 commits, understand what's being actively worked on
5. **Test setup** — test runner, test file locations, any CI config (`.github/workflows/`, `Makefile`, etc.)
6. **Environment** — `.env.example` if present
7. **Existing CLAUDE.md** — if present, note what's stale vs still accurate

---

## Writing CLAUDE.md

Structure:

```markdown
# [Project Name]

## What this is
[One paragraph: what the project does and who it's for]

## Stack
- Language: [...]
- Framework: [...]
- Database: [...]
- Key dependencies: [...]
- Test runner: [command]
- Dev server: [command + default port]

## Architecture
[2-4 sentences on the main components and how they fit together]
[Directory map: what lives where and why]

## Conventions
- [Code style or formatting rules if determinable]
- [Branch naming if evident from git history]
- [PR conventions if evident]
- [Any patterns the codebase consistently uses]

## What to know before coding
- [Anything that isn't obvious from the code — gotchas, constraints, decisions that were made]
- [Parts of the codebase that are fragile or need extra care]
- [Test setup quirks]

## What NOT to do
- [Anti-patterns the codebase avoids]
- [Commands or patterns that cause problems]
```

---

## Handling existing CLAUDE.md

If `CLAUDE.md` already exists:

1. Read the current content
2. Compare against what you observe in the codebase
3. Mark stale sections explicitly before rewriting
4. Preserve any hand-written notes that look intentional (comments like `# Note:` or `# Important:`)
5. Show a diff summary of what changed

---

## After writing

Report:
- What was written or updated
- Any gaps where you couldn't determine something (e.g., database schema not in the repo, secrets not visible)
- Anything that looked like a potential problem worth flagging
