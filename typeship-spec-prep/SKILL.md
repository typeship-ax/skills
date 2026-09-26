---
name: typeship-spec-prep
description: Make an OpenAPI (Swagger 2.0, 3.0, 3.1) or GraphQL spec generate well with typeship. Use when typeship returns SPEC_INVALID or warnings, when method, command, or tool names come out wrong, when pagination or auth is not detected, or before generating from a spec for the first time. Explains what typeship reads from a spec and how to fix a spec without changing the API.
license: MIT
allowed-tools: Bash(typeship *), Bash(curl *), Read, Edit
---

# Preparing a spec for typeship

typeship generates from the spec as written, so names, descriptions, and auth in the spec become the names, help text, and auth of every generated package.

Reference pages, each available as Markdown:

- What typeship reads from a spec: https://typeship.dev/docs/reference/spec-compatibility.md
- Every Diagnostic rule and its fix: https://typeship.dev/docs/reference/diagnostic-rules.md
- Every generator message and its fix: https://typeship.dev/docs/reference/errors-and-warnings.md

To find one rule or message from the terminal, run `typeship docs search "<rule id or message>"`.

## Check the spec

For a spec that is not in a Project yet, generate once and read the warnings:

```bash
typeship packages generate --spec '{"url":"<spec-url>"}' --target '{"type":"typescript_sdk"}' --out check/ | jq '.warnings'
```

A spec typeship cannot use at all fails with a `SPEC_INVALID` envelope on stderr.

For a Project, read its Diagnostics:

```bash
typeship spec-revisions get <spec_revision_id> --include diagnostics
typeship spec-revisions get <spec_revision_id> --include diagnostics --filter blocking   # only what fails the policy
typeship specs refresh <spec_id>                    # fetch the source and queue automatic generation when enabled
```

- Branch on `diagnostics[].id` and `severity`. The prose may change.
- One Diagnostic lists every affected location in `locations[]`. Fix the rule once instead of reporting each location separately.
- Each location reports `blocking`, `introduced` (new since the previous Spec Revision), and `suppressed` (covered by a reviewed exception). When `diagnostic_summary.status` is `blocked`, fix the locations where `blocking` is true.
- A Diagnostic that needs the API owner's judgment carries an `authoring_brief`. Follow it, keep the API's wire behavior unchanged, and ask the owner when the spec cannot answer the question.
- By default, a pull request that changes the spec is blocked only by newly introduced correctness errors. Existing issues stay visible without blocking.

## What typeship reads

The examples use Parcel, a fictional delivery API.

| Spec field | Becomes | Guidance |
| --- | --- | --- |
| `info.title` | Package, client, and environment variable names (`parcel`, `ParcelClient`, `PARCEL_TOKEN`) | Use the product name, not "API". |
| `servers[0].url` | Default base URL | Use an absolute URL. A relative or templated URL without defaults makes every user pass a base URL. |
| `operationId` | Method, command, and tool names (`shipments.list`, `shipments list`, `shipments_list`) | Set one on every operation, named consistently. Names derived from the method and path read worse. |
| `tags` | Resources | One tag per operation. |
| `summary` and `description` | CLI help and MCP tool descriptions | Agents choose tools from these. Keep `summary` to one specific line. |
| `components.securitySchemes` | Client options and CLI auth flags | Supported: HTTP bearer and basic, API key in a header or query, and OAuth 2, which becomes a device-code login when a token URL exists. |
| Response schemas | Typed results and MCP `outputSchema` | `readOnly` and `writeOnly` shape request and response types. `oneOf` and `anyOf` become unions. |
| Pagination parameters and fields | Automatic paging | Detected from `cursor`, `next_cursor`, `has_more`, `page`, `offset`, and `limit`. Otherwise, set the rule in Project config. |

Project config holds behavior a spec cannot express: `retries`, `pagination`, `globals`, `cli`, `mcp`, and `docs_url`. typeship never requires vendor extensions in the spec.

## Fix without changing the API

**Spec patches** change the spec typeship reads without editing the source. They apply before every Generation, so they survive regeneration. Use them to set operationIds, summaries, and tags, or to remove operations:

```bash
typeship specs update <spec_id> \
  --patches '[{"op":"set","path":"/paths/~1shipments/get/operationId","value":"listShipments"}]'
```

See https://typeship.dev/docs/projects/spec-patches.md.

**Diagnostic fixes.** Review exact fixes suggested by Diagnostics and apply them to the source Spec yourself. If the source cannot be edited, add a reviewed Spec patch. Ask the API owner about findings that require their judgment.

## Common messages

| Message | Fix |
| --- | --- |
| `Server URL ... is relative` | Set an absolute `servers[0].url`. |
| `Security scheme ... isn't mapped` | Use HTTP bearer or basic, an API key in a header or query, or OAuth 2. |
| `limits.omitted_operations` is above zero | The plan limited the operation count. The spec is fine. |
| Uploads or streaming operations are missing from the MCP server | Expected. They remain in the SDKs and CLI. |
| Duplicate or renamed commands | Give each operation a distinct `operationId`. |
