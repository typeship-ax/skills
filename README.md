# typeship skills

Agent Skills (agentskills.io) for using typeship: generate a typed SDK, CLI, or MCP server from an OpenAPI or GraphQL spec, keep it current with pull requests, and drive typeship's own API from a coding agent. Each skill wraps the `typeship` CLI (`npm install -g typeship-ax`), which prints JSON and speaks the agent contract (`typeship agent-guide`).

Install into every agent on your machine:

```bash
npx skills add typeship-ax/skills
```

Or per harness:

- Claude Code: `/plugin marketplace add typeship-ax/skills` then `/plugin install typeship@typeship-skills`
- Codex: `codex plugin marketplace add typeship-ax/skills`
- Cursor: `/add-plugin typeship`
- Any harness: `typeship init --all` installs these skills and writes the MCP config in one go

| Skill | Use when |
| --- | --- |
| `typeship` | Router. Anything typeship: decides which of the others applies and runs it. |
| `typeship-cli` | Driving typeship from the terminal: generate, projects, generations, keys, the error envelope. |
| `typeship-api` | Calling typeship's REST API directly (no CLI): curl templates for every operation, auth, pagination, errors. |
| `typeship-spec-prep` | Making an OpenAPI or GraphQL spec generate well: operationIds, summaries, tags, servers, security, pagination, the generator's warnings. |
| `typeship-mcp-clients` | Connecting typeship's MCP server, or a generated one, to Claude Code, Codex, VS Code, and the rest. |
| `typeship-ci` | Regenerating in a pipeline and committing packages. |

Docs: https://typeship.dev/llms.txt. The runbook an agent reads first: https://typeship.dev/agents.md.

This repository is published from the `skills/` directory of the typeship monorepo on every change; edit them there, not here. Feedback: hello@typeship.dev.
