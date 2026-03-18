# /retro [--week | --month | --compare]

**Mode:** Engineering manager
**Use when:** You want a candid analysis of what your team actually shipped, with specific per-person feedback.

---

## Before you start

Determine the time range:
- `--week` (default): last 7 days
- `--month`: last 30 days
- `--compare`: current week vs previous week side by side

Read prior retro snapshots from `.xstack/retros/` to provide trend context.

---

## Data to collect

Run these and parse the output:

```bash
# Commits in range
git log --since="7 days ago" --pretty=format:"%H|%ae|%ad|%s" --date=short

# LOC by author
git log --since="7 days ago" --numstat --pretty=format:"%ae" | [parse into per-author totals]

# Files most frequently changed
git log --since="7 days ago" --name-only --pretty=format: | sort | uniq -c | sort -rn | head -20

# Test file ratio
git log --since="7 days ago" --name-only --pretty=format: | grep -c "test\|spec" || true
```

From this compute per contributor:
- Commit count
- Lines added / removed / net
- Test file ratio (test LOC / total LOC)
- Active days
- PR sizes (if accessible via git or GitHub CLI)
- Fix ratio (commits with "fix", "bug", "patch" in message)

---

## Output format

### Header line (tweetable summary)
```
Week of [date]: [N] commits ([N] contributors), [K] LOC net, [N]% tests, [N] PRs, peak: [hour] | Streak: [N]d
```

### Team summary
Top 3 wins this week. Top 3 things to improve. Top 3 habits to carry into next week.

### Per contributor

For each person who made commits:

```
## [Name]
[N] commits, +[K] LOC, [N]% tests. Active [N] days. Peak: [hours].
Biggest ship: [most significant commit or PR in plain English].

**What they did well:** [specific, not generic — cite actual commits or patterns]

**One growth opportunity:** [honest, actionable, not harsh]
```

Be specific. "Great work this week" is useless. "Every PR was under 200 LOC with matching test coverage" is useful. "Three commits reverted — worth pausing before pushing to main" is useful.

---

## Hotspots

List top 5 most-changed files this period. Flag any file changed in every retro for the past 3+ periods — this is an architectural smell worth naming.

---

## Save snapshot

Write a JSON snapshot to `.xstack/retros/[YYYY-MM-DD].json`:

```json
{
  "date": "...",
  "range_days": 7,
  "contributors": [...],
  "team_commits": 0,
  "team_net_loc": 0,
  "test_ratio": 0.0,
  "health_score": 0,
  "hotspots": [...]
}
```

---

## `--compare` mode

Run the same analysis for both this week and last week. Output side-by-side:

```
              This Week    Last Week    Delta
Commits           47           31        +16
Net LOC         +3.2k        +1.8k      +1.4k
Test ratio        38%          29%        +9%
Active days        5            4         +1
```

Then: what improved, what declined, what to watch.
