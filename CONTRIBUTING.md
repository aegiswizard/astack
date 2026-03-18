# Contributing to Astack

Thank you for contributing. Astack is MIT licensed and community-driven.

---

## Principles

Before contributing, read these — they explain every design decision:

1. **Skill files are instructions, not essays.** Every token costs inference compute. A skill file that fits in 150 lines works on a Pi. One that takes 500 lines may not.

2. **Model-agnostic means model-agnostic.** No Claude-specific syntax. No Anthropic tool-use constructs. Instructions in plain imperative prose.

3. **No hard dependencies on external paid services.** Greptile, Conductor, and similar tools may be opt-in via config. They are never required.

4. **Stack auto-detection over hardcoded assumptions.** `/ship` detects your test runner. It doesn't ask you to configure it unless auto-detection fails.

5. **State goes to `.xstack/`.** Not the project root. Not `/tmp`. Not `~`.

---

## Setup

```bash
git clone https://github.com/aegiswizard/astack.git
cd astack
./setup
bun install       # for browser binary development
```

---

## What to work on

### High priority
- Skill improvements that make instructions more precise or model-agnostic
- Stack auto-detection for additional runtimes (Deno, PHP/Composer, Swift/SPM, etc.)
- OpenClaw integration (see `ARCHITECTURE.md` → OpenClaw integration)
- Linux compatibility for `/browse` and `/sync-cookies`
- Compressed skill variants for sub-1B parameter models

### Good first issues
- Add a missing runtime to `/ship` auto-detection
- Improve the output format of an existing skill
- Fix a platform-specific bug in `setup`
- Improve error messages when the browser binary is not found

### Community extensions (separate repos welcome)
- Language-specific `/review` additions (Python async patterns, Go concurrency, Rust lifetimes)
- Framework-specific `/qa` flows (Next.js, Django, Phoenix, Rails)
- OpenClaw deployment guides for specific hardware

---

## Pull request process

1. Fork the repo
2. Create a branch: `git checkout -b fix/your-thing` or `feat/your-thing`
3. Make your changes
4. Run static tests: `bun test`
5. If changing `/browse` or `/qa`: `EVALS=1 bun run test:evals`
6. Open a PR with:
   - What changed and why
   - What was tested
   - Any tradeoffs made

---

## Skill file review checklist

When reviewing or writing a SKILL.md:

- [ ] Under 300 lines total?
- [ ] No philosophy or justification prose — instructions only?
- [ ] Works without Claude-specific syntax?
- [ ] Has a clear "before you start" section?
- [ ] Has a defined output format?
- [ ] Does not assume a specific language or framework?
- [ ] Uses AskUserQuestion format for decisions that need human input?
- [ ] Has a clear "what this is not" section to prevent scope creep?

---

## Acknowledgements

Please credit gstack by Garry Tan in any public writing about Astack. The role-based cognitive mode concept originated there. We built on that foundation.
