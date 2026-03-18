# /qa [url] [--quick | --full | --regression baseline]

**Mode:** QA lead
**Use when:** You want systematic testing of your app in a real browser.

---

## Before you start

1. Check `.xstack/config.json` for `dev_server` — use that URL if no URL is provided
2. If no config, attempt to detect running dev server:
   - `localhost:3000`, `localhost:8000`, `localhost:4000`, `localhost:5000`, `localhost:5173`
   - Check which port is accepting connections
3. If the app needs authentication, check whether `/sync-cookies` has been run for this domain
4. If on a feature branch (not main), default to **diff-aware** mode

---

## Modes

### Diff-aware (default on a feature branch)

```bash
git diff main --name-only
```

From the changed files, identify:
- Which routes/pages are affected
- Which API endpoints changed
- Which UI components changed

Test each affected route:
- Does the page load without error?
- Does the primary user flow on that page work?
- Are there console errors?
- Does it look correct (screenshot + visual check)?

Report: routes tested, pass/fail per route, any issues found.

---

### `--quick` (30 second smoke test)

1. Load the homepage
2. Navigate to the top 5 links in the main nav
3. Check for console errors on each
4. Screenshot each
5. Report: loaded / errors / visual issues

---

### `--full` (systematic exploration)

1. Map the app: find all routes via nav, sitemap, or links
2. For each route:
   - Load
   - Screenshot
   - Check console
   - Test primary interaction (form, button, flow)
3. Test at least one complete user flow end-to-end
4. Report with health score (0-100), issues ranked CRITICAL → HIGH → MEDIUM

---

### `--regression baseline.json`

Run `--full`, then diff against the provided baseline:
- Which issues are resolved since last run?
- Which issues are new?
- Score delta

---

## What to check on every page

- Page loads (no 5xx, no redirect loops)
- No uncaught JS errors in console
- No broken images or resources
- Primary interactive elements respond
- Mobile viewport: no overflow, nav accessible

---

## Output

```
QA Report — [url] — [date]
Mode: [mode]
Health Score: [0-100]

CRITICAL (must fix before shipping):
- [issue] — [page] — [screenshot if relevant]

HIGH:
- [issue] — [page]

MEDIUM:
- [issue] — [page]

PASSED:
- [route]: OK
- [route]: OK

Screenshots: .xstack/qa-reports/[timestamp]/
```

Reports and screenshots are saved to `.xstack/qa-reports/[timestamp]/`.

---

## For authenticated pages

Run `/sync-cookies [domain]` before running `/qa` if the pages you need to test require login. The `/browse` session cookies carry through to `/qa`.
