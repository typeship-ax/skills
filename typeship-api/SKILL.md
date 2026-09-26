---
name: typeship-api
description: Call typeship's REST API directly with curl or an HTTP client, without the typeship CLI. Use when no CLI can be installed, when writing code against typeship's API, or when a raw request is the clearest way. Covers auth, every operation, generation polling, conditional writes, pagination, and the error envelope.
license: MIT
allowed-tools: Bash(curl *), Read, Write
---

# typeship REST API

- Base URL: `https://typeship.dev/api/v1`
- Contract: https://typeship.dev/openapi.yaml
- Every operation with a curl example: https://typeship.dev/docs/api.md

## Conventions

- **Auth.** Send `Authorization: Bearer ak_...` on every call except `POST /generate`, which also works anonymously. An invalid key returns `401`; it never falls back to anonymous access. Keys are created in the console.
- **Errors.** `{errors: [{type, code, message, retryable, suggested_action, docs_url}], request_id}`. Branch on `code` and `retryable`, follow `suggested_action`, and never branch on `message`.
- **Pagination.** Send `?limit=&cursor=`. Lists return `{object: "list", data, has_more, next_cursor, request_id}`. Pass `next_cursor` as `cursor` until `has_more` is false.
- **Request IDs.** Every response has a `Request-Id` header, and JSON bodies repeat it as `request_id`. Include it when reporting a problem.
- **Retries.** Send an `Idempotency-Key` on creates, generations, Spec updates, and Diagnostic refreshes. Reuse the same key when retrying the same request. Within 24 hours, the retry returns the original response with `Idempotency-Replayed: true`. The same key with a different request returns `409 idempotency_key_reused`.
- **Conditional writes.** Retrieving a Project, Target, Spec, Draft, or API key returns an `ETag` header. Send it as `If-Match` on `PATCH` or `DELETE`. If the resource changed in between, the write returns `412 precondition_failed` and changes nothing: retrieve it again, reapply your change, and retry. Without `If-Match`, the write applies to the current version.
- **Updates.** `PATCH` leaves omitted fields unchanged, but a supplied object or array replaces the whole field.
- **Rate limits.** Responses carry `RateLimit-*` headers. Anonymous `POST /generate` allows 20 requests a minute per network address.

## Generate one package

```bash
curl -s https://typeship.dev/api/v1/generate \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  ${TYPESHIP_TOKEN:+-H "Authorization: Bearer $TYPESHIP_TOKEN"} \
  -d '{"spec":{"url":"https://typeship.dev/examples/petstore/openapi.yaml"},"target":{"type":"typescript_sdk"}}'
```

- `target.type`: `cli`, `go_cli`, `mcp`, `typescript_sdk`, `python_sdk`, or `go_sdk`. One request produces one package.
- For a local spec, send its text as `"spec":{"inline":"<text>"}`.
- Optional: `package_name` for the TypeScript and Python SDKs, `module_path` for the Go SDK and Go CLI, and `config` for any Target.
- `go_cli` also requires `go_sdk: {module_path, version, spec_digest, package_name?}`, the exact Go SDK release the CLI is built on.

The response is `{files: [{path, content}], download?, warnings: [{code, message, operation?}], coverage, claim?, request_id}`. `download` is present when the request sends an `Idempotency-Key`.

- **Save the package from `download`.** Fetch `download.url` before `download.expires_at`, check the ZIP against `download.sha256`, and extract it into an empty directory. The ZIP holds every file, even when the response omits some. Anyone with the URL can download the package, so keep it private.
- **`coverage`** reports `generated`, `omitted`, `total`, and `omitted_operations`. When capped, it also includes `reason` and a sign-up or upgrade link.
- **`claim.url`** appears on anonymous runs from a URL. Give it to the user: once signed in, they can save the run as a Project within seven days.

## Projects

A Project holds one Spec and its Targets. Each Target generates one package and can deliver it to a repository as a pull request. Plans limit Projects and generated operations; see https://typeship.dev/docs/reference/limits.md.

| Task | Call |
| --- | --- |
| List Projects | `GET /projects` |
| Create a Project | `POST /projects` with `{name, spec: {source, patches?, graphql?, diagnostic_policy?}, targets: [{name, generator, deliveries?, config?}], config?, auto_generate?}` |
| Retrieve, update, or delete | `GET`, `PATCH`, or `DELETE /projects/{id}` |
| Generate now | `POST /projects/{id}/generate` (see below) |
| Generation history | `GET /generations?project_id=` (also `target_id`, `status`) |
| One Generation | `GET /generations/{id}` |
| Generated files | `GET /generations/{id}/files`, then `GET /files/{file_id}` |
| Spec | `GET` or `PATCH /specs/{spec_id}` |
| Spec Revisions | `GET /spec-revisions?spec_id=`, then `GET /spec-revisions/{id}` and `GET /spec-revisions/{id}/files` |
| Diagnostics | `GET /spec-revisions/{id}` returns `diagnostic_summary`; add `include=diagnostics` for each Diagnostic. `POST /specs/{spec_id}/refresh` fetches the source and queues automatic generation when enabled. |
| Organization | `GET /organization` |
| API keys | `GET /api-keys`, `POST /api-keys/{id}/revoke` |

`spec.source` is either `{type: "url", url: {url, headers?}}` or `{type: "repository", repository: {provider: "github", identifier: "<owner>/<repo>", path}}`. URL headers are never returned; responses show `headers_configured` instead. When updating a URL source, omit `headers` to keep them or send `null` to remove them. Changing the URL without sending headers removes them.

### Generate a Project

`POST /projects/{id}/generate` returns `202` with one Generation per active Target, each `queued`. Poll `GET /generations/{id}` while its `status` is `queued` or `running`.

- `completed`: the files are saved. Read the Target Draft for pull-request and delivery state.
- `failed`: the Generation's `errors` explain why. Other Targets continue.
- Starting again while a Target is queued or running returns that same Generation.

Every Generation reports `file_count`. List its files with `GET /generations/{id}/files` and read each with `GET /files/{file_id}`.

### Diagnostics

Diagnostics are deterministic checks on the Spec. Branch on `diagnostic_summary.status`, `diagnostics[].id`, `severity`, and each location's `blocking`; the prose may change. Add `filter=blocking` with `include=diagnostics` to receive only the locations that fail the Diagnostic policy. Diagnostics that need the API owner's judgment include an `authoring_brief`. Review exact suggested fixes and apply them yourself to the source Spec or through Spec patches.

More: https://typeship.dev/docs/typeship-api.md
