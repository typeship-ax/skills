---
name: typeship-cli
description: Drive typeship from the terminal with the typeship CLI. Use to generate a package from a spec (with or without an account), create and configure projects, trigger regeneration, read generations and specification revisions, manage API keys, and interpret the CLI's JSON error envelope. Prefer this over the MCP server in terminals.
license: MIT
allowed-tools: Bash(typeship *), Bash(npx typeship *), Read, Write
---

# typeship CLI

`npm install -g @typeship-ax/cli` (or `npx -y @typeship-ax/cli@latest ...`). JSON on stdout, one JSON envelope on stderr for errors, exit 0/1/2. Full contract: `typeship agent-guide --format json`; command surface as data: `typeship help --json`. Reference: `references/commands.md`, `references/agent-contract.md`.

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
typeship generate run --spec '{"url":"https://api.example.com/openapi.json"}' --outputs '["cli"]' --out generated-cli/
typeship generate run --spec '{"url":"https://api.example.com/openapi.json"}' --outputs '["mcp"]' --out generated-mcp/
```

Each stateless run accepts exactly one output and writes one focused package. Use a linked project when several independently delivered outputs should stay current together. `--out` writes the files and prints `{meta, warnings, limits?, out: {written, dir}}`. Without `--out`, the whole response prints (large). If `limits` is present, read `generated_operations`, `total_operations`, `omitted_operations`, and `reason`. When anything was omitted, report “generated N of M operations”; a linked project retains the complete specification even though its Free output is partial. For `reason: "anonymous"`, offer authentication at `signup_url` without promising that a free account lifts the cap. For `reason: "free_plan"`, a key is already present: send the user to `upgrade_url`, not back to login or key setup.

## Projects (keyed)

Free includes one stored project and every selected output. The complete specification and its revisions are retained and API change review covers the full contract; generated packages include the first 25 operations. That project still gets on-demand and automatic regeneration, history, destination pull requests, and preview checks without a run quota. Stateless `generate run` never consumes the project slot. Pro generates the remaining operations from the same linked source and adds projects; each selected output is a billing unit on Pro.

```bash
typeship projects create --name "Acme API" --source '{"kind":"url","url":"https://api.example.com/openapi.json"}' --outputs '["typescript-sdk","python-sdk","cli","mcp"]'
typeship projects generate <project_id>          # regenerate; returns every delivery package's files (large: redirect to a file)
typeship projects list-generations <project_id>
typeship generations retrieve <generation_id>
typeship generations retrieve-file <generation_id> --path src/index.ts
typeship spec-revisions list <project_id>
typeship spec-revisions retrieve-content <spec_revision_id>
typeship projects update <project_id> --spec-patches '[...]' --config '{...}'
typeship projects delete <project_id> --force    # DELETE needs --force; without it: CONFIRMATION_REQUIRED
```

`projects generate` opens a pull request only when the complete generated tree differs from the destination. An already-current destination returns `meta.pr_status: "no_changes"` without creating a commit or branch.

`typeship projects create --help` lists every field. GitHub-sourced projects (`--source '{"kind":"github","repository":"acme/api","path":"openapi.yaml"}'`) regenerate on pushes that change the spec and can also be forced on demand with `typeship projects generate`.

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
