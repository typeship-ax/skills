---
name: typeship-api
description: Call typeship's REST API directly with curl or an HTTP client, without the typeship CLI. Use when no CLI can be installed, when writing code against typeship's API, or when a raw request is the clearest way. Covers auth, every operation, pagination, and the error envelope.
license: MIT
allowed-tools: Bash(curl *), Read, Write
---

# typeship REST API

Base URL `https://typeship.dev/api/v1`. Contract: https://typeship.dev/openapi.yaml. Reference with curl for every operation: https://typeship.dev/docs/api.md. Every JSON response includes a server-generated top-level `request_id`; JSON responses do not duplicate it in a header. Raw, text, file, bodyless, `HEAD`, and redirect responses use a `Request-Id` response header instead. Caller-supplied request IDs are ignored. Errors: `{errors: [{type, code, message, retryable, suggested_action, docs_url}], request_id}`; branch on `code` and `retryable`, follow `suggested_action`, and never branch on message. Pagination: `?limit=&cursor=` returns `{object: "list", data, has_more, next_cursor, request_id}`.

Auth: `Authorization: Bearer ak_...` on every call except `POST /generate`, which works anonymously (first 25 operations, 20 requests a minute per address, `RateLimit-*` headers, `limits` object in the response). A present but invalid key is a 401, never a downgrade.

Send a stable `Idempotency-Key` for each logical attempt to create a Project or Target, run stateless or Project generation, update a Definition, refresh diagnostics, or apply a remediation. Repeating the same method, path, query, body, and key within 24 hours returns the original semantic response with `Idempotency-Replayed: true`; using that key for changed intent returns `idempotency_key_reused` (409). Reuse the same key across transport retries. `PATCH` and `DELETE` operations are naturally idempotent and do not take this header.

## Generate

```bash
curl -s https://typeship.dev/api/v1/generate \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: generate-example-1" \
  ${TYPESHIP_TOKEN:+-H "Authorization: Bearer $TYPESHIP_TOKEN"} \
  -d '{"definition":{"url":"https://api.example.com/openapi.json"},"target":{"generator":"python-sdk"}}'
```

Response `{files: [{path, content}], warnings, meta, limits?, request_id}`. Inline Definition: `"definition":{"inline":"<text>"}`. `target.generator` accepts `typescript-sdk`, `python-sdk`, `go-sdk`, `cli`, or `mcp`. One stateless request produces one Target; linked Projects can select all five. `package_name` is optional for TypeScript and Python; `module_path` is the Go override; `config` is optional for every Target.

Write files: `jq -r '.files[] | @base64' | while read f; do ...; done`, or `python3 -c 'import json,sys,os; d=json.load(sys.stdin); [ (os.makedirs(os.path.dirname("sdk/"+f["path"]) or "sdk", exist_ok=True), open("sdk/"+f["path"],"w").write(f["content"])) for f in d["files"] ]'`.

## Projects and generations (key required)

Free includes one stored Project and every selected Target, with unlimited automatic and manual Generation, history, destination pull requests, and preview checks. The complete linked Definition is retained and diagnosed; generated Targets include the first 25 operations. Stateless `POST /generate` remains separate and does not consume the Project slot. Pro generates the remaining operations from the same Definition and adds Projects.

| Do | Call |
| --- | --- |
| List projects | `GET /projects?limit=&cursor=` |
| Create | `POST /projects` `{name, definition: {source, patches?, graphql?, diagnostic_policy?}, targets: [{name, generator, deliveries?, config?}], config?, auto_generate?, relay_enabled?}` with `Idempotency-Key`; the complete Definition is resolved and analyzed before save |
| Get / update / delete | `GET|PATCH|DELETE /projects/{id}` |
| Generate now (URL or GitHub source) | `POST /projects/{id}/generations` → `{data: [one Generation per Target]}`; `meta.pr_status` is `opened`, `no_changes`, or `blocked` |
| History | `GET /projects/{id}/generations` |
| One generation | `GET /generations/{id}`; large ones return `files_omitted: true` and `files_index` |
| One file | `GET /generations/{id}/file?path=src/index.ts` |
| Definition | `GET|PATCH /definitions/{definition_id}` |
| Definition Revisions | `GET /definitions/{definition_id}/revisions`, `GET /definition_revisions/{id}`, `GET /definition_revisions/{id}/content`, `GET /definition_revisions/{id}/documents/{document_id}/content` |
| Diagnostics | `GET /projects/{id}/diagnostics`; `POST` the same path to refresh without generating; `POST /projects/{id}/diagnostics/remediations` with `{diagnostic_ids}` for exact reviewed fixes |
| Account | `GET /me` |
| Keys | `GET /api_keys`, `DELETE /api_keys/{id}` (creation is console-only) |

Docs for any of these: fetch `https://typeship.dev/docs/typeship-api.md` (overview) or the operation in `https://typeship.dev/docs/api.md`.

`definition.source` is a closed union: `{kind: "url", url, headers?}` or `{kind: "repository", repository: {provider: "github", identifier: "owner/repo"}, path}`. URL headers are write-only; Definition responses expose only `headers_configured`. When updating the same URL, omit `headers` to preserve them or pass `null` to remove them. Changing the URL without headers clears the old values.

Diagnostics are deterministic for OpenAPI and GraphQL. Branch on stable `diagnostics[].id`, `severity`, `evaluation.state`, and rule/location entries in `delta`; use `authoring_brief` for edits that require an agent and API-owner judgment. Exact remediations open a source pull request for GitHub Projects or add a Definition overlay for URL Projects.
