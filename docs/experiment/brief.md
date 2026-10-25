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

Two conditions, three runs each: with MCP and without MCP. Everything else
stays the same, so any difference comes from the MCP server.

Alternate the conditions (with, without, with, without, …) instead of doing
all of one first, so a change in the model or the API over the days of
testing affects both conditions equally. Use the same tarball for all six
runs, and don't change Tally until they're done.

| Run | Condition   | Date | Notes |
| --- | ----------- | ---- | ----- |
| 1   | With MCP    |      |       |
| 2   | Without MCP |      |       |
| 3   | With MCP    |      |       |
| 4   | Without MCP |      |       |
| 5   | With MCP    |      |       |
| 6   | Without MCP |      |       |
