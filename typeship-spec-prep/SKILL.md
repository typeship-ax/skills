---
name: typeship-spec-prep
description: Make an OpenAPI (Swagger 2.0, 3.0, 3.1) or GraphQL spec generate well with typeship. Use when typeship returns spec_error or warnings, when method, command, or tool names come out wrong, when pagination or auth is not detected, or before generating from a spec for the first time. Explains what typeship reads from a spec and how to fix a spec without touching the API.
license: MIT
allowed-tools: Bash(typeship *), Bash(curl *), Read, Edit
---

# Preparing a Definition for typeship

typeship generates from the spec as written. The better the spec, the better the SDK, CLI, and MCP tools. Authoritative pages (fetch as markdown): https://typeship.dev/docs/reference/spec-compatibility.md (what maps to what), https://typeship.dev/docs/reference/diagnostic-rules.md (every deterministic Diagnostic and its remediation), and https://typeship.dev/docs/reference/errors-and-warnings.md (every generator message, verbatim, with the fix). `typeship docs search "<rule id or warning text>"` finds the entry from the terminal.

## Check first

```bash
typeship projects retrieve-diagnostics <project_id>   # grouped, revision-bound Diagnostics
typeship projects refresh-diagnostics <project_id>    # observe the current Definition without generating
typeship generate run --definition '{"url":"..."}' --target '{"generator":"typescript-sdk"}' > /tmp/gen.json 2>/tmp/gen.err
jq '.warnings' /tmp/gen.json      # every warning, verbatim
cat /tmp/gen.err                  # SPEC_INVALID envelope when the spec cannot be used at all
```

Project creation performs the first Diagnostic pass before it saves. Treat `diagnostics[].id` and `severity` as stable control fields; prose may improve. One Diagnostic contains every affected `locations[]`, so fix the root rule once rather than reporting each endpoint as a separate problem. Exact Definition patches are reviewable proposals. `source_edit` means the right value needs author intent: copy `authoring_brief`, preserve wire behavior, and ask the API owner when the contract cannot prove the answer. For a live project, the revision-bound `authoring_brief` is authoritative over the generic fix prompt in the rule catalog.

`delta.added` and `delta.resolved` compare the current and preceding Definition Revisions by exact rule and location. `evaluation.state` applies the Definition's Diagnostic policy. Existing debt stays visible but the default source-PR check blocks only newly introduced correctness errors.

## What typeship reads

- `info.title` → package, client, and CLI names (`acme`, `AcmeClient`, `ACME_TOKEN`). Set it to the product name, not "API".
- `servers[0].url` → base URL. A relative or templated URL without defaults means every user passes `baseUrl`; give it a real default.
- `operationId` → method, command, and tool names (`accounts.list`, `accounts list`, `accounts_list`). Missing ids are derived from method and path and are worse. Use `resourceVerb` or `verbResource` consistently.
- `tags` → resources. One tag per operation; the tag becomes the resource.
- `summary` (one line) → CLI help and MCP tool descriptions; `description` → the long form. Agents read these; make them specific.
- `components.securitySchemes` → client options and CLI auth flags (`bearer` → `--token`/`ACME_TOKEN`; `apiKey` header; `basic`; `oauth2` → device flow when a token URL exists).
- Response schemas → typed results and MCP `outputSchema`; `readOnly`/`writeOnly` shape request and response types; `oneOf`/`anyOf` become unions.
- Pagination is detected from `cursor`/`next_cursor`/`has_more`, `page`, or `offset`/`limit` params and fields; name them conventionally or set the rule in project config.
- Project config (`retries`, `pagination`, `globals`, `cli`, `mcp`, `docs_url`) holds behavior the contract cannot express. Typeship does not require vendor extensions in the customer's spec.

## Fix without touching the API

Definition patches (`typeship definitions update <definition_id> --patches '[{"op":"set","path":"/paths/~1accounts/get/operationId","value":"listAccounts"}]'`) are applied before every Generation and survive regeneration; use them for operationIds, summaries, tags, and removing operations. See https://typeship.dev/docs/projects/definition-patches.md.

For Diagnostics with exact patches, prefer `typeship projects remediate-diagnostics <project_id> --diagnostic-ids '["<diagnostic_id>"]'`. A repository source gets an updateable source pull request, preserving the Definition as source of truth. A URL source gets a reviewed Definition overlay. The command refuses Diagnostics that require authored judgment.

## Common messages

| You see | Do |
| --- | --- |
| `Server URL ... is relative` | add a full `servers[0].url` or pass `baseUrl` |
| `Security scheme ... isn't mapped` | use http bearer/basic, apiKey (header or query), or oauth2 |
| `limits.omitted_operations` is greater than zero | anonymous or free cap; not a spec problem |
| operations with uploads or streaming not exposed as MCP tools | expected; they stay in the SDK and CLI |
| duplicate or renamed commands | give operations distinct `operationId`s |
