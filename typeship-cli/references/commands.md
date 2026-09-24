# typeship CLI commands

Generated from `typeship help --json` by scripts/check-skills.mts; do not edit. `typeship <resource> <command> --help` prints the same for one command.

## generate

### typeship generate run

POST /generate: Generate one package from a Definition

| flag | type | required | description |
| --- | --- | --- | --- |
| `--definition` | json | yes | A Definition for one-shot generation, provided as exactly one URL or inline entrypoint. |
| `--target` | object | yes | One-shot generator descriptor; no persisted Target is created. |
| `--package-name` | string |  | npm package or Python distribution override. Valid only for the TypeScript and Python SDK targets. |
| `--module-path` | string |  | Go module path override for the generated artifact's own module. Valid only for the Go SDK and Go CLI outputs. Linked projects derive this from the Go destination repository by default. |
| `--go-sdk` | object |  | The exact paired Go SDK a go-cli generation is built on. Required when target.generator is go-cli and rejected otherwise. The descriptor is closed and immutable, because a CLI that pins a range or a branch pins nothing. |
| `--config` | object |  | Everything Typeship needs beyond the Definition, in one object: generation customization (globals, retries, pagination, readme) and how the generated tooling behaves (cli, mcp, package, docs_url). Plain configuration. Typeship never requires vendor extensions inside the Definition itself. One-shot generation also accepts GraphQL settings here; stored projects keep those settings on their Definition. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship generate download-package

GET /generate/download: Download a generated package

| flag | type | required | description |
| --- | --- | --- | --- |
| `--query-token` | string | yes | Private download token from download.url in the generation result. |

## projects

### typeship projects list

GET /projects: List projects

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 invalid_request. List query parameters must appear only once; unrecognized parameters also return 400. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same account, operation, filters, and ordering that issued it. Omit to start at the first page. Empty, malformed, or repeated cursors return 400 invalid_request. The page limit may change between requests. |

### typeship projects create

POST /projects: Create a project

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string | yes |  |
| `--definition` | object | yes |  |
| `--targets` | object[] | yes | Initial first-class Targets. More than one may use the same generator with different identities or Deliveries. |
| `--auto-generate` | boolean |  | Whether Typeship should regenerate automatically when the source changes. Default: false. |
| `--relay-enabled` | boolean |  | Enable webhook relay sessions. Requires the CLI target and Pro. Default: false. |
| `--config` | json |  | Shared defaults inherited by every Target. GraphQL settings belong in definition.graphql. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship projects retrieve <project_id>

GET /projects/{project_id}: Retrieve a project

### typeship projects delete <project_id>

DELETE /projects/{project_id}: Delete a project (destructive: needs --force)

| flag | type | required | description |
| --- | --- | --- | --- |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

### typeship projects update <project_id>

PATCH /projects/{project_id}: Update a project

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string |  |  |
| `--auto-generate` | boolean |  |  |
| `--relay-enabled` | boolean |  | Enable webhook relay sessions. Requires the CLI target and Pro. |
| `--config` | json |  | Replaces the Project's shared Target defaults. Send null to clear them. |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

### typeship projects retrieve-diagnostics <project_id>

GET /projects/{project_id}/diagnostics: Analyze a project's latest Definition Revision

### typeship projects refresh-diagnostics <project_id>

POST /projects/{project_id}/diagnostics: Refresh a project's Diagnostics from its configured source

| flag | type | required | description |
| --- | --- | --- | --- |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship projects remediate-diagnostics <project_id>

POST /projects/{project_id}/diagnostics/remediations: Apply exact, reviewed diagnostic remediations

| flag | type | required | description |
| --- | --- | --- | --- |
| `--diagnostic-ids` | string[] | yes | Stable IDs of current diagnostics whose exact patches should be reviewed and applied. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship projects retrieve-integration-health <project_id>

GET /projects/{project_id}/integration-health: Diagnose a project's repository integrations

### typeship projects list-generations <project_id>

GET /projects/{project_id}/generations: List a project's generations

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 invalid_request. List query parameters must appear only once; unrecognized parameters also return 400. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same account, operation, filters, and ordering that issued it. Omit to start at the first page. Empty, malformed, or repeated cursors return 400 invalid_request. The page limit may change between requests. |
| `--target-id` | string |  | Only generations for this persisted Target. |

### typeship projects generate <project_id>

POST /projects/{project_id}/generations: Start generation for active Targets

| flag | type | required | description |
| --- | --- | --- | --- |
| `--target-id` | string |  | Stable identifier for one configured generated product. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

## definitions

### typeship definitions retrieve <definition_id>

GET /definitions/{definition_id}: Retrieve a Definition

### typeship definitions update <definition_id>

PATCH /definitions/{definition_id}: Update and resolve a Definition

| flag | type | required | description |
| --- | --- | --- | --- |
| `--source` | json |  |  |
| `--patches` | object[] |  | Replace all patches in order. An empty array removes every patch; null is invalid. |
| `--graphql` | json |  | Replace all GraphQL settings. Null or an empty object clears them. |
| `--diagnostic-policy` | object |  | Source pull-request enforcement threshold, new-versus-complete baseline, and explicitly reviewed rule or location exceptions. |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

