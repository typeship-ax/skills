---
name: typeship-api
description: Call typeship's REST API directly with curl or an HTTP client, without the typeship CLI. Use when no CLI can be installed, when writing code against typeship's API, or when a raw request is the clearest way. Covers auth, every operation, pagination, and the error envelope.
license: MIT
allowed-tools: Bash(curl *), Read, Write
---

# typeship REST API

Base URL `https://typeship.dev/api/v1`. Contract: https://typeship.dev/openapi.yaml. Reference with curl for every operation: https://typeship.dev/docs/api.md. Errors: `{errors: [{code, message}], request_id}` (`x-request-id` header); codes `invalid_request`, `unauthorized`, `plan_limit_reached`, `not_found`, `payload_too_large`, `spec_error`, `fetch_error`, `rate_limited`, `internal_error`. Pagination: `?limit=&cursor=` and `has_more`, `next_cursor`.

Auth: `Authorization: Bearer ak_...` on every call except `POST /generate`, which works anonymously (first 25 operations, 20 requests a minute per address, `X-RateLimit-*` headers, `limits` object in the response). A present but invalid key is a 401, never a downgrade.

## Generate

```bash
curl -s https://typeship.dev/api/v1/generate \
  -H "Content-Type: application/json" \
  ${TYPESHIP_TOKEN:+-H "Authorization: Bearer $TYPESHIP_TOKEN"} \
  -d '{"spec":{"url":"https://api.example.com/openapi.json"},"platforms":["sdk"],"language":"python"}'
```

Response `{files: [{path, content}], warnings, meta, limits?}`. Inline spec: `"spec":{"inline":"<text>"}`. `platforms`: `sdk`, `cli`, `mcp` (cli and mcp are TypeScript only). `package_name`, `config` optional.

Write files: `jq -r '.files[] | @base64' | while read f; do ...; done`, or `python3 -c 'import json,sys,os; d=json.load(sys.stdin); [ (os.makedirs(os.path.dirname("sdk/"+f["path"]) or "sdk", exist_ok=True), open("sdk/"+f["path"],"w").write(f["content"])) for f in d["files"] ]'`.

## Projects and generations (key required)

| Do | Call |
| --- | --- |
| List projects | `GET /projects?limit=&cursor=` |
| Create | `POST /projects` `{name, spec_url | source, languages, destinations?, package_names?, config?, spec_patches?, auto_regen?, mcp_enabled?, relay_enabled?}` |
| Get / update / delete | `GET|PATCH|DELETE /projects/{id}` |
| Regenerate now (URL-sourced) | `POST /projects/{id}/generations` → `{data: [generation per language]}` |
| History | `GET /projects/{id}/generations` |
| One generation | `GET /generations/{id}`; large ones return `files_omitted: true` and `files_index` |
| One file | `GET /generations/{id}/file?path=src/index.ts` |
| Spec versions | `GET /projects/{id}/spec_versions`, `GET /spec_versions/{id}`, `GET /spec_versions/{id}/content` |
| Hosted MCP usage | `GET /projects/{id}/mcp_usage` |
| Account, usage | `GET /me`, `PATCH /me`, `GET /usage` |
| Keys | `GET /api_keys`, `DELETE /api_keys/{id}` (creation is console-only) |

Docs for any of these: fetch `https://typeship.dev/docs/typeship-api/api.md` (overview) or the operation in `https://typeship.dev/docs/api.md`.
