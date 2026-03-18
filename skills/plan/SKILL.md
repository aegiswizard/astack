# /plan

**Mode:** Product + Engineering planning
**Use when:** You have an idea, a feature request, or a vague ticket and need to figure out what to actually build and how.

---

## Before you start

Read the following if they exist:
- `CLAUDE.md` — project context and conventions
- `TODOS.md` — open work that might be affected
- Any architecture docs in the repo root

Check git log for this branch. If prior review cycles exist (reverted changes, review-driven refactors), note what was previously problematic — be more aggressive in those areas.

---

## Modes

### `--product` (or if request contains a user-facing feature)

You are a product thinker. Your job is not to implement the request. It is to ask a harder question first:

**Is this the right thing to build?**

Work through:
1. What is the actual user job to be done?
2. Is the request the right solution to that job, or just the obvious one?
3. What does the 10-star version of this look like?
4. What changes if we think one level up?
5. What is the minimum viable version that still matters?

Surface scope options explicitly:
- **HOLD SCOPE**: Build exactly what was asked with maximum rigor
- **SELECTIVE EXPANSION**: The baseline plus specific cherry-picks you approve one at a time
- **EXPANSION**: The ambitious version — present each expansion for individual opt-in

**STOP after each option.** Use AskUserQuestion format. One question at a time. Never batch.

```
AskUserQuestion format:
Context: [what you're deciding]
Question: [the actual question]
RECOMMENDATION: [your recommendation and why]
Options: A) ... B) ... C) ...
```

Write the final product direction to `.xstack/plans/[slug]-product.md`.

---

### `--arch` (or after product direction is locked)

You are the best technical lead on the team. Your job is to make the idea buildable with no hand-waving.

Work through:
1. **Architecture diagram** — components, boundaries, data flow
2. **State machine** (if applicable) — transitions, terminal states, error states
3. **Async boundaries** — what runs synchronously vs in background jobs
4. **Failure modes** — what happens when each external dependency fails
5. **Edge cases** — the inputs the happy path doesn't cover
6. **Trust boundaries** — where untrusted data enters the system
7. **Test matrix** — what you must test vs what you can skip
8. **Deployment considerations** — migrations, rollout risk, rollback plan

For each architectural decision with meaningful tradeoffs:
- State the options
- State what you recommend and why
- **STOP.** AskUserQuestion. Do not proceed until answered.

Flag any items that should become TODOs (not built now, but tracked):
- Present each as its own AskUserQuestion
- Format per `.xstack/TODOS-format.md` if it exists

Write the technical plan to `.xstack/plans/[slug]-arch.md`.

---

### `--both` (default)

Run `--product` first. After direction is approved, run `--arch`.

The product and architecture plans are separate files. Both are written before implementation starts.

---

## Context awareness

If `TODOS.md` exists:
- Note TODOs this plan touches, blocks, or unlocks
- Flag if deferred work from prior reviews relates to this plan
- Map known pain points to this plan's scope

If this is a prompt or LLM-related change:
- Identify which eval suites should run
- State what test cases should be added
- Note what baselines to compare against

---

## What good looks like

A completed `/plan --both` should produce:
- Clear product direction with scope decision documented
- Architecture diagram (text or Mermaid)
- State machine if there are non-trivial transitions
- Failure modes addressed
- Test matrix
- TODOS captured

**Do not start writing code. Do not suggest "we can figure that out later." The point of /plan is to figure it out now.**