## targets

### typeship targets list <project_id>

GET /projects/{project_id}/targets: List a project's Targets

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 invalid_request. List query parameters must appear only once; unrecognized parameters also return 400. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same account, operation, filters, and ordering that issued it. Omit to start at the first page. Empty, malformed, or repeated cursors return 400 invalid_request. The page limit may change between requests. |

### typeship targets create <project_id>

POST /projects/{project_id}/targets: Create an independently configured Target

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string | yes |  |
| `--definition-id` | string | yes | Unique identifier for a project's logical API Definition. |
| `--generator` | enum | yes | Generator implementation selected by a Target. This is configuration, not identity; several Targets may use the same generator. cli is the TypeScript CLI; go-cli is the native Go CLI, a distinct product that imports one exact paired Go SDK module rather than a client of its own. |
| `--state` | active\|disabled |  | Default: "active". |
| `--edition` | string |  | Default: "2026-08-24". |
| `--release-channel` | stable\|prerelease |  | Default: "stable". |
| `--proposed-version` | string |  | Optional larger or prerelease SemVer for the next reviewed release. |
| `--checks` | object |  | Required checks run against the complete combined package. Generated checks and customer commands share one reproducible workflow; repository_required names existing repository checks. Supplying checks replaces all settings. Omitted generated restores build, package, and public_entrypoint; omitted repository_required and customer restore empty lists. An empty object restores these defaults. An empty array clears the corresponding list. |
| `--config` | json |  | Target-specific overrides merged over Project.config. GraphQL settings are rejected here and belong to the Definition. |
| `--deliveries` | json[] |  |  |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship targets retrieve <target_id>

GET /targets/{target_id}: Retrieve a Target

### typeship targets delete <target_id>

DELETE /targets/{target_id}: Delete an unused Target (destructive: needs --force)

| flag | type | required | description |
| --- | --- | --- | --- |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

### typeship targets update <target_id>

PATCH /targets/{target_id}: Update a Target, its Deliveries, or its next reviewed version

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string |  |  |
| `--state` | active\|disabled |  |  |
| `--edition` | string |  |  |
| `--release-channel` | stable\|prerelease |  |  |
| `--proposed-version` | string |  | Send only this field to select an exact SemVer, or null for automatic selection. The Target and Draft endpoints both support an optional If-Match precondition. |
| `--checks` | object |  | Required checks run against the complete combined package. Generated checks and customer commands share one reproducible workflow; repository_required names existing repository checks. Supplying checks replaces all settings. Omitted generated restores build, package, and public_entrypoint; omitted repository_required and customer restore empty lists. An empty object restores these defaults. An empty array clears the corresponding list. |
| `--config` | json |  | Replaces the complete stored override object. Send null or an empty object to resume Project inheritance. Effective values merge over Project.config; GraphQL settings belong to the Definition. |
| `--deliveries` | json[] |  | Replaces the Delivery set; include each kind you want to keep. Retained kinds preserve their ID, creation time, and hosted URL. Each supplied Delivery replaces its configuration, so omitted optional settings reset to their defaults. Omit deliveries to keep the existing set, or send [] to remove all Deliveries. Removing and later recreating a kind allocates a new ID and, for hosted_mcp, a new URL. |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

### typeship targets list-releases <target_id>

GET /targets/{target_id}/releases: List immutable releases for a Target

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 invalid_request. List query parameters must appear only once; unrecognized parameters also return 400. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same account, operation, filters, and ordering that issued it. Omit to start at the first page. Empty, malformed, or repeated cursors return 400 invalid_request. The page limit may change between requests. |

### typeship targets retrieve-draft <target_id>

GET /targets/{target_id}/draft: Retrieve a Target's rolling Draft release

### typeship targets update-draft <target_id>

PATCH /targets/{target_id}/draft: Select an exact Draft version or return to automatic versioning

| flag | type | required | description |
| --- | --- | --- | --- |
| `--body-version` | string | yes | Exact SemVer, or null to return to automatic selection. |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

### typeship targets adopt-release <target_id>

POST /targets/{target_id}/adopt: Adopt a verified existing package as Current

| flag | type | required | description |
| --- | --- | --- | --- |
| `--body-version` | string | yes | Exact already-published package version to make Current. |
| `--tag` | string | yes | Immutable repository tag containing the matching package source. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship targets retrieve-release <target_release_id>

GET /target-releases/{target_release_id}: Retrieve an immutable Target release

### typeship targets republish-release <target_release_id>

POST /target-releases/{target_release_id}/republish: Retry publication of an exact Target release

| flag | type | required | description |
| --- | --- | --- | --- |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship targets list-draft-files <target_id>

GET /targets/{target_id}/draft/files: List customized and conflicted files on a Draft

