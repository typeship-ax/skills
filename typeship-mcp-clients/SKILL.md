---
name: typeship-mcp-clients
description: Connect typeship's hosted MCP server (typeship.dev/mcp), or an MCP server typeship generated for an API, to an agent client - Claude Code, Codex, Cursor, VS Code, Windsurf, Gemini CLI, OpenCode, Zed, Claude Desktop, claude.ai. Use when the user wants an agent client wired to typeship or to a generated package's MCP server.
license: MIT
allowed-tools: Bash(typeship *), Bash(claude mcp *), Bash(codex mcp *), Read, Write
---

# Connecting MCP clients

## Choose the server

**typeship's own server** uses Streamable HTTP and supports MCP 2025-11-25 and 2026-07-28. Docs: https://typeship.dev/docs/mcp.md.

| Endpoint | Use |
| --- | --- |
| `https://typeship.dev/mcp` | The default. A person signs in with OAuth, choosing one organization and approving `typeship:read`, `typeship:generate`, and `typeship:write`. Automation sends `Authorization: Bearer ak_...` instead. |
| `https://typeship.dev/mcp/readonly` | The same tools without writes, even when the credential allows them. |
| `https://typeship.dev/mcp/public` | No sign-in. Exactly six tools: `search_docs`, `read_docs`, `query_docs`, `submit_docs_feedback`, `generate_run` (first 25 operations), and `generate_download_package`. |

An invalid credential returns HTTP 401. A missing OAuth capability returns HTTP 403 with a challenge to approve it.

**A generated server** speaks the same protocol and uses the auth of the API it wraps. It runs locally from its `<api>-mcp` npm package, or at a Project's hosted endpoint, `https://typeship.dev/mcp/<slug>`. Docs: https://typeship.dev/docs/guides/mcp-clients.md.

## Install

```bash
typeship mcp install --all     # adds typeship's server to every detected client, including Cursor
npx -y <api>-mcp               # starts a generated server; its README has the client entry
```

`mcp install` prints each file it wrote. Keep each client's default protocol settings.

To configure a client by hand:

- **Claude Code:** `claude mcp add --transport http typeship https://typeship.dev/mcp` signs in. For a key, add `--header 'Authorization: Bearer ${TYPESHIP_TOKEN}'`; the single quotes keep the variable unexpanded.
- **Codex:** `codex mcp add typeship --url https://typeship.dev/mcp && codex mcp login typeship`. For a key, use `--bearer-token-env-var TYPESHIP_TOKEN` instead of `login`.
- **Cursor:** merge `{"mcpServers":{"typeship":{"url":"https://typeship.dev/mcp"}}}` into `.cursor/mcp.json`, then enable the server in Cursor's MCP settings.
- **JSON config clients** (`.mcp.json`, Windsurf, Gemini CLI): `{"mcpServers":{"typeship":{"type":"http","url":"https://typeship.dev/mcp"}}}`. VS Code uses `servers` in `.vscode/mcp.json`, and OpenCode uses `mcp` with `"type":"remote"`. For a key, add `"headers":{"Authorization":"Bearer ${TYPESHIP_TOKEN}"}`.
- **Claude Desktop and claude.ai:** add `https://typeship.dev/mcp` as a custom connector. Claude Desktop's config file launches only local servers; for a generated one, run `<bin> mcp --claude-desktop`.

Never write a literal key into a client config. Reference the environment variable.

## Verify

`typeship doctor` (or `<bin> doctor` for a generated package) reports which clients are detected and configured. In the client, list the tools: `/mcp/public` shows exactly six, and a signed-in connection shows only what the approved capabilities and the member's role allow.

## Save a generated package

`generate_run` returns a `download` link to a ZIP with every generated file.

1. Download `download.url` before `download.expires_at`. On a hosted connection, use the agent's download or terminal tool. With typeship's local MCP server (`@typeship-ax/mcp`), call `execute` with `operation: "generate_download_package"` and the URL's `token`; it saves the ZIP and returns `saved_to`.
2. Check the ZIP against `download.sha256` and extract it into an empty directory.
3. Read the package's README to build and use it.

The ZIP contains files the tool result omits, so do not generate again to get them. Anyone with the URL can download the package, so keep it private.
