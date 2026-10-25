# Phase 3 experiment brief (draft)

## Purpose

Find out whether Tally's agent-facing docs (the generated manifest and the
`tally-ui-mcp` server) help a coding agent build a real app correctly with
the library. A cold agent builds the same app with and without the MCP server,
and the results are compared.

## The prompt

The exact text the agent gets is in [prompt.md](prompt.md). Send it with
nothing added. To copy it:

```bash
pbcopy < docs/experiment/prompt.md
```

## Setup for each run

1. Recreate the sandbox from scratch (a fresh Vite `react-ts` app), then
   install the current tarball with `npm install <path>/han-sen-tally-ui-0.1.0.tgz`.
2. **With MCP:** `claude mcp add tally-ui -- npx tally-ui-mcp` in the sandbox.
   **Without MCP:** run `claude mcp remove tally-ui` instead, since the
   registration is tied to the folder path and survives recreating the
   sandbox. Check with `claude mcp list` that it's gone. The agent still has
   the installed package, its README, and its `.d.ts` files.
3. Start a new Claude Code session in the sandbox with no memory or
   `CLAUDE.md` (check that
   `~/.claude/projects/-Users-michaelhansen-code-tally-sandbox/memory/` is
   empty), and paste the prompt.
4. Don't answer questions or give hints mid-run. If the agent stops early,
   reply only "Continue."

## What to measure

- **Build health:** type errors and build errors at the end, and how many
  correction rounds the agent needed to get there.
- **Invented API:** props or components that don't exist in Tally.
- **Component choice:** whether it used the Tally component the docs point to
  for each need (search, comparison chart, headline numbers, ranked list,
  loading and empty states) or built its own.
- **Token adherence:** raw colors (`bg-blue-500`, hex values) versus Tally
  tokens.
- **Accessibility:** results of an axe check on the finished page, and a
  keyboard pass through search, compare, and remove.
- **Process:** which docs it read (MCP calls, `.d.ts` files, README) and how
  many tool calls it took.

## Runs

Two conditions, with MCP and without MCP, alternating so a change in the
model or the API over time affects both equally. All runs used the same
tarball, with no Tally changes in between. The plan was three runs each; we
stopped after two each (four total), which keeps the comparison balanced.
Runs 5 and 6 can be added later with the same tarball.

| Run | Condition   | Date       | Notes                                                             |
| --- | ----------- | ---------- | ----------------------------------------------------------------- |
| 1   | With MCP    | 2026-10-25 | MCP tools offered but never called; read README and `.d.ts` files |
| 2   | Without MCP | 2026-10-25 | Found and read `dist/manifest.json` directly                      |
| 3   | With MCP    | 2026-10-25 | Called `get_component` ×4 and `get_tokens`                        |
| 4   | Without MCP | 2026-10-25 | Read README and `.d.ts` files                                     |

## Results

All four runs:

- Type-checked, built, and linted with no errors, from the prompt alone
  (no "Continue" needed).
- Used no raw colors. Their own CSS used `var(--tally-*)` tokens.
- Used Tally components for every need: Combobox for search, LineChart and
  Legend for the comparison, Table for the top ten, and Alert, EmptyState,
  and Skeleton for failures, empty data, and loading. Three of four used
  StatCard for the headline numbers; run 2 used a summary Table.
- Passed an axe check with 0 violations (run 1 checked on initial load only;
  runs 2–4 also with an article added).

The MCP server made little difference. The same JSDoc reaches agents through
the shipped `.d.ts` files and `manifest.json`, so both conditions got the
guidance. What mattered was the content of the docs, not how they were
delivered.

The runs found Tally bugs the agents had to work around:

- LineChart's fixed y-axis margin cuts off wide labels such as "12,000"
  (runs 1, 3, and 4).
- Heading doesn't forward a `ref` (run 1).
- `EmptyState.Icon` expects an icon, but Tally doesn't export any (run 1).
