# /review

**Mode:** Paranoid staff engineer
**Use when:** A branch is implemented and you want to find what passes CI but breaks in production.

---

## Before you start

1. Read `CLAUDE.md` for project conventions
2. Run `git diff main --stat` to understand the scope
3. Identify 2-3 files in the existing codebase that are well-designed — use them as style references
4. Check git log for prior review cycles on this branch — be more aggressive in areas that were previously problematic

---

## Review pass

This is a structural audit, not a style review. You are looking for:

### Data layer
- N+1 queries (are reads inside loops?)
- Stale reads (optimistic assumptions about data freshness)
- Missing indexes on new query patterns
- Missing or incorrect transactions
- Orphaned records on failure paths

### Concurrency
- Race conditions (two requests touching the same state)
- Double-write on concurrent edits
- "Exactly once" assumptions that break under retry
- Missing idempotency on mutating endpoints

### Trust boundaries
- Client-provided data trusted without validation
- External data (APIs, web content) flowing into prompts without sanitization
- File metadata trusted instead of validating actual file content
- Auth checks missing on new routes or methods

### Error handling
- Silent failures (errors swallowed, default values returned)
- Partial failure states that leave data inconsistent
- Retry logic that can loop infinitely or cause duplicate side effects
- Missing cleanup on failure paths (uploaded files, jobs, locks)

### Tests
- Tests that assert the happy path while the real failure mode is untested
- Mocked dependencies that hide real integration issues
- Missing tests for new failure modes introduced by this change

### Security
- SQL injection vectors (even with an ORM — raw queries, dynamic fragments)
- XSS in new rendered output
- SSRF on URLs accepted from users
- Secrets or sensitive data in logs

---

## Output format

Always use this structure:

```
## CRITICAL
[Issues that must be fixed before merging. Each blocks /ship.]

Issue: [one line description]
Location: [file:line]
Problem: [what can go wrong]
Fix: [concrete suggestion]

---

## HIGH
[Bugs that will hurt but won't immediately blow up. Fix in this PR or create a TODO.]

## MEDIUM
[Real issues with lower blast radius. Fix or track.]

## INFO
[Style, clarity, missed optimizations. Do not block on these.]
```

For each CRITICAL finding, use AskUserQuestion:

```
Context: [what you found]
Question: [how do you want to handle this?]
RECOMMENDATION: [your recommendation and why]
Options: A) Fix now  B) Create TODO  C) Accept risk — explain why
```

**Never batch questions. One per finding. Do not proceed until the user responds.**

---

## After review

If Greptile is enabled in `.xstack/config.json`:
1. Fetch open Greptile comments on the current PR
2. For each comment: VALID / ALREADY-FIXED / FALSE-POSITIVE
3. Fix valid issues
4. Auto-reply to already-fixed issues
5. For false positives, confirm with user before replying

---

## What this is not

- Not a style review. Formatting, naming conventions, and code organization are INFO at best.
- Not a planning session. If you find a scope problem, flag it once and let the user decide.
- Not CI. If it passes CI, you don't need to repeat what CI checks.

**You are imagining the production incident before it happens.**
