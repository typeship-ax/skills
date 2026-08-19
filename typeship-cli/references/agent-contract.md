# The typeship CLI agent contract

Source of truth: `typeship agent-guide --format json` (this file mirrors it).

- Output: JSON on stdout. `--all` streams every page of a paginated list as NDJSON. Streaming operations emit one JSON line per event.
- Errors: one envelope on stderr, `{status: "error"|"action_required", issues: [{code, message}], docs_url?, next_steps: [], detail?}`. Codes: NO_AUTH, AUTH_INVALID, PLAN_LIMIT, NOT_FOUND, INVALID_REQUEST, SPEC_INVALID, RATE_LIMITED, SERVER_ERROR, NETWORK_ERROR, VALIDATION_FAILED, TTY_REQUIRED, CONFIRMATION_REQUIRED, INVALID_USAGE, UNKNOWN_COMMAND, UNKNOWN_FLAG, MISSING_ARGUMENT, COMMAND_FAILED.
- Exit codes: 0 ok; 1 the request or command failed; 2 usage (wrong flags, missing arguments, a confirmation was required).
- Agent mode: `--mode agent`, `TYPESHIP_MODE=agent`, or no terminal on stdin and stdout. No prompts, no browsers (`docs --web` prints the URL), stops are `action_required`.
- Destructive: every DELETE needs `--force` (or `--yes`, `TYPESHIP_YES=1`).
- Flags: positional path arguments first, then `--flags`. JSON-typed flags take JSON; repeat a flag for arrays; `--data '<json>'` merges under field flags. `--out <dir>` writes file-shaped responses to disk.
- Auth: `TYPESHIP_TOKEN` in the environment > `--token` > `typeship login` credentials file. `POST /generate` (`typeship generate run`) needs no key.
- Base URL: `--base-url` > `TYPESHIP_BASE_URL` > `typeship config` > `https://typeship.dev/api/v1`.
- Discovery: `typeship --help`, `typeship <resource> <command> --help`, `typeship help --json`, `typeship docs search <term>`; docs index https://typeship.dev/llms.txt.
- Setup: `typeship init --all -k <key>`; check: `typeship auth check --live`, `typeship doctor`.
- MCP: `typeship mcp install --all` registers https://typeship.dev/mcp with every agent client found (auth env var as a reference). Cursor is skipped until it speaks MCP 2026-07-28.
