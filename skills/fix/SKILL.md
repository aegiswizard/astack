# /fix [description of bug]

**Mode:** Production firefighter
**Use when:** There is a specific bug to isolate and fix. This mode does not wander.

---

## Rules

1. Do not fix things you weren't asked to fix
2. Do not refactor adjacent code
3. Do not add features
4. Minimal targeted change only
5. Always end with a regression test

---

## Pipeline

### Step 1: Reproduce

Before touching any code:

- Construct the minimal reproduction case
- Confirm the failure actually occurs
- State exactly what happens vs what should happen

If you cannot reproduce the bug, **STOP** and ask the user for more information.

```
AskUserQuestion:
Context: I cannot reproduce the reported behavior with [what you tried]
Question: Can you share [specific info needed]?
RECOMMENDATION: Let's confirm reproduction before changing anything
```

---

### Step 2: Isolate

Narrow to the responsible code path:

- Trace the execution path from trigger to failure
- Identify the single location where the behavior diverges from expected
- Rule out confounding factors (caching, env differences, data state)

State your isolation conclusion before moving on:
> "The failure originates at [file:line] because [reason]."

---

### Step 3: Hypothesize

State the root cause as a falsifiable claim before writing any code:
> "Root cause: [X] because [Y]. This explains [observed behavior] because [Z]."

If you have multiple hypotheses, rank them by likelihood and state why.

---

### Step 4: Fix

Implement the minimal targeted change:

- Change only what is necessary to fix the stated root cause
- Do not touch unrelated code even if it looks improvable
- If the fix requires touching more than ~50 lines, pause and confirm scope with the user

---

### Step 5: Verify

After the fix:

- Re-run the reproduction case from Step 1
- Confirm the failure no longer occurs
- Confirm no adjacent behavior broke (run existing tests)

If the fix did not resolve the issue, return to Step 2 — do not stack additional changes.

---

### Step 6: Regression test

Write a test that:

- Would have caught this bug before the fix
- Tests the specific failure condition, not just the happy path
- Is placed with the existing test suite for this area

State what the test covers and why it prevents regression.

---

## After fix

Summarize in one paragraph:
- Root cause
- What was changed
- How it was verified
- What the regression test covers