| flag | type | required | description |
| --- | --- | --- | --- |
| `--filter` | enum |  | conflicted: conflicts only. customized: files that differ from the last accepted package. history: files affected by a default-branch history rewrite. Omit for conflicted and customized files. |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 invalid_request. List query parameters must appear only once; unrecognized parameters also return 400. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same account, operation, filters, and ordering that issued it. Omit to start at the first page. Empty, malformed, or repeated cursors return 400 invalid_request. The page limit may change between requests. |

### typeship targets retrieve-draft-file-content <target_id>

GET /targets/{target_id}/draft/files/content: Read one side of a Draft file

| flag | type | required | description |
| --- | --- | --- | --- |
| `--path` | string | yes | File path from listDraftFiles. |
| `--side` | enum | yes | A side listed for the file. |
| `--cursor` | string |  | next_cursor from the preceding chunk of the same path and side. |

### typeship targets resolve-draft-conflicts <target_id>

POST /targets/{target_id}/draft/conflicts/resolve: Resolve selected Draft conflicts

| flag | type | required | description |
| --- | --- | --- | --- |
| `--expected-head-revision` | string | yes | The Draft's head_revision. A newer Draft commit returns 409 stale_draft without saving. |
| `--resolutions` | json[] | yes | Unique current conflict paths. Final file content must total at most 2 MiB. Decisions save together or not at all. |
| `--dry-run` | boolean |  | Validate the decisions and return the planned files without saving. Default: false. |

### typeship targets discard-draft-customizations <target_id>

POST /targets/{target_id}/draft/customizations/discard: Discard selected Draft customizations

| flag | type | required | description |
| --- | --- | --- | --- |
| `--expected-head-revision` | string | yes | The Draft's head_revision. A newer Draft commit returns 409 stale_draft without committing. |
| `--paths` | string[] | yes | Customized paths that are not conflicts, to replace with the generated files. A listed file that exists only on the Draft is deleted. |
| `--dry-run` | boolean |  | Return the planned writes and deletions without committing. Default: false. |

### typeship targets recover-draft-history <target_id>

POST /targets/{target_id}/draft/history/recover: Approve recovery from rewritten default-branch history

| flag | type | required | description |
| --- | --- | --- | --- |
| `--expected-default-revision` | string | yes | The Draft's history_recovery.default_revision. |
| `--expected-head-revision` | string | yes | The Draft's history_recovery.head_revision; null when the Draft branch is absent. |

### typeship targets retrieve-delivery <delivery_id>

GET /deliveries/{delivery_id}: Retrieve a Delivery

### typeship targets retrieve-publication <publication_id>

GET /publications/{publication_id}: Retrieve a Publication

## generations

### typeship generations retrieve <generation_id>

GET /generations/{generation_id}: Retrieve a generation

### typeship generations retrieve-file <generation_id>

GET /generations/{generation_id}/file: Fetch one file from a generation

| flag | type | required | description |
| --- | --- | --- | --- |
| `--path` | string | yes | Repo-relative path inside the generated package. |

## definition-revisions

### typeship definition-revisions list <definition_id>

GET /definitions/{definition_id}/revisions: List Definition Revisions

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 invalid_request. List query parameters must appear only once; unrecognized parameters also return 400. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same account, operation, filters, and ordering that issued it. Omit to start at the first page. Empty, malformed, or repeated cursors return 400 invalid_request. The page limit may change between requests. |

### typeship definition-revisions retrieve <definition_revision_id>

GET /definition-revisions/{definition_revision_id}: Retrieve a Definition Revision

### typeship definition-revisions retrieve-content <definition_revision_id>

GET /definition-revisions/{definition_revision_id}/content: Retrieve a Definition Revision's canonical content

### typeship definition-revisions retrieve-document-content <definition_revision_id> <document_id>

GET /definition-revisions/{definition_revision_id}/documents/{document_id}/content: Retrieve one source document from a Definition Revision

### typeship definition-revisions retrieve-document <definition_document_id>

GET /definition-documents/{definition_document_id}: Retrieve a Definition Document

## account

### typeship account retrieve

GET /me: The account behind the presented credentials

## api-keys

### typeship api-keys list

GET /api-keys: List API keys

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 invalid_request. List query parameters must appear only once; unrecognized parameters also return 400. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same account, operation, filters, and ordering that issued it. Omit to start at the first page. Empty, malformed, or repeated cursors return 400 invalid_request. The page limit may change between requests. |

### typeship api-keys retrieve <api_key_id>

GET /api-keys/{api_key_id}: Retrieve an API key

### typeship api-keys revoke <api_key_id>

DELETE /api-keys/{api_key_id}: Revoke an API key (destructive: needs --force)

| flag | type | required | description |
| --- | --- | --- | --- |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

## Built-ins

`typeship login`, `typeship logout`, `typeship whoami`, `typeship config`, `typeship mcp`, `typeship docs`, `typeship upgrade`, `typeship completion`, `typeship help`, `typeship version`, `typeship init`, `typeship agent-guide`, `typeship auth`, `typeship doctor`
