---
name: typeship-cli
description: Drive typeship from the terminal with the typeship CLI. Use to generate a Target from a Definition, create and configure Projects, trigger Generations, read Diagnostics and Definition Revisions, manage API keys, and interpret the CLI's JSON error envelope. Prefer this over the MCP server in terminals.
license: MIT
allowed-tools: Bash(typeship *), Bash(npx typeship *), Read, Write
---

# typeship CLI

`npm install -g @typeship-ax/cli` (or `npx -y @typeship-ax/cli@latest ...`). JSON on stdout, one JSON envelope on stderr for errors, exit 0/1/2. Full contract: `typeship agent-guide --format json`; command surface as data: `typeship help --json`. Reference: `references/commands.md`, `references/agent-contract.md`.

## First

```bash
typeship auth check --format json     # {status: ok|action_required, source, next_steps}
# Only if authenticated work needs a credential:
typeship login --no-browser           # give the approval link to the user
```

Use an existing `TYPESHIP_TOKEN` or stored credential directly. Anonymous generation does not need login. `typeship init --all` also installs skills, configures every detected MCP client, and writes repository agent instructions; reserve it for an explicit request to set up those tools.

## Generate

Anonymous works (first 25 operations, 20/min per address; Definition contents and generated files are not retained). URL runs keep a seven-day claim recipe and return its link. With a key the plan's limits apply.

```bash
typeship generate run --definition '{"url":"https://api.example.com/openapi.json"}' --target '{"generator":"typescript-sdk"}' --out generated/
typeship generate run --definition "{\"inline\":$(jq -Rs . < openapi.yaml)}" --target '{"generator":"python-sdk"}' --out generated/
typeship generate run --definition '{"url":"https://api.example.com/openapi.json"}' --target '{"generator":"cli"}' --out generated-cli/
typeship generate run --definition '{"url":"https://api.example.com/openapi.json"}' --target '{"generator":"mcp"}' --out generated-mcp/
```

Each stateless run accepts exactly one Target and writes one focused package. Use a linked Project when several independently delivered Targets should stay current together. `--out` writes the files and prints `{meta, warnings, limits?, out: {written, dir}}`. Without `--out`, the whole response prints (large). If `limits` is present, read `generated_operations`, `total_operations`, `omitted_operations`, and `reason`. When anything was omitted, report “generated N of M operations”; a linked Project retains the complete Definition even though its Free Generation is partial. For `reason: "anonymous"`, offer authentication at `signup_url` without promising that a free account lifts the cap. For `reason: "free_plan"`, a key is already present: send the user to `upgrade_url`, not back to login or key setup.

## Projects (keyed)

Free includes one stored Project and every selected Target. The complete Definition and its revisions are retained, and API change review plus Diagnostics cover the full contract; each generated Target includes the first 25 operations. That Project still gets on-demand and automatic Generation, history, destination pull requests, and preview checks without a run quota. Stateless `generate run` never consumes the Project slot. Pro generates the remaining operations from the same linked Definition and adds Projects; each selected Target is a billing unit on Pro.

Before creating resources, run `typeship projects list --all`, retrieve a candidate Project and its Definition, and run `typeship targets list <project_id> --all`. Match the source URL or repository and entrypoint. Reuse matching Projects and Targets; add only missing requested outputs. Retrieve current config and Deliveries before replacing them.

```bash
typeship projects create --name "Acme API" --definition '{"source":{"kind":"url","url":"https://api.example.com/openapi.json"}}' --targets '[{"name":"Acme CLI","generator":"cli"}]'
typeship projects generate <project_id>          # one Generation per active Target (large: redirect to a file)
typeship projects list-generations <project_id>
typeship generations retrieve <generation_id>
typeship generations retrieve-file <generation_id> --path src/index.ts
typeship definitions retrieve <definition_id>
typeship definitions update <definition_id> --patches '[...]' --diagnostic-policy '{...}'
typeship definition-revisions list <definition_id>
typeship definition-revisions retrieve-content <definition_revision_id>
typeship targets list <project_id>
typeship targets create <project_id> --name "Acme Internal SDK" --definition-id <definition_id> --generator typescript-sdk
typeship targets update <target_id> --deliveries '[{"kind":"repository","repository":{"provider":"github","identifier":"acme/internal-typescript"}}]'
typeship targets list-releases <target_id>
typeship projects retrieve-diagnostics <project_id>
typeship projects refresh-diagnostics <project_id>
typeship projects delete <project_id> --force    # DELETE needs --force; without it: CONFIRMATION_REQUIRED
```

Automatic generation starts disabled. After reviewing the first Generation and destination pull request, enable it with `typeship projects update <project_id> --auto-generate true`.

`projects generate` opens a pull request only when the complete generated tree differs from the destination. An already-current destination returns `meta.pr_status: "no_changes"` without creating a commit or branch.

`typeship projects create --help` lists every field. GitHub-sourced Projects (`--definition '{"source":{"kind":"repository","repository":{"provider":"github","identifier":"acme/api"},"path":"openapi.yaml"}}'`) regenerate when any document in the resolved Definition graph changes and can also be forced on demand with `typeship projects generate`.

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
