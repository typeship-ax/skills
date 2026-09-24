---
name: typeship-mcp-clients
description: Connect typeship's hosted MCP server (typeship.dev/mcp), or an MCP server typeship generated for an API, to an agent client - Claude Code, Codex, Cursor, VS Code, Windsurf, Gemini CLI, OpenCode, Zed, Claude Desktop, claude.ai. Use when the user wants an agent client wired to typeship or to a generated package's MCP server.
license: MIT
allowed-tools: Bash(typeship *), Bash(claude mcp *), Bash(codex mcp *), Read, Write
---

# Connecting MCP clients

Two kinds of server, one procedure.

**typeship's own** (Streamable HTTP, MCP 2025-11-25 and 2026-07-28): `https://typeship.dev/mcp` is the one secured endpoint. With no header it starts OAuth; the consent screen binds the grant to one organization and asks for `typeship:read`, `typeship:generate`, and `typeship:write`. The same URL accepts `Authorization: Bearer ak_...` for headless automation. Use `https://typeship.dev/mcp/public` for exactly six anonymous tools: `search_docs`, `read_docs`, `query_docs`, `submit_docs_feedback`, `generate_run` (the first 25 operations), and `generate_download_package`. Use `/mcp/readonly` for a connection that cannot mutate even when its credential could. Invalid credentials fail with HTTP 401; missing OAuth capabilities fail with an HTTP 403 step-up challenge. Docs: https://typeship.dev/docs/mcp.md.

**A generated one** (its focused `<api>-mcp` npm package, or a project's hosted endpoint `https://typeship.dev/mcp/<slug>`): same protocol; auth is that API's. Docs: https://typeship.dev/docs/guides/mcp-clients.md.

## Fastest

```bash
typeship mcp install --all           # typeship's hosted server into every client, key as ${TYPESHIP_TOKEN}
npx -y <api>-mcp                     # start a generated local server; copy its README entry into the client
```

`mcp install` prints what was written and includes detected Cursor clients. Use default client protocol settings; no protocol environment variables are required.

## By hand

Claude Code: `claude mcp add --transport http typeship https://typeship.dev/mcp` (signs in), or add `--header 'Authorization: Bearer ${TYPESHIP_TOKEN}'` with a key (single quotes keep the env reference).
Cursor: merge `{ "mcpServers": { "typeship": { "url": "https://typeship.dev/mcp" } } }` into `.cursor/mcp.json`, then enable it in Cursor’s MCP settings.
Codex: `codex mcp add typeship --url https://typeship.dev/mcp && codex mcp login typeship`, or add `--bearer-token-env-var TYPESHIP_TOKEN` with a key.
JSON clients (`.mcp.json`, `.vscode/mcp.json`, Windsurf, Gemini, OpenCode): `{"mcpServers":{"typeship":{"type":"http","url":"https://typeship.dev/mcp"}}}` to sign in, or add `"headers":{"Authorization":"Bearer ${TYPESHIP_TOKEN}"}` for a key (VS Code uses `servers`, OpenCode uses `mcp` with `type: remote`).
Claude Desktop and claude.ai: add the `/mcp` URL as a custom connector (the desktop config file only launches stdio servers; use `<bin> mcp --claude-desktop` for a local server).

Never write a literal key into a client config; reference the environment variable.

## Verify

`typeship doctor` (or `<bin> doctor`) reports which clients are detected and configured. In the client, list tools; `/mcp/public` shows exactly six, while OAuth discovery shows only the operations consent and role permit.

After `generate_run`, download `download.url` before `download.expires_at`, verify `download.sha256`, and extract the ZIP into an empty directory. It contains every file from that exact generation; do not repeat generation to retrieve omitted files. Keep the URL private because anyone with it can download the package. With the focused local MCP, `execute` with `operation: "generate_download_package"` and the URL's `token` saves the ZIP and returns `saved_to`. On a hosted connection, save the URL using the agent's download or terminal tool. Read the extracted package's README to build and use it.
