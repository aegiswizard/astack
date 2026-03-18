# /browse [url] [instruction]

**Mode:** QA engineer with real browser
**Use when:** You need Claude to see a live URL — navigate, screenshot, fill forms, check console output.

---

## What this is

A persistent headless Chromium session (Playwright + Bun). 

- Cold start: ~3 seconds
- Subsequent calls: ~100ms
- Session stays alive: 30 minutes idle, then auto-shutdown
- State persists: cookies, localStorage, tabs carry over between commands in the same session

---

## Common uses

```
/browse localhost:3000 — log in as test@example.com and check the dashboard
/browse staging.example.com — run through the signup flow
/browse https://docs.example.com — find the rate limiting section
/browse localhost:3000/admin — check the user list loads correctly
/browse staging.example.com/checkout — add an item and go through checkout
```

---

## What the browser can do

**Navigate:**
- `goto [url]` — navigate to URL
- `back` / `forward` — browser history
- `reload` — refresh page

**Read:**
- `snapshot` — accessibility tree (fast, good for finding elements)
- `screenshot` — capture what's visible
- `text` — extract visible text
- `html` — page source
- `console` — JS console output since last check
- `network` — recent network requests and responses
- `cookies` — current session cookies
- `links` — all links on the page

**Interact:**
- `click [element]` — click by label, role, or selector
- `fill [element] [value]` — type into an input
- `select [element] [value]` — choose from a dropdown
- `check` / `uncheck [element]` — checkboxes
- `hover [element]` — mouse hover
- `press [key]` — keyboard event (Enter, Tab, Escape, etc.)
- `scroll [direction]` — scroll the page
- `wait [ms]` — pause (use sparingly)

**Tabs:**
- `new-tab` — open a new tab
- `switch-tab [n]` — switch to tab by index
- `close-tab` — close current tab

---

## Security note

This is a real browser with real state. Cookies, localStorage, and session data persist across commands.

Do not use `/browse` against production environments unless you intend to interact with real data and real sessions.

---

## If the browser binary is not found

Run from the astack directory:

```bash
bun install && bun run build
```

Requires Bun v1.0+.
