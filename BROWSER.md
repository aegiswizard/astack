# Browser Daemon Architecture

## Overview

The browser daemon is a persistent Chromium process (via Playwright) that provides fast browser automation for `/browse` and `/qa` commands.

**Key characteristics:**
- Cold start: ~3 seconds
- Subsequent calls: ~100ms
- Session lifetime: 30 minutes idle, then auto-shutdown
- State persistence: cookies, localStorage, tabs survive between commands

---

## Why a daemon?

Starting a browser is expensive (~3-5 seconds). Keeping it alive makes subsequent operations fast.

If `/browse` spawned a fresh browser for every command, a QA pass over 10 pages would take 30-50 seconds in startup overhead alone. With a persistent daemon, the same pass takes 1-2 seconds of actual browser work.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Claude Code / OpenClaw                                  │
│                                                          │
│  HTTP POST /command                                      │
│  {"action": "goto", "url": "https://example.com"}       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │  localhost:3777 (configurable)
                     ▼
┌─────────────────────────────────────────────────────────┐
│  browser-daemon (Bun + TypeScript)                       │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ console.log │  │  network    │  │   dialog    │     │
│  │   buffer    │  │   buffer    │  │   buffer    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│        │                 │                 │            │
│        └─────────────────┴─────────────────┘            │
│                          │                               │
│                    async flush                           │
│                          │                               │
│                          ▼                               │
│                   browser.log                            │
└─────────────────────────────────────────────────────────┘
                     │
                     │  Playwright API
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Chromium (headless)                                     │
│                                                          │
│  - Cookies persist in user data directory                │
│  - localStorage persists per origin                      │
│  - Tabs managed by daemon                                │
└─────────────────────────────────────────────────────────┘
```

---

## HTTP API

The daemon listens on `localhost:3777` by default (configurable via `BROWSER_PORT` env var).

### Commands

All commands are POST requests with JSON bodies.

#### `goto`
```json
{"action": "goto", "url": "https://example.com"}
```
Returns: `{"success": true, "title": "...", "url": "..."}`

#### `screenshot`
```json
{"action": "screenshot", "fullPage": false}
```
Returns: `{"success": true, "data": "<base64-encoded-png>"}`

#### `snapshot`
```json
{"action": "snapshot"}
```
Returns accessibility tree for fast element location.
Returns: `{"success": true, "tree": {...}}`

#### `text`
```json
{"action": "text"}
```
Returns visible text content.
Returns: `{"success": true, "text": "..."}`

#### `html`
```json
{"action": "html"}
```
Returns page source.
Returns: `{"success": true, "html": "..."}`

#### `click`
```json
{"action": "click", "selector": "button#submit"}
```
Or by role/label:
```json
{"action": "click", "role": "button", "name": "Submit"}
```

#### `fill`
```json
{"action": "fill", "selector": "input#email", "value": "test@example.com"}
```

#### `select`
```json
{"action": "select", "selector": "select#country", "value": "US"}
```

#### `press`
```json
{"action": "press", "key": "Enter"}
```

#### `wait`
```json
{"action": "wait", "ms": 1000}
```

#### `console`
```json
{"action": "console"}
```
Returns buffered console messages since last check.
Returns: `{"success": true, "messages": [...]}`

#### `network`
```json
{"action": "network"}
```
Returns buffered network requests/responses.
Returns: `{"success": true, "requests": [...]}`

#### `cookies`
```json
{"action": "cookies"}
```
Returns current session cookies.
Returns: `{"success": true, "cookies": [...]}`

#### `links`
```json
{"action": "links"}
```
Returns all links on the page.
Returns: `{"success": true, "links": [{"text": "...", "href": "..."}]}`

#### `new-tab`
```json
{"action": "new-tab"}
```
Opens a new tab.
Returns: `{"success": true, "tabIndex": 1}`

#### `switch-tab`
```json
{"action": "switch-tab", "index": 0}
```

#### `close-tab`
```json
{"action": "close-tab"}
```
Closes current tab.

#### `back` / `forward` / `reload`
```json
{"action": "back"}
{"action": "forward"}
{"action": "reload"}
```

#### `shutdown`
```json
{"action": "shutdown"}
```
Gracefully closes the browser and exits the daemon.

---

## State Management

### Cookies
Cookies are stored in a user data directory specific to the daemon. They persist across commands within a session.

```typescript
const context = await browser.newContext({
  storageState: '.browser-state/storage.json'
});
```

### Buffers
Three circular buffers hold transient data:

```typescript
const consoleBuffer: ConsoleMessage[] = [];
const networkBuffer: RequestResponse[] = [];
const dialogBuffer: Dialog[] = [];
```

Buffers are flushed to disk every 1 second:
```typescript
setInterval(() => {
  fs.appendFileSync('.xstack/browser.log', formatBuffer());
}, 1000);
```

### Session Timeout
The daemon auto-shuts down after 30 minutes of inactivity:

```typescript
let lastActivity = Date.now();
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

setInterval(() => {
  if (Date.now() - lastActivity > IDLE_TIMEOUT_MS) {
    gracefulShutdown();
  }
}, 60000); // Check every minute
```

---

## Building

From the astack directory:

```bash
bun install
bun run build
```

This compiles `bin/browser-daemon.ts` to `bin/browser-daemon` (native executable).

---

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `BROWSER_PORT` | `3777` | HTTP server port |
| `BROWSER_IDLE_TIMEOUT` | `1800000` | 30 minutes in ms |
| `BROWSER_STATE_DIR` | `.browser-state` | Cookie/storage directory |

---

## Error Handling

All errors return:
```json
{"success": false, "error": "Error message"}
```

Common errors:
- Browser not started: `{"error": "Browser not initialized"}`
- Navigation failed: `{"error": "Navigation timeout"}`
- Element not found: `{"error": "No element matching selector: ..."}`

---

## Security

- The daemon binds to localhost only (not accessible externally)
- No authentication required (intended for local development only)
- Do not expose the daemon port to external networks
- Do not use `/browse` against production environments with real credentials

---

## Debugging

Enable verbose logging:
```bash
BROWSER_DEBUG=1 bun run bin/browser-daemon.ts
```

Logs are written to `.xstack/browser.log`.