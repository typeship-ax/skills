---
name: typeship-cli
description: Drive typeship from the terminal with the typeship CLI. Use to generate a package from a spec, create and configure Projects and Targets, run Generations, resolve Draft conflicts, read Diagnostics and Spec Revisions, and interpret the CLI's JSON error envelope. Prefer this over the MCP server in a terminal.
license: MIT
allowed-tools: Bash(typeship *), Bash(npx -y @typeship-ax/cli@latest *), Read, Write
---

# typeship CLI

Install with `npm install -g @typeship-ax/cli`, or run `npx -y @typeship-ax/cli@latest <command>` without installing.

- Results are JSON on stdout. Errors are one JSON envelope on stderr.
- Exit codes: 0 success, 1 the request failed, 2 a usage error or a required confirmation.
- `typeship <resource> <command> --help` shows every flag. `references/commands.md` lists every command, and `references/agent-contract.md` summarizes the agent contract.

## Start

```bash
typeship auth check --format json     # {status: ok | action_required, source, next_steps}
typeship login --no-browser           # only when organization work needs a credential; give the link to the user
```

An existing `TYPESHIP_TOKEN` or stored login works without `login`. Anonymous generation needs neither.

## Generate one package

```bash
typeship packages generate \
  --spec '{"url":"https://typeship.dev/examples/petstore/openapi.yaml"}' \
  --target '{"type":"cli"}' \
  --out petstore-cli/
```

- `--target` types: `cli`, `go_cli`, `mcp`, `typescript_sdk`, `python_sdk`, `go_sdk`. Each run produces one package.
- For a local file, pass the text inline: `--spec "{\"inline\":$(jq -Rs . < openapi.yaml)}"`.
- `--out` writes the files and prints `{meta, warnings, limits?, out: {written, dir}}`. Without `--out`, the full response prints, which can be large.
- Anonymous runs allow 20 requests a minute per network address.

When the result includes `limits`, `omitted_operations` lists the operations that were not generated. Report "generated N of M operations" using `generated_operations` and `total_operations`, then act on `reason`:

- `reason: "anonymous"`: offer sign-up at `signup_url`. Do not promise that a Free plan generates every operation.
- `reason: "free_plan"`: the user is already signed in. Send them to `upgrade_url`, not back to login.

An anonymous run from a URL may include `claim.url`, which lets a signed-in user save the run as a Project within seven days.

## Projects and Targets

A Project holds one Spec and its Targets. Each Target generates one package and can deliver it to a repository as a pull request. Plans limit Projects and generated operations; see https://typeship.dev/docs/reference/limits.md.

Reuse before creating. Run `typeship projects list --all`, retrieve any Project whose Spec has the same source URL or repository path, and run `typeship targets list --project-id <project_id> --all`. Add only the Targets that are missing.

```bash
typeship projects create --name "Petstore" \
  --spec '{"source":{"type":"url","url":{"url":"https://typeship.dev/examples/petstore/openapi.yaml"}}}' \
  --targets '[{"name":"Petstore CLI","type":"cli"}]'
typeship targets create --project-id <project_id> --name "Petstore SDK" --type typescript_sdk
typeship deliveries create --data '{"target_id":"<target_id>","type":"repository","repository":{"provider":"github","identifier":"<owner>/<repo>"}}'
typeship generations list --project-id <project_id>  # review the automatically started Generations
```

- For a spec in GitHub, use `{"source":{"type":"repository","repository":{"provider":"github","identifier":"<owner>/<repo>","path":"openapi.yaml"}}}`. The Project regenerates when any file in the spec changes.
- New Projects start automatic generation by default. Review the first Generation and its pull request; pass `--auto-generate false` when creating a Project if you need manual generation.
- `projects generate` opens a pull request only when the generated package differs from the repository. Otherwise the Generation reports `pr_status: no_changes`.
- Retrieve a resource before changing it. Updates replace whole objects and arrays, such as `config` or a Delivery's `repository`, so merge your change into the current value. Change a Target's Deliveries with `typeship deliveries create`, `update`, and `delete`.

Reading results and history:

```bash
typeship generations list --project-id <project_id>
typeship generations get <generation_id>
typeship generations list-files <generation_id>
typeship files get <file_id>
typeship releases list --target-id <target_id>
typeship specs get <spec_id>
typeship spec-revisions list <spec_id>
typeship spec-revisions list-files <spec_revision_id>
```

Deleting needs `--force`. Confirm with the user first: `typeship projects delete <project_id> --force`.

## Resolve a Draft conflict

A Target delivered to a repository keeps one Draft pull request. When a new Generation, the default branch, or an earlier Draft changes a file the user also changed, the Draft stops at a conflict until someone decides.

1. Read the Target's `draft_id` with `typeship targets get <target_id>`, run `typeship drafts get <draft_id>`, and act on `status`:

   | `status` | Next step |
   | --- | --- |
   | `action_required` with `reason: conflict` | Continue with step 2. |
   | `action_required` with another `reason` | `history_rewritten`: ask the user to approve history recovery. `checks_failed`, `review_failed`, `checks_unavailable`: follow each entry in the Draft's `errors`, then fix the package, check, title, or version. |
   | `idle` | Run `typeship projects generate <project_id>`. |
   | `working` | Retrieve the Draft again. |
   | `ready` | The pull request can be merged, with the user's approval. |
   | `merged` | The Draft is final; retrieve the Target for its next `draft_id`. |

   Note `head_sha`. Every decision applies to that revision.
2. Run `typeship drafts list-files <draft_id> --filter conflicted`. Each file lists `conflict.kind`, `conflict.source`, and `sides`, the file IDs of its base, yours, and generated versions. Read one with `typeship files get <file_id>`. Files over 24 KiB arrive in chunks; pass `next_cursor` to continue.
3. Once the user approves the decisions, save them:

   ```bash
   typeship drafts resolve <draft_id> \
     --expected-head-sha <head_sha> \
     --resolutions '[{"path":"<path>","keep":"yours"}]'
   ```

   `keep` is `yours`, `generated`, or `content`. With `content`, send the merged text in `content` and the file `mode`. `content: null` deletes the file.
4. The command returns the Draft. When `conflicts.decided` equals `conflicts.total`, Typeship continues the Draft automatically. The next merge stage can report new conflicts, so start again at step 1.

Committing to the Draft does not resolve a conflict. To drop customizations that do not conflict, include those paths in `typeship drafts resolve <draft_id>` with `keep: "generated"`. A listed file that exists only in the Draft is deleted.

## Error codes

```json
{"status":"action_required","issues":[{"code":"NO_AUTH","message":"..."}],"next_steps":["..."]}
```

| `code` | Do |
| --- | --- |
| `NO_AUTH` | Set `TYPESHIP_TOKEN` or run `typeship login --no-browser`. Anonymous `packages generate` still works. |
| `AUTH_INVALID` | The key is wrong or revoked. Ask the user for a new one. |
| `PLAN_LIMIT` | The plan does not allow this. `next_steps` has the upgrade link. Do not retry. |
| `RATE_LIMITED` | Wait the number of seconds named, then retry once. |
| `SPEC_INVALID` | The spec cannot be used. Switch to `typeship-spec-prep`. |
| `CONFIRMATION_REQUIRED` | The command needs `--force`. Confirm with the user first. |
| `NETWORK_ERROR` | Check the network and base URL, then retry once. |

## Documentation

`typeship docs search "<term>"` searches the docs. `typeship docs read <page>` prints a page, and `typeship docs <resource> <command>` prints one command's reference.
