# typeship skills

Agent skills that teach Claude Code, Codex, and other coding agents to use typeship. With them, an agent can generate a CLI, MCP server, or SDK from an OpenAPI or GraphQL spec, keep the packages current through pull requests, and operate typeship from the terminal or its API.

## Install

Into every agent on your machine:

```bash
npx skills add typeship-ax/skills
```

As a plugin, which also connects typeship's MCP server and signs you in on first use:

- Claude Code: `/plugin marketplace add typeship-ax/skills`, then `/plugin install typeship@typeship-skills`
- Codex: `codex plugin marketplace add typeship-ax/skills`, then run `/plugins` and install `typeship`

The skills run the `typeship` CLI. Install it with `npm install -g @typeship-ax/cli`, or run it without installing through `npx -y @typeship-ax/cli@latest`.

## Skills

| Skill | Use when |
| --- | --- |
| `typeship` | Any typeship task. It chooses which of the skills below applies. |
| `typeship-cli` | Generating packages and managing Projects, Targets, and Drafts from the terminal. |
| `typeship-mcp-clients` | Connecting typeship's MCP server, or a generated one, to an agent client. |
| `typeship-api` | Calling typeship's REST API directly, without the CLI. |
| `typeship-spec-prep` | A spec fails to generate, produces warnings, or produces poor names. |
| `typeship-ci` | Running typeship in GitHub Actions or another pipeline. |

## Learn more

- Coding agent guide: https://typeship.dev/docs/guides/coding-agents
- Documentation index for agents: https://typeship.dev/llms.txt

These skills are published from typeship's source, so pull requests here are replaced by the next update. Report a problem or suggest a change in an issue, or email hello@typeship.dev.
