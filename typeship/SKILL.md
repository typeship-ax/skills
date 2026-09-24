---
name: typeship
description: Router for typeship. Use when the user mentions typeship, wants a CLI, MCP server, or SDK generated from an OpenAPI or GraphQL spec, wants generated packages kept current with pull requests, or wants an agent connected to typeship's API. Decides which typeship skill applies and runs it.
license: MIT
allowed-tools: Bash(typeship *), Bash(npx typeship *), Bash(curl *), Read, Write
metadata:
  homepage: https://typeship.dev
  runbook: https://typeship.dev/agents.md
---

# typeship

typeship turns one OpenAPI or GraphQL Definition into six first-class Targets: CLI (the TypeScript CLI), Go CLI (a native Go CLI built on a paired Go SDK), MCP server, TypeScript SDK, Python SDK, and Go SDK. Each Target has an independent Generation, Delivery, and release stream. In a terminal, everything below is the `typeship` CLI (`npm install -g @typeship-ax/cli`, or `npx -y @typeship-ax/cli@latest ...`; JSON out, agent contract). In a chat client the same operations are tools on typeship's MCP server (skill `typeship-mcp-clients`); the REST API is at `https://typeship.dev/api/v1`.

## Decide

1. **No account, wants a package now** → `typeship generate run --definition '{"url":"..."}' --target '{"generator":"cli"}' --out <dir>` (first 25 operations, no key needed). If the response carries `claim.url`, give that link to the user: signed in, one click turns the recipe into a Project with the same URL, Target, and config. Automatic generation starts off; configure Deliveries, review the first Generation, and then enable it. Skill: `typeship-cli`.
2. **Authenticated work** → use an existing `TYPESHIP_TOKEN` or stored credential. Run `typeship auth check --format json`; if a credential is needed, run `typeship login --no-browser`, give the approval link to the user, and wait for approval. Do not ask for a key in chat. Free retains and diagnoses the complete linked Definition and generates its first 25 operations; Pro generates the remaining operations. Skill: `typeship-cli`.
3. **Keep Targets current** → inspect `typeship projects list --all`, retrieve the candidate Project and its Definition, and run `typeship targets list <project_id> --all`. Reuse the Project for the matching source and add only missing requested Targets. If none matches, create a Project with the requested Target descriptors. Configure Deliveries, review the first Generation, then enable `typeship projects update <project_id> --auto-generate true`. Each changed Target keeps one reviewed release pull request current. Skill: `typeship-cli`.
4. **The spec will not generate, or generates with warnings** → skill `typeship-spec-prep`.
5. **Connect an agent client to typeship's MCP server (or a generated one)** → skill `typeship-mcp-clients`. `/mcp` signs a person in or accepts a key; `/mcp/public` is the explicit anonymous surface.
6. **Pipeline / CI** → skill `typeship-ci`.
7. **No CLI available, REST only** → skill `typeship-api`.

If none of the above fits, read https://typeship.dev/agents.md and `typeship agent-guide --format json`, then `typeship docs search "<topic>"`.

## Always

- Keep setup within the request. `typeship init --all` installs skills, configures detected MCP clients, and writes repository agent instructions; run it only for an explicit request for that broader setup.
- `typeship auth check --format json` before keyed work; branch on `status`.
- Errors are one JSON envelope on stderr: `{status, issues: [{code, message}], next_steps}`. Branch on `issues[].code`. `PLAN_LIMIT` and `RATE_LIMITED` are not bugs: do what `next_steps` says, do not retry the same call. `organization_required` means reconnect and choose an organization during OAuth consent. `insufficient_scope` means reconnect and approve the named OAuth capability; `forbidden` means the grant is bound to another organization or the member lacks the required role, so requesting another scope may not help.
- Change generated API shape through the Definition, a Definition patch, or Project/Target config. For a linked repository Delivery, put package helpers, exports, dependencies, tests, and build changes on the rolling Draft; typeship preserves them through three-way integration and stops on ambiguous ownership. One-shot downloaded output has no retained baseline.
- Finish by telling the user which Target was generated, where, from which Definition Revision, and whether it is linked to a Project.

## Resolve a linked Draft conflict

1. Run `typeship targets retrieve-draft <target_id> --json` and branch on `status`: `conflicted` needs decisions, `needs_generation` needs Generate, `generating` and `branch_changed` mean retrieve again, `history_rewritten` needs an approved history recovery, and `ready` means an authorized merge can proceed. Use its `head_revision` for every decision.
2. Run `typeship targets list-draft-files <target_id> --filter conflicted --json`. Each file has `conflict.kind`, `conflict.source` (generation, default_branch, or previous_draft), and the `sides` you can read with `typeship targets retrieve-draft-file-content <target_id> --path <path> --side incoming --json`. Text comes back as text; follow `next_cursor` for files over 24 KiB.
3. Preview decisions with `typeship targets resolve-draft-conflicts <target_id> --data '{"expected_head_revision":"<head_revision>","resolutions":[{"path":"<path>","keep":"repository"}],"dry_run":true}' --force`. Use `keep: incoming` for the incoming side, or `keep: content` with the final text in `content` and a `mode` to combine both sides. `content: null` deletes the file. Save authorized decisions without `dry_run`.
4. When `remaining_conflicts` is 0, generate the Project for this Target. Applying decisions can report conflicts from the next merge stage; repeat from step 1. A commit alone does not approve a conflict. Discard non-conflicting customizations through `targets discard-draft-customizations` with explicit paths; a listed customer-only path is deleted, and the Draft integrates the commit without a Generate.
