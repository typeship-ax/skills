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

typeship turns a spec into a zero-dependency typed SDK (TypeScript, Python, Go), a CLI, and an MCP server, and keeps them current: a linked project regenerates on every spec change and opens a pull request per language. In a terminal, everything below is the `typeship` CLI (`npm install -g typeship-ax`, or `npx -y typeship-ax@latest ...`; JSON out, agent contract). In a chat client the same operations are tools on typeship's MCP server (skill `typeship-mcp-clients`); the REST API is at `https://typeship.dev/api/v1`.

## Decide

1. **No account, wants a package now** → `typeship generate run --spec '{"url":"..."}' --language <ts|python|go> --out <dir>` (first 25 operations, no key needed). Skill: `typeship-cli`.
2. **Anything beyond a one-off** (more than 25 operations, a project, keys) → `typeship init --all` once per machine. It uses `TYPESHIP_TOKEN` or a stored key when there is one; otherwise it prints a sign-in link (`{"event":"browser_approval","verification_url":...}` on stderr): give the URL to the user, wait, and a key is minted for this machine. Nobody copies a key. Pass `-k` only when the user hands you one; never paste it into a file. Skill: `typeship-cli`.
3. **Keep a package current** → `typeship projects create --name "..." --spec-url ... --languages '[...]'`, then set a destination repository (`typeship projects update <id> --destinations '{...}'`); every spec change becomes a pull request per language. Skill: `typeship-cli`.
4. **The spec will not generate, or generates with warnings** → skill `typeship-spec-prep`.
5. **Connect an agent client to typeship's MCP server (or a generated one)** → skill `typeship-mcp-clients`. A person present: the `/mcp-oauth` door signs them in; headless: `/mcp` with a key.
6. **Pipeline / CI** → skill `typeship-ci`.
7. **No CLI available, REST only** → skill `typeship-api`.

If none of the above fits, read https://typeship.dev/agents.md and `typeship agent-guide --format json`, then `typeship docs search "<topic>"`.

## Always

- `typeship auth check --format json` before keyed work; branch on `status`.
- Errors are one JSON envelope on stderr: `{status, issues: [{code, message}], next_steps}`. Branch on `issues[].code`. `PLAN_LIMIT` and `RATE_LIMITED` are not bugs: do what `next_steps` says, do not retry the same call.
- Never edit generated files; change the spec, a spec patch, or project config and regenerate.
- Finish by telling the user what was generated, where, from which spec, and whether it is linked to a project.
