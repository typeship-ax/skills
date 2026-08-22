---
name: typeship-cli
description: Drive typeship from the terminal with the typeship CLI. Use to generate a package from a spec (with or without an account), create and configure projects, trigger regeneration, read generations and files, manage keys and usage, and interpret the CLI's JSON error envelope. Prefer this over the MCP server in terminals.
license: MIT
allowed-tools: Bash(typeship *), Bash(npx typeship *), Read, Write
---

# typeship CLI

`npm install -g typeship-ax` (or `npx -y typeship-ax@latest ...`). JSON on stdout, one JSON envelope on stderr for errors, exit 0/1/2. Full contract: `typeship agent-guide --format json`; command surface as data: `typeship help --json`. Reference: `references/commands.md`, `references/agent-contract.md`.

## First

```bash
typeship auth check --format json     # {status: ok|action_required, source, next_steps}
typeship init --all                   # once per machine: stores the key (or prints a sign-in link and waits for the user), installs skills, MCP config, AGENTS.md block
typeship init --all -k "$TYPESHIP_TOKEN"   # the same when the user hands you a key
```

## Generate

Anonymous works (first 25 operations, 20/min per address; spec contents and generated files are not retained). URL runs keep a seven-day claim recipe and return its link. With a key the plan's limits apply.

```bash
typeship generate run --spec '{"url":"https://api.example.com/openapi.json"}' --outputs '["typescript-sdk"]' --out generated/
typeship generate run --spec "{\"inline\":$(jq -Rs . < openapi.yaml)}" --outputs '["python-sdk"]' --out generated/
typeship generate run --spec '{"url":"..."}' --outputs '["typescript-sdk","cli","mcp"]' --out generated/
```

`--out` writes the files and prints `{meta, warnings, limits?, out: {written, dir}}`. Without `--out`, the whole response prints (large). If `limits` is present, read `omitted_operations` and `reason`. Report omissions only when the count is above zero. For `reason: "anonymous"`, offer authentication at `signup_url` without promising that a free account lifts the cap. For `reason: "free_plan"`, a key is already present: send the user to `upgrade_url`, not back to login or key setup.

## Projects (keyed)

Free includes one stored project, every selected output, and the first 25 operations. That project still gets on-demand and automatic regeneration, history, destination pull requests, and preview checks without a run quota. Stateless `generate run` never consumes the project slot. Pro adds projects and the whole spec; each selected output is a billing unit on Pro.

```bash
typeship projects create --name "Acme API" --spec-url https://api.example.com/openapi.json --outputs '["typescript-sdk","python-sdk","cli","mcp"]'
typeship projects generate <project_id>          # regenerate; returns every delivery package's files (large: redirect to a file)
typeship projects list-generations <project_id>
typeship generations get <generation_id>
typeship generations get-file <generation_id> --path src/index.ts
typeship projects update <project_id> --spec-patches '[...]' --config '{...}'
typeship projects delete <project_id> --force    # DELETE needs --force; without it: CONFIRMATION_REQUIRED
```

`projects generate` opens a pull request only when the complete generated tree differs from the destination. An already-current destination returns `meta.pr_status: "no_changes"` without creating a commit or branch.

`typeship projects create --help` lists every field. Repository-sourced projects (`--source '{"kind":"repo",...}'`) regenerate on pushes that change the spec and can also be forced on demand with `typeship projects generate`.

## Read the envelope

```json
{"status":"action_required","issues":[{"code":"NO_AUTH","message":"..."}],"docs_url":"https://typeship.dev","next_steps":["..."],"detail":{"status":401,"body":{...}}}
```

| code | do |
| --- | --- |
| `NO_AUTH` | set `TYPESHIP_TOKEN` or `typeship login --token`; anonymous `generate run` still works |
| `AUTH_INVALID` | the key is wrong or revoked; ask for a new one |
| `PLAN_LIMIT` | 402; `next_steps` has the upgrade URL; do not retry |
| `RATE_LIMITED` | wait the seconds named; do not loop |
| `SPEC_INVALID` | the spec cannot be used; switch to `typeship-spec-prep` |
| `CONFIRMATION_REQUIRED` | a delete needs `--force`; confirm with the user first |
| `NETWORK_ERROR` | check base URL and network; retry once |

## Docs from the terminal

`typeship docs search "<term>"`, `typeship docs read <page>`, `typeship docs <resource> <command>`.
