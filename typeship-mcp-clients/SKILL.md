---
name: typeship-mcp-clients
description: Connect typeship's hosted MCP server (typeship.dev/mcp), or an MCP server typeship generated for an API, to an agent client - Claude Code, Codex, VS Code, Windsurf, Gemini CLI, OpenCode, Zed, Claude Desktop, claude.ai. Use when the user wants an agent client wired to typeship or to a generated package's MCP server.
license: MIT
allowed-tools: Bash(typeship *), Bash(claude mcp *), Bash(codex mcp *), Read, Write
---

# Connecting MCP clients

Two kinds of server, one procedure.

**typeship's own**, two doors (Streamable HTTP, MCP 2026-07-28): `https://typeship.dev/mcp-oauth` signs the user in from the client (no key; use it when a person can approve a browser sign-in), and `https://typeship.dev/mcp` takes `Authorization: Bearer ak_...` (headless, CI, or a key already in the environment). Without any key `/mcp` still offers `search_docs`, `read_docs`, `query_docs`, `submit_docs_feedback`, `generate_run`. With sign-in or a key: every typeship operation. A user in several organizations picks the one signed-in agents act in under API keys in the console; until then keyed tools answer `organization_required`. Docs: https://typeship.dev/docs/typeship-api/mcp.md.

**A generated one** (`<bin>-mcp` in a package typeship generated, or a project's hosted endpoint `https://typeship.dev/mcp/<slug>`): same protocol; auth is that API's. Docs: https://typeship.dev/docs/guides/mcp-clients.md.

## Fastest

```bash
typeship mcp install --all           # typeship's server into every client on this machine, key as ${TYPESHIP_TOKEN}
<bin> mcp install --all              # a generated CLI does the same for its own server
```

Both print what was written. Cursor is skipped by `--all` until Cursor speaks MCP 2026-07-28 (`--cursor` writes on request).

## By hand

Claude Code: `claude mcp add --transport http typeship https://typeship.dev/mcp-oauth` (signs in), or `claude mcp add --transport http typeship https://typeship.dev/mcp --header 'Authorization: Bearer ${TYPESHIP_TOKEN}'` with a key (single quotes keep the env reference).
Codex: `codex mcp add typeship --url https://typeship.dev/mcp-oauth && codex mcp login typeship`, or `codex mcp add typeship --url https://typeship.dev/mcp --bearer-token-env-var TYPESHIP_TOKEN` with a key.
JSON clients (`.mcp.json`, `.vscode/mcp.json`, Windsurf, Gemini, OpenCode): `{"mcpServers":{"typeship":{"type":"http","url":"https://typeship.dev/mcp-oauth"}}}` to sign in, or the `/mcp` URL with `"headers":{"Authorization":"Bearer ${TYPESHIP_TOKEN}"}` for a key (VS Code uses `servers`, OpenCode uses `mcp` with `type: remote`).
Claude Desktop and claude.ai: add a custom connector with the `/mcp-oauth` URL (the desktop config file only launches stdio servers; use `<bin> mcp --claude-desktop` for a local server).

Never write a literal key into a client config; reference the environment variable.

## Verify

`typeship doctor` (or `<bin> doctor`) reports which clients are detected and configured. In the client, list tools; anonymous typeship connections show exactly five.
