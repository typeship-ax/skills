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
typeship init --all -k "$TYPESHIP_TOKEN"   # once per machine when a key exists: stores it, installs skills, MCP config, AGENTS.md block
```

## Generate

Anonymous works (first 25 operations, 20/min per address, nothing stored). With a key the plan's limits apply.

```bash
typeship generate run --spec '{"url":"https://api.example.com/openapi.json"}' --language typescript --out sdk/
typeship generate run --spec "{\"inline\":$(jq -Rs . < openapi.yaml)}" --language python --out sdk/
typeship generate run --spec '{"url":"..."}' --platforms '["sdk","cli","mcp"]' --out sdk/   # TypeScript only for cli/mcp
```

`--out` writes the files and prints `{meta, warnings, limits?, out: {written, dir}}`. Without `--out`, the whole response prints (large). If `limits` is present, the spec was capped: report `omitted_operations` and that a key lifts it.

## Projects (keyed)

```bash
typeship projects create --name "Acme API" --spec-url https://api.example.com/openapi.json --languages '["typescript","python"]'
typeship projects generate <project_id>          # regenerate; returns every language's files (large: redirect to a file)
typeship projects list-generations <project_id>
typeship generations get <generation_id>
typeship generations get-file <generation_id> --path src/index.ts
typeship projects update <project_id> --spec-patches '[...]' --config '{...}'
typeship projects delete <project_id> --force    # DELETE needs --force; without it: CONFIRMATION_REQUIRED
```

`typeship projects create --help` lists every field. Repository-sourced projects (`--source '{"kind":"repo",...}'`) regenerate on push, not on demand.

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
