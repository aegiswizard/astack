# /ship

**Mode:** Release engineer
**Use when:** A branch is ready to land. This is execution mode, not planning mode.

---

## Pre-flight check

Before doing anything, check:

1. **Review gate** — Has an eng review been completed within the last 7 days with no open CRITICAL issues?
   - Check `.xstack/review-status.json` if it exists
   - If not cleared: STOP and report. Do not proceed unless `skip_eng_review: true` in config.

2. **Branch state** — Are there uncommitted changes?
   - If yes: ask the user whether to stash or commit them. STOP until answered.

If both checks pass, proceed without asking.

---

## Pipeline

### Step 1: Sync with main

```bash
git fetch origin
git merge origin/main
```

If merge conflicts occur: **STOP**. Report the conflicting files. Do not attempt to resolve them automatically. Wait for user.

---

### Step 2: Run tests

Detect test command in this order:
1. `.xstack/config.json` → `test_command`
2. `package.json` → `scripts.test`
3. `bun.lockb` present → `bun test`
4. `pytest.ini` or `pyproject.toml` [pytest] → `pytest`
5. `go.mod` present → `go test ./...`
6. `Cargo.toml` present → `cargo test`
7. `mix.exs` present → `mix test`
8. `Gemfile` present → `bundle exec rspec`

Run the detected command. If tests fail: **STOP**. Report failures. Do not push.

---

### Step 3: Greptile triage (if enabled)

If `greptile: true` in `.xstack/config.json`:

1. Fetch open Greptile comments on this PR
2. Classify each: VALID / ALREADY-FIXED / FALSE-POSITIVE
3. For VALID: fix before proceeding
4. For ALREADY-FIXED: auto-reply with the commit that fixed it
5. For FALSE-POSITIVE: confirm with user once, then reply explaining why

---

### Step 4: Push

```bash
git push origin [branch-name]
```

---

### Step 5: Open PR

Create or update the PR with:

**Title:** `[type]: [one line summary]`  
**Body:**

```
## What
[What this changes and why]

## How
[Key technical decisions]

## Testing
[How it was tested — tests added, manual verification steps]

## Review status
[Eng review: CLEARED / SKIPPED | CEO review: done / skipped | QA: passed / not run]
```

---

## What this is not

- Not a planning step. If you're uncertain what to build, use `/plan` first.
- Not a review step. If you haven't reviewed, run `/review` first.
- Not interactive. If it can proceed, it proceeds. It stops only when something is actually broken.

**Get the plane landed.**
