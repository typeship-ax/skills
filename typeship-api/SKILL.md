---
name: typeship-api
description: Call typeship's REST API directly with curl or an HTTP client, without the typeship CLI. Use when no CLI can be installed, when writing code against typeship's API, or when a raw request is the clearest way. Covers auth, every operation, pagination, and the error envelope.
license: MIT
allowed-tools: Bash(curl *), Read, Write
---

# typeship REST API

Base URL `https://typeship.dev/api/v1`. Contract: https://typeship.dev/openapi.yaml. Reference with curl for every operation: https://typeship.dev/docs/api.md. Errors: `{errors: [{type, code, message, retryable, suggested_action, docs_url}], request_id}` (`x-request-id` header); branch on `code` and `retryable`, follow `suggested_action`, and never branch on message. Pagination: `?limit=&cursor=` returns `{object: "list", data, has_more, next_cursor}`.

Auth: `Authorization: Bearer ak_...` on every call except `POST /generate`, which works anonymously (first 25 operations, 20 requests a minute per address, `X-RateLimit-*` headers, `limits` object in the response). A present but invalid key is a 401, never a downgrade.

## Generate

```bash
curl -s https://typeship.dev/api/v1/generate \
  -H "Content-Type: application/json" \
  ${TYPESHIP_TOKEN:+-H "Authorization: Bearer $TYPESHIP_TOKEN"} \
  -d '{"spec":{"url":"https://api.example.com/openapi.json"},"outputs":["python-sdk"]}'
```

Response `{files: [{path, content}], warnings, meta, limits?}`. Inline spec: `"spec":{"inline":"<text>"}`. `outputs` accepts `typescript-sdk`, `python-sdk`, `go-sdk`, `cli`, and `mcp`. One stateless request returns one delivery package; linked projects can select all five. `package_name` and `config` are optional.

Write files: `jq -r '.files[] | @base64' | while read f; do ...; done`, or `python3 -c 'import json,sys,os; d=json.load(sys.stdin); [ (os.makedirs(os.path.dirname("sdk/"+f["path"]) or "sdk", exist_ok=True), open("sdk/"+f["path"],"w").write(f["content"])) for f in d["files"] ]'`.

## Projects and generations (key required)

Free includes one stored project, every selected output, and the first 25 operations, with unlimited automatic and manual regeneration, history, destination pull requests, and preview checks. Stateless `POST /generate` remains separate and does not consume the project slot. Pro adds projects and the whole spec.

| Do | Call |
| --- | --- |
| List projects | `GET /projects?limit=&cursor=` |
| Create | `POST /projects` `{name, spec_url | source, outputs, packages?, config?, spec_patches?, auto_regen?, mcp_enabled?, relay_enabled?}` |
| Get / update / delete | `GET|PATCH|DELETE /projects/{id}` |
| Regenerate now (URL or repository source) | `POST /projects/{id}/generations` → `{data: [generation per delivery package]}`; `meta.pr_status` is `opened`, `no_changes`, or `blocked` |
| History | `GET /projects/{id}/generations` |
| One generation | `GET /generations/{id}`; large ones return `files_omitted: true` and `files_index` |
| One file | `GET /generations/{id}/file?path=src/index.ts` |
| Spec versions | `GET /projects/{id}/spec_versions`, `GET /spec_versions/{id}`, `GET /spec_versions/{id}/content` |
| Account | `GET /me` |
| Keys | `GET /api_keys`, `DELETE /api_keys/{id}` (creation is console-only) |

Docs for any of these: fetch `https://typeship.dev/docs/typeship-api/api.md` (overview) or the operation in `https://typeship.dev/docs/api.md`.
