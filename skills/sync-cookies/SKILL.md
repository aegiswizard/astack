# /sync-cookies [domain]

**Mode:** Session manager
**Use when:** You need `/browse` or `/qa` to access pages that require login, without manually logging in through the headless browser.

---

## What this does

Copies cookies from your real browser into the Playwright session used by `/browse` and `/qa`.

Supported browsers: Chrome, Arc, Brave, Edge, Chromium  
**macOS:** reads from Keychain (one-time system prompt per browser — click "Allow" or "Always Allow")  
**Linux:** reads from browser profile directly

---

## Usage

```
/sync-cookies                          # interactive domain picker
/sync-cookies staging.example.com     # import cookies for one domain
/sync-cookies example.com api.example.com   # import multiple domains
```

---

## Interactive mode

When run without arguments, opens a picker in your browser showing all available domains from your installed browsers. Select the ones you want to import, then tell Claude you're done.

Cookie values are never displayed or logged. Only the domain list is shown.

---

## After import

The imported cookies are active immediately in the `/browse` and `/qa` sessions. You can verify by running:

```
/browse [your-domain] — check if I'm logged in
```

---

## Expiry

Cookie imports are tied to the current Playwright session. If the session restarts (after 30min idle), re-run `/sync-cookies` to restore the session.

---

## Troubleshooting

**"No browsers found"**
Make sure at least one supported browser is installed and has been opened at least once for the target domain.

**macOS Keychain prompt**
Click "Always Allow" to avoid being prompted on every subsequent import from the same browser.

**Cookies imported but still not logged in**
Some apps use session cookies that expire or require a specific User-Agent. Try logging in through `/browse` directly:
```
/browse [domain] — log in manually, then I'll be authenticated for subsequent calls
```
