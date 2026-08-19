---
name: typeship
description: Router for typeship. Use when the user mentions typeship, wants an SDK, CLI, or MCP server generated from an OpenAPI or GraphQL spec, wants generated packages kept current with pull requests, or wants an agent connected to typeship's API. Decides which typeship skill applies and runs it.
license: MIT
allowed-tools: Bash(typeship *), Bash(npx typeship *), Bash(curl *), Read, Write
metadata:
  homepage: https://typeship.dev
  runbook: https://typeship.dev/agents.md
---

# typeship

typeship turns a spec into a zero-dependency typed SDK (TypeScript, Python, Go), a CLI, and an MCP server, and keeps them current: a linked project regenerates on every spec change and opens a pull request per language. Everything below is the `typeship` CLI (`npm install -g typeship`, JSON out, agent contract) or the REST API at `https://typeship.dev/api/v1`.

## Decide

1. **No account, wants a package now** → `typeship generate run --spec '{"url":"..."}' --language <ts|python|go> --out <dir>` (first 25 operations, no key needed). Skill: `typeship-cli`.
2. **Has a key** (`TYPESHIP_TOKEN` set or provided) → `typeship init --all -k "$TYPESHIP_TOKEN"` once, then generate or create a project. Skill: `typeship-cli`.
3. **Needs a key** → ask the user to create one at https://typeship.dev/console/keys and export `TYPESHIP_TOKEN`; never paste it into a file. Then 2.
4. **The spec will not generate, or generates with warnings** → skill `typeship-spec-prep`.
5. **Connect an agent client to typeship's MCP server (or a generated one)** → skill `typeship-mcp-clients`.
6. **Pipeline / CI** → skill `typeship-ci`.
7. **No CLI available, REST only** → skill `typeship-api`.

If none of the above fits, read https://typeship.dev/agents.md and `typeship agent-guide --format json`, then `typeship docs search "<topic>"`.

## Always

- `typeship auth check --format json` before keyed work; branch on `status`.
- Errors are one JSON envelope on stderr: `{status, issues: [{code, message}], next_steps}`. Branch on `issues[].code`. `PLAN_LIMIT` and `RATE_LIMITED` are not bugs: do what `next_steps` says, do not retry the same call.
- Never edit generated files; change the spec, a spec patch, or project config and regenerate.
- Finish by telling the user what was generated, where, from which spec, and whether it is linked to a project.
