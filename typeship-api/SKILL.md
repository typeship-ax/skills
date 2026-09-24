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
- **Retries.** Send an `Idempotency-Key` on creates, generations, Definition updates, Diagnostic refreshes, and remediations. Reuse the same key when retrying the same request. Within 24 hours, the retry returns the original response with `Idempotency-Replayed: true`. The same key with a different request returns `409 idempotency_key_reused`.
- **Conditional writes.** Retrieving a Project, Target, Definition, Draft, or API key returns an `ETag` header. Send it as `If-Match` on `PATCH` or `DELETE`. If the resource changed in between, the write returns `412 precondition_failed` and changes nothing: retrieve it again, reapply your change, and retry. Without `If-Match`, the write applies to the current version.
- **Updates.** `PATCH` leaves omitted fields unchanged, but a supplied object or array replaces the whole field.
- **Rate limits.** Responses carry `RateLimit-*` headers. Anonymous `POST /generate` allows 20 requests a minute per network address.

## Generate one package

```bash
curl -s https://typeship.dev/api/v1/generate \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  ${TYPESHIP_TOKEN:+-H "Authorization: Bearer $TYPESHIP_TOKEN"} \
  -d '{"definition":{"url":"https://typeship.dev/examples/petstore/openapi.yaml"},"target":{"generator":"typescript-sdk"}}'
```

- `target.generator`: `cli`, `go-cli`, `mcp`, `typescript-sdk`, `python-sdk`, or `go-sdk`. One request produces one package.
- For a local spec, send its text as `"definition":{"inline":"<text>"}`.
- Optional: `package_name` for the TypeScript and Python SDKs, `module_path` for the Go SDK and Go CLI, and `config` for any Target.
- `go-cli` also requires `go_sdk: {module_path, version, definition_digest, edition, package_name?}`, the exact Go SDK release the CLI is built on.

The response is `{files: [{path, content}], download?, warnings, meta, limits?, claim?, request_id}`. `download` is present when the request sends an `Idempotency-Key`.

- **Save the package from `download`.** Fetch `download.url` before `download.expires_at`, check the ZIP against `download.sha256`, and extract it into an empty directory. The ZIP holds every file, even when the response omits some. Anyone with the URL can download the package, so keep it private.
- **`limits`** appears when operations were not generated. Report "generated N of M operations" from `generated_operations` and `total_operations`.
- **`claim.url`** appears on anonymous runs from a URL. Give it to the user: once signed in, they can save the run as a Project within seven days.

## Projects

A Project holds one Definition and its Targets. Each Target generates one package and can deliver it to a repository as a pull request. Plans limit Projects and generated operations; see https://typeship.dev/docs/reference/limits.md.

| Task | Call |
| --- | --- |
| List Projects | `GET /projects` |
| Create a Project | `POST /projects` with `{name, definition: {source, patches?, graphql?, diagnostic_policy?}, targets: [{name, generator, deliveries?, config?}], config?, auto_generate?}` |
| Retrieve, update, or delete | `GET`, `PATCH`, or `DELETE /projects/{id}` |
| Generate now | `POST /projects/{id}/generations` (see below) |
| Generation history | `GET /projects/{id}/generations` |
| One Generation | `GET /generations/{id}` |
| One generated file | `GET /generations/{id}/file?path=src/index.ts` |
| Definition | `GET` or `PATCH /definitions/{definition_id}` |
| Definition Revisions | `GET /definitions/{definition_id}/revisions`, then `GET /definition-revisions/{id}` and `GET /definition-revisions/{id}/content` |
| Diagnostics | `GET /projects/{id}/diagnostics`. `POST` the same path to refresh without generating. |
| Apply Diagnostic fixes | `POST /projects/{id}/diagnostics/remediations` with `{diagnostic_ids}` |
| Account | `GET /me` |
| API keys | `GET /api-keys`, `DELETE /api-keys/{id}` |

`definition.source` is either `{kind: "url", url, headers?}` or `{kind: "repository", repository: {provider: "github", identifier: "<owner>/<repo>"}, path}`. URL headers are never returned; responses show `headers_configured` instead. When updating a URL source, omit `headers` to keep them or send `null` to remove them. Changing the URL without sending headers removes them.

### Generate a Project

`POST /projects/{id}/generations` returns `202` with one Generation per active Target, each `queued`. Poll `GET /generations/{id}` while its `status` is `queued` or `running`.

- `succeeded`: the files are saved. `pr_status` reports whether a pull request was `opened`, was unnecessary (`no_changes`), or was `blocked`.
- `failed`: the Generation's `errors` explain why. Other Targets continue.
- Starting again while a Target is queued or running returns that same Generation.

Large Generations return `files_omitted: true` with a `files_index`. Read individual files through the file endpoint.

### Diagnostics

Diagnostics are deterministic checks on the Definition. Branch on `diagnostics[].id`, `severity`, and `evaluation.state`; the prose may change. Diagnostics that need the API owner's judgment include an `authoring_brief`. Applying exact fixes opens a pull request in a GitHub source repository, or adds a reviewed Definition overlay for a URL source.

More: https://typeship.dev/docs/typeship-api.md
