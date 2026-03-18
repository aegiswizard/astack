# TODOS.md Format

This file defines the standard format for TODO items that `/plan` creates and tracks.

---

## Location

Create `TODOS.md` in your project root (same level as `CLAUDE.md`).

---

## Format

```markdown
# TODOs

## In Progress
- [ ] [TODO-001] Short description — context, why it matters
- [ ] [TODO-002] Another item — what's blocking, next step

## Planned
- [ ] [TODO-003] Future work — depends on, priority

## Blocked
- [ ] [TODO-004] Stuck item — blocker description, needed resolution

## Completed
- [x] [TODO-005] Done item — completed date, outcome notes
```

---

## Fields

Each TODO has:

| Field | Required | Description |
|-------|----------|-------------|
| ID | Yes | `TODO-NNN` format, sequential |
| Description | Yes | One-line summary |
| Context | Recommended | Why this matters, what's involved |
| Status | Yes | In Progress / Planned / Blocked / Completed |

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| **In Progress** | Currently being worked on |
| **Planned** | Queued for future, not started |
| **Blocked** | Cannot proceed without external input |
| **Completed** | Done and verified |

---

## When /plan creates TODOs

During `/plan --arch`, items flagged as "track for later" become TODOs:

```
AskUserQuestion:
Context: [what was discussed]
Question: Should this become a tracked TODO?
RECOMMENDATION: Yes — it's important but out of scope for this PR
Options: A) Create TODO  B) Skip for now
```

If confirmed, add to `TODOS.md` under Planned.

---

## Example

```markdown
# TODOs

## In Progress
- [ ] [TODO-007] Add retry logic to payment processor — needed for transient failures, affects checkout flow

## Planned
- [ ] [TODO-008] Migrate user sessions to Redis — current in-memory approach won't scale past 10k users
- [ ] [TODO-009] Add rate limiting to public API — referenced in incident postmortem, priority medium

## Blocked
- [ ] [TODO-004] Upgrade to Node 20 — blocked by webpack issue, needs investigation

## Completed
- [x] [TODO-001] Implement password reset flow — completed 2024-01-15, tested on staging
- [x] [TODO-002] Add request logging middleware — completed 2024-01-18, logs to .xstack/
```

---

## Maintenance

- Review `TODOS.md` at the start of each `/plan` session
- Move items between sections as status changes
- Remove completed items older than 30 days (or archive them)
- Keep total items under 50 — split into multiple files if needed

---

## Integration with /plan

When running `/plan`:

1. Read `TODOS.md` if it exists
2. Note which planned/blocked items relate to the current work
3. Ask if new TODOs should be created
4. Update status after decisions are made