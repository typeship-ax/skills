---
name: typeship
description: Router for typeship. Use when the user mentions typeship, wants a CLI, MCP server, or SDK generated from an OpenAPI or GraphQL spec, wants generated packages kept current with pull requests, or wants an agent connected to typeship's API. Decides which typeship skill applies and runs it.
license: MIT
allowed-tools: Bash(typeship *), Bash(npx -y @typeship-ax/cli@latest *), Bash(curl *), Read, Write
metadata:
  homepage: https://typeship.dev
  runbook: https://typeship.dev/agents.md
---

# typeship

typeship generates packages from an OpenAPI or GraphQL spec, which it calls a Spec. Each package type is a Target: CLI, Go CLI, MCP server, TypeScript SDK, Python SDK, or Go SDK. A Project links a Spec to its Targets and keeps them current by opening pull requests in each Target's repository.

Run typeship through the `typeship` CLI: `npm install -g @typeship-ax/cli`, or `npx -y @typeship-ax/cli@latest <command>` without installing. In a chat client without a terminal, use typeship's MCP server instead.

## Decide

1. **Generate a package now, without an organization.** Run `typeship packages generate --spec '{"url":"<spec-url>"}' --target '{"type":"cli"}' --out <dir>`. Anonymous runs generate the first 25 operations. If the result includes `claim.url`, give that link to the user: once signed in, they can save the run as a Project with the same spec, Target, and config. Continue with `typeship-cli`.
2. **Work that needs an organization.** Run `typeship auth check --format json` and branch on `status`. An existing `TYPESHIP_TOKEN` or stored login is enough. If a credential is needed, run `typeship login --no-browser`, give the approval link to the user, and wait. Never ask for a key in chat. Continue with `typeship-cli`.
3. **Keep generated packages current.** Continue with `typeship-cli` to find or create the Project and connect each Target to a repository. New Projects start automatic generation by default.
4. **Resolve a conflict in a Target's Draft pull request.** Follow "Resolve a Draft conflict" in `typeship-cli`.
5. **The spec fails to generate, produces warnings, or produces poor names.** Use `typeship-spec-prep`.
6. **Connect an agent client to typeship's MCP server or a generated one.** Use `typeship-mcp-clients`.
7. **Run typeship in CI.** Use `typeship-ci`.
8. **No CLI can be installed.** Use `typeship-api`.

If none of these fits, read https://typeship.dev/agents.md, run `typeship agent-guide --format json`, or search with `typeship docs search "<topic>"`.

## Always

- Stay within the request. `typeship init --all` installs skills, configures every detected MCP client, and writes repository agent instructions. Run it only on an explicit request for that setup.
- Errors arrive as one JSON envelope on stderr: `{status, issues: [{code, message}], next_steps}`. Branch on `issues[].code`, not the message.
  - `PLAN_LIMIT` and `RATE_LIMITED`: follow `next_steps`. Do not retry the same call.
  - `organization_required`: reconnect and choose an organization during sign-in.
  - `insufficient_scope`: reconnect and approve the capability the error names.
  - `role_insufficient`: the sign-in belongs to another organization or the member's role does not allow the action. Requesting another scope will not help.
- Change the generated API through the Spec, a Spec patch, or Project and Target config, not by editing generated files. For a Target delivered to a repository, commit hand-written helpers, tests, and build changes to its Draft pull request. typeship carries them forward on every generation. Packages from `packages generate` are not tracked, so later runs will not preserve edits.
- Plans limit how many operations are generated. When `limits` appears in a result, report "generated N of M operations" and link the user to the URL in the result. Current plans: https://typeship.dev/docs/reference/limits.md.
- Finish by telling the user which Target was generated, where it was written or delivered, and whether it belongs to a Project.
