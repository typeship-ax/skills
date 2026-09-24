---
name: typeship-cli
description: Drive typeship from the terminal with the typeship CLI. Use to generate a package from a spec, create and configure Projects and Targets, run Generations, resolve Draft conflicts, read Diagnostics and Definition Revisions, and interpret the CLI's JSON error envelope. Prefer this over the MCP server in a terminal.
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
typeship login --no-browser           # only when account work needs a credential; give the link to the user
```

An existing `TYPESHIP_TOKEN` or stored login works without `login`. Anonymous generation needs neither.

## Generate one package

```bash
typeship generate run \
  --definition '{"url":"https://typeship.dev/examples/petstore/openapi.yaml"}' \
  --target '{"generator":"cli"}' \
  --out petstore-cli/
```

- `--target` generators: `cli`, `go-cli`, `mcp`, `typescript-sdk`, `python-sdk`, `go-sdk`. Each run produces one package.
- For a local file, pass the text inline: `--definition "{\"inline\":$(jq -Rs . < openapi.yaml)}"`.
- `--out` writes the files and prints `{meta, warnings, limits?, out: {written, dir}}`. Without `--out`, the full response prints, which can be large.
- Anonymous runs allow 20 requests a minute per network address.

When the result includes `limits`, `omitted_operations` lists the operations that were not generated. Report "generated N of M operations" using `generated_operations` and `total_operations`, then act on `reason`:

- `reason: "anonymous"`: offer sign-up at `signup_url`. Do not promise that a free account generates every operation.
- `reason: "free_plan"`: the user is already signed in. Send them to `upgrade_url`, not back to login.

An anonymous run from a URL may include `claim.url`, which lets a signed-in user save the run as a Project within seven days.

## Projects and Targets

A Project holds one Definition and its Targets. Each Target generates one package and can deliver it to a repository as a pull request. Plans limit Projects and generated operations; see https://typeship.dev/docs/reference/limits.md.

Reuse before creating. Run `typeship projects list --all`, retrieve any Project whose Definition has the same source URL or repository path, and run `typeship targets list <project_id> --all`. Add only the Targets that are missing.

```bash
typeship projects create --name "Petstore" \
  --definition '{"source":{"kind":"url","url":"https://typeship.dev/examples/petstore/openapi.yaml"}}' \
  --targets '[{"name":"Petstore CLI","generator":"cli"}]'
typeship targets create <project_id> --name "Petstore SDK" --definition-id <definition_id> --generator typescript-sdk
typeship targets update <target_id> --deliveries '[{"kind":"repository","repository":{"provider":"github","identifier":"<owner>/<repo>"}}]'
typeship projects generate <project_id>          # waits for every Target; redirect large output to a file
typeship projects update <project_id> --auto-generate true
```

- For a spec in GitHub, use `{"source":{"kind":"repository","repository":{"provider":"github","identifier":"<owner>/<repo>"},"path":"openapi.yaml"}}`. The Project regenerates when any file in the spec changes.
- Automatic generation starts off. Turn it on after the user reviews the first Generation and its pull request.
- `projects generate` opens a pull request only when the generated package differs from the repository. Otherwise the Generation reports `pr_status: no_changes`.
- Retrieve a resource before changing it. Updates replace whole objects and arrays, such as `deliveries` or `config`, so merge your change into the current value.

Reading results and history:

```bash
typeship projects list-generations <project_id>
typeship generations retrieve <generation_id>
typeship generations retrieve-file <generation_id> --path src/index.ts
typeship targets list-releases <target_id>
typeship definitions retrieve <definition_id>
typeship definition-revisions list <definition_id>
typeship definition-revisions retrieve-content <definition_revision_id>
```

Deleting needs `--force`. Confirm with the user first: `typeship projects delete <project_id> --force`.

## Resolve a Draft conflict

A Target delivered to a repository keeps one Draft pull request. When a new Generation, the default branch, or an earlier Draft changes a file the user also changed, the Draft stops at a conflict until someone decides.

1. Run `typeship targets retrieve-draft <target_id>` and act on `status`:

   | `status` | Next step |
   | --- | --- |
   | `conflicted` | Continue with step 2. |
   | `needs_generation` | Run `typeship projects generate <project_id>`. |
   | `generating`, `branch_changed`, `checking` | Retrieve the Draft again. |
   | `history_rewritten` | Ask the user to approve history recovery. |
   | `failed` | Inspect the checks, fix the package, and push to the Draft. |
   | `ready` | The pull request can be merged, with the user's approval. |

   Note `head_revision`. Every decision applies to that revision.
2. Run `typeship targets list-draft-files <target_id> --filter conflicted`. Each file lists `conflict.kind`, `conflict.source`, and the available `sides`. Read a side with `typeship targets retrieve-draft-file-content <target_id> --path <path> --side incoming`. Files over 24 KiB arrive in chunks; pass `next_cursor` to continue.
3. Preview the decisions, then save them without `dry_run` once the user approves:

   ```bash
   typeship targets resolve-draft-conflicts <target_id> --force \
     --data '{"expected_head_revision":"<head_revision>","dry_run":true,"resolutions":[{"path":"<path>","keep":"repository"}]}'
   ```

   `keep` is `repository`, `incoming`, or `content`. With `content`, send the merged text in `content` and the file `mode`. `content: null` deletes the file.
4. When `remaining_conflicts` is 0, run `typeship projects generate <project_id>`. Saved decisions apply only then. The next merge stage can report new conflicts, so start again at step 1.

Committing to the Draft does not resolve a conflict. To drop customizations that do not conflict, run `typeship targets discard-draft-customizations <target_id>` with explicit paths. A listed file that exists only in the Draft is deleted.

## Error codes

```json
{"status":"action_required","issues":[{"code":"NO_AUTH","message":"..."}],"next_steps":["..."]}
```

| `code` | Do |
| --- | --- |
| `NO_AUTH` | Set `TYPESHIP_TOKEN` or run `typeship login --no-browser`. Anonymous `generate run` still works. |
| `AUTH_INVALID` | The key is wrong or revoked. Ask the user for a new one. |
| `PLAN_LIMIT` | The plan does not allow this. `next_steps` has the upgrade link. Do not retry. |
| `RATE_LIMITED` | Wait the number of seconds named, then retry once. |
| `SPEC_INVALID` | The spec cannot be used. Switch to `typeship-spec-prep`. |
| `CONFIRMATION_REQUIRED` | The command needs `--force`. Confirm with the user first. |
| `NETWORK_ERROR` | Check the network and base URL, then retry once. |

## Documentation

`typeship docs search "<term>"` searches the docs. `typeship docs read <page>` prints a page, and `typeship docs <resource> <command>` prints one command's reference.
