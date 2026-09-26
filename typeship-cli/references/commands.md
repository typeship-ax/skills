# typeship CLI commands

Generated from `typeship help --json` by scripts/check-skills.mts; do not edit. `typeship <resource> <command> --help` prints the same for one command.

## projects

### typeship projects create

POST /projects: Create a Project

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string | yes |  |
| `--spec` | object | yes |  |
| `--targets` | object[] | yes | Initial first-class Targets. More than one may use the same generator with different identities or Deliveries. |
| `--auto-generate` | boolean |  | Whether Typeship should regenerate automatically when the source or saved configuration changes. Default: true. |
| `--config` | json |  | Shared defaults inherited by every Target. GraphQL settings belong in spec.graphql. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated organization and operation; generation without an organization uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship projects list

GET /projects: List Projects

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 input_invalid. List query parameters must appear only once; repeated or unrecognized parameters return 400 query_param_invalid. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same organization, operation, filters, and ordering that issued it. Omit to start at the first page. Empty or malformed cursors, and cursors issued for different filters, return 400 cursor_invalid; start again from the first page. Repeated cursors return 400 query_param_invalid. The page limit may change between requests. |

### typeship projects get <project_id>

GET /projects/{project_id}: Get a Project

### typeship projects update <project_id>

PATCH /projects/{project_id}: Update a Project

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string |  |  |
| `--auto-generate` | boolean |  |  |
| `--config` | json |  | Replaces the Project's shared Target defaults. Send null to clear them. |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

### typeship projects delete <project_id>

DELETE /projects/{project_id}: Delete a Project (destructive: needs --force)

| flag | type | required | description |
| --- | --- | --- | --- |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

### typeship projects generate <project_id>

POST /projects/{project_id}/generate: Generate a Project's Targets

| flag | type | required | description |
| --- | --- | --- | --- |
| `--target-id` | string |  | Stable identifier for one configured generated product. Accepts an ID or an exact name (resolved via targets_list). IDs come from targets_list. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated organization and operation; generation without an organization uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

## specs

### typeship specs get <spec_id>

GET /specs/{spec_id}: Get a Spec

### typeship specs update <spec_id>

PATCH /specs/{spec_id}: Update a Spec

| flag | type | required | description |
| --- | --- | --- | --- |
| `--source` | json |  |  |
| `--patches` | object[] |  | Replace all patches in order. An empty array removes every patch; null is invalid. |
| `--graphql` | json |  | Replace all GraphQL settings. Null or an empty object clears them. |
| `--diagnostic-policy` | object |  | Source pull-request enforcement threshold, new-versus-complete baseline, and explicitly reviewed rule or location exceptions. |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated organization and operation; generation without an organization uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship specs refresh <spec_id>

POST /specs/{spec_id}/refresh: Refresh a Spec

| flag | type | required | description |
| --- | --- | --- | --- |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated organization and operation; generation without an organization uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

## spec-revisions

### typeship spec-revisions list

GET /spec-revisions: List Spec Revisions

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 input_invalid. List query parameters must appear only once; repeated or unrecognized parameters return 400 query_param_invalid. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same organization, operation, filters, and ordering that issued it. Omit to start at the first page. Empty or malformed cursors, and cursors issued for different filters, return 400 cursor_invalid; start again from the first page. Repeated cursors return 400 query_param_invalid. The page limit may change between requests. |
| `--spec-id` | string |  | Only revisions of this Spec. |

### typeship spec-revisions get <spec_revision_id>

GET /spec-revisions/{spec_revision_id}: Get a Spec Revision

| flag | type | required | description |
| --- | --- | --- | --- |
| `--include` | diagnostics |  | Add related data to the response. `diagnostics` adds the `diagnostics` and `patch_diagnostics` arrays. |
| `--filter` | blocking\|introduced |  | Narrow the included Diagnostics to matching locations. Requires include=diagnostics. blocking: locations that fail the Diagnostic policy. introduced: locations new since the baseline. A Diagnostic with no matching location is omitted. diagnostic_summary always describes the complete revision. |

### typeship spec-revisions list-files <spec_revision_id>

GET /spec-revisions/{spec_revision_id}/files: List a Spec Revision's files

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 input_invalid. List query parameters must appear only once; repeated or unrecognized parameters return 400 query_param_invalid. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same organization, operation, filters, and ordering that issued it. Omit to start at the first page. Empty or malformed cursors, and cursors issued for different filters, return 400 cursor_invalid; start again from the first page. Repeated cursors return 400 query_param_invalid. The page limit may change between requests. |

## targets

### typeship targets create

POST /targets: Create a Target

| flag | type | required | description |
| --- | --- | --- | --- |
| `--project-id` | string | yes | Unique identifier for a project. Accepts an ID or an exact name (resolved via projects_list). IDs come from projects_list. |
| `--name` | string | yes |  |
| `--type` | enum | yes | Generator implementation selected by a Target. This is configuration, not identity; several Targets may use the same generator. cli is the TypeScript CLI; go_cli is the native Go CLI, a distinct product that imports one exact paired Go SDK module rather than a client of its own. |
| `--status` | active\|disabled |  | Default: "active". |
| `--release-channel` | stable\|prerelease |  | Default: "stable". |
| `--checks` | object |  | Required checks run against the code in the Draft. Generated checks and customer commands share one reproducible workflow; repository_required names existing repository checks. Supplying checks replaces all settings. Omitted generated restores build, package, and public_entrypoint; omitted repository_required and customer restore empty lists. An empty object restores these defaults. An empty array clears the corresponding list. |
| `--config` | json |  | Target-specific overrides merged over Project.config. GraphQL settings are rejected here and belong to the Spec. |
| `--deliveries` | json[] |  |  |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated organization and operation; generation without an organization uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship targets list

GET /targets: List Targets

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 input_invalid. List query parameters must appear only once; repeated or unrecognized parameters return 400 query_param_invalid. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same organization, operation, filters, and ordering that issued it. Omit to start at the first page. Empty or malformed cursors, and cursors issued for different filters, return 400 cursor_invalid; start again from the first page. Repeated cursors return 400 query_param_invalid. The page limit may change between requests. |
| `--project-id` | string |  | Only Targets in this Project. Accepts an ID or an exact name (resolved via projects_list). IDs come from projects_list. |

### typeship targets get <target_id>

GET /targets/{target_id}: Get a Target

### typeship targets update <target_id>

PATCH /targets/{target_id}: Update a Target

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string |  |  |
| `--status` | active\|disabled |  |  |
| `--release-channel` | stable\|prerelease |  |  |
| `--checks` | object |  | Required checks run against the code in the Draft. Generated checks and customer commands share one reproducible workflow; repository_required names existing repository checks. Supplying checks replaces all settings. Omitted generated restores build, package, and public_entrypoint; omitted repository_required and customer restore empty lists. An empty object restores these defaults. An empty array clears the corresponding list. |
| `--config` | json |  | Replaces the complete stored override object. Send null or an empty object to resume Project inheritance. Effective values merge over Project.config; GraphQL settings belong to the Spec. |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

### typeship targets delete <target_id>

DELETE /targets/{target_id}: Delete a Target (destructive: needs --force)

| flag | type | required | description |
| --- | --- | --- | --- |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

### typeship targets adopt <target_id>

POST /targets/{target_id}/adopt: Adopt a package release

| flag | type | required | description |
| --- | --- | --- | --- |
| `--body-version` | string | yes | Exact already-published package version to make the latest release. |
| `--tag` | string | yes | Immutable repository tag containing the matching package source. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated organization and operation; generation without an organization uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

## deliveries

### typeship deliveries create

POST /deliveries: Create a Delivery

| flag | type | required | description |
| --- | --- | --- | --- |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated organization and operation; generation without an organization uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship deliveries list

GET /deliveries: List Deliveries

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 input_invalid. List query parameters must appear only once; repeated or unrecognized parameters return 400 query_param_invalid. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same organization, operation, filters, and ordering that issued it. Omit to start at the first page. Empty or malformed cursors, and cursors issued for different filters, return 400 cursor_invalid; start again from the first page. Repeated cursors return 400 query_param_invalid. The page limit may change between requests. |
| `--target-id` | string |  | Only Deliveries of this Target. Accepts an ID or an exact name (resolved via targets_list). IDs come from targets_list. |

### typeship deliveries get <delivery_id>

GET /deliveries/{delivery_id}: Get a Delivery

### typeship deliveries update <delivery_id>

PATCH /deliveries/{delivery_id}: Update a Delivery

| flag | type | required | description |
| --- | --- | --- | --- |
| `--repository` | object | yes |  |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

### typeship deliveries delete <delivery_id>

DELETE /deliveries/{delivery_id}: Delete a Delivery (destructive: needs --force)

| flag | type | required | description |
| --- | --- | --- | --- |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

## generations

### typeship generations get <generation_id>

GET /generations/{generation_id}: Get a Generation

### typeship generations list

GET /generations: List Generations

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 input_invalid. List query parameters must appear only once; repeated or unrecognized parameters return 400 query_param_invalid. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same organization, operation, filters, and ordering that issued it. Omit to start at the first page. Empty or malformed cursors, and cursors issued for different filters, return 400 cursor_invalid; start again from the first page. Repeated cursors return 400 query_param_invalid. The page limit may change between requests. |
| `--project-id` | string |  | Only Generations in this Project. Accepts an ID or an exact name (resolved via projects_list). IDs come from projects_list. |
| `--target-id` | string |  | Only Generations of this Target. Accepts an ID or an exact name (resolved via targets_list). IDs come from targets_list. |
| `--status` | enum |  | Only Generations with this status. |

### typeship generations list-files <generation_id>

GET /generations/{generation_id}/files: List a Generation's files

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 input_invalid. List query parameters must appear only once; repeated or unrecognized parameters return 400 query_param_invalid. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same organization, operation, filters, and ordering that issued it. Omit to start at the first page. Empty or malformed cursors, and cursors issued for different filters, return 400 cursor_invalid; start again from the first page. Repeated cursors return 400 query_param_invalid. The page limit may change between requests. |

## drafts

### typeship drafts list

GET /drafts: List Drafts

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 input_invalid. List query parameters must appear only once; repeated or unrecognized parameters return 400 query_param_invalid. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same organization, operation, filters, and ordering that issued it. Omit to start at the first page. Empty or malformed cursors, and cursors issued for different filters, return 400 cursor_invalid; start again from the first page. Repeated cursors return 400 query_param_invalid. The page limit may change between requests. |
| `--target-id` | string |  | Only Drafts of this Target. Accepts an ID or an exact name (resolved via targets_list). IDs come from targets_list. |
| `--status` | enum |  | Only Drafts with this status. |

### typeship drafts get <draft_id>

GET /drafts/{draft_id}: Get a Draft

### typeship drafts update <draft_id>

PATCH /drafts/{draft_id}: Update a Draft

| flag | type | required | description |
| --- | --- | --- | --- |
| `--version-next` | string | yes | Exact SemVer, or null to return to automatic selection. |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

### typeship drafts list-files <draft_id>

GET /drafts/{draft_id}/files: List a Draft's files

| flag | type | required | description |
| --- | --- | --- | --- |
| `--filter` | enum |  | conflicted: conflicts only. customized: files that differ from the last merged package. history: files affected by a default-branch history rewrite. Omit for conflicted and customized files. |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 input_invalid. List query parameters must appear only once; repeated or unrecognized parameters return 400 query_param_invalid. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same organization, operation, filters, and ordering that issued it. Omit to start at the first page. Empty or malformed cursors, and cursors issued for different filters, return 400 cursor_invalid; start again from the first page. Repeated cursors return 400 query_param_invalid. The page limit may change between requests. |

### typeship drafts resolve <draft_id>

POST /drafts/{draft_id}/resolve: Resolve Draft conflicts

| flag | type | required | description |
| --- | --- | --- | --- |
| `--expected-head-sha` | string | yes | The Draft's head_sha. A newer Draft commit returns 409 resource_changed without saving. |
| `--resolutions` | json[] | yes | Unique current conflict or customized paths. Choose generated to discard a customization, including a Draft-only file. Final file content must total at most 2 MiB. Decisions apply together or not at all. |

### typeship drafts recover <draft_id>

POST /drafts/{draft_id}/recover: Recover a Draft's history

| flag | type | required | description |
| --- | --- | --- | --- |
| `--expected-default-sha` | string | yes | The Draft's history_recovery.default_sha. |
| `--expected-head-sha` | string | yes | The Draft's history_recovery.head_sha; null when the Draft branch is absent. |

## releases

### typeship releases list

GET /releases: List Releases

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 input_invalid. List query parameters must appear only once; repeated or unrecognized parameters return 400 query_param_invalid. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same organization, operation, filters, and ordering that issued it. Omit to start at the first page. Empty or malformed cursors, and cursors issued for different filters, return 400 cursor_invalid; start again from the first page. Repeated cursors return 400 query_param_invalid. The page limit may change between requests. |
| `--target-id` | string |  | Only releases of this Target. Accepts an ID or an exact name (resolved via targets_list). IDs come from targets_list. |

### typeship releases get <release_id>

GET /releases/{release_id}: Get a Release

### typeship releases retry <release_id>

POST /releases/{release_id}/retry: Retry publishing a Release

| flag | type | required | description |
| --- | --- | --- | --- |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated organization and operation; generation without an organization uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

## files

### typeship files get <file_id>

GET /files/{file_id}: Get a File

| flag | type | required | description |
| --- | --- | --- | --- |
| `--cursor` | string |  | next_cursor from the preceding chunk of this file. |

## packages

### typeship packages generate

POST /generate: Generate a package

| flag | type | required | description |
| --- | --- | --- | --- |
| `--spec` | json | yes | A Spec for one-shot generation, provided as exactly one URL or inline entrypoint. |
| `--target` | object | yes | One-shot generator descriptor; no persisted Target is created. |
| `--package-name` | string |  | npm package or Python distribution override. Valid only for the TypeScript and Python SDK targets. |
| `--module-path` | string |  | Go module path override for the generated artifact's own module. Valid only for the Go SDK and Go CLI Targets. Projects derive this from the Go destination repository by default. |
| `--go-sdk` | object |  | The exact paired Go SDK a go_cli generation is built on. Required when target.type is go_cli and rejected otherwise. The descriptor is closed and immutable, because a CLI that pins a range or a branch pins nothing. |
| `--config` | object |  | Everything Typeship needs beyond the Spec, in one object: generation customization (globals, retries, pagination, readme) and how the generated tooling behaves (cli, mcp, package, docs_url). Plain configuration. Typeship never requires vendor extensions inside the Spec itself. One-shot generation also accepts GraphQL settings here; stored projects keep those settings on their Spec. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated organization and operation; generation without an organization uses a hashed network identity. Retrying the same method, path, query, If-Match header, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship packages download

GET /generate/download: Download a generated package

| flag | type | required | description |
| --- | --- | --- | --- |
| `--query-token` | string | yes | Private download token from download.url in the generation result. |

## organization

### typeship organization get

GET /organization: Get the Organization

## api-keys

### typeship api-keys list

GET /api-keys: List API keys

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Omit for 20; otherwise supply base-10 digits representing an integer from 1 to 100. Empty, malformed, or out-of-range values return 400 input_invalid. List query parameters must appear only once; repeated or unrecognized parameters return 400 query_param_invalid. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same organization, operation, filters, and ordering that issued it. Omit to start at the first page. Empty or malformed cursors, and cursors issued for different filters, return 400 cursor_invalid; start again from the first page. Repeated cursors return 400 query_param_invalid. The page limit may change between requests. |
| `--status` | active\|revoked |  | Only keys with this status. |

### typeship api-keys get <api_key_id>

GET /api-keys/{api_key_id}: Get an API key

### typeship api-keys revoke <api_key_id>

POST /api-keys/{api_key_id}/revoke: Revoke an API key

| flag | type | required | description |
| --- | --- | --- | --- |
| `--if-match` | string |  | ETag from a preceding response. The write applies only if the resource still has that version; otherwise it returns 412 precondition_failed without changes. Omit to write the current version. See https://typeship.dev/docs/typeship-api#conditional-writes. |

## Built-ins

`typeship login`, `typeship logout`, `typeship whoami`, `typeship config`, `typeship mcp`, `typeship docs`, `typeship upgrade`, `typeship completion`, `typeship help`, `typeship version`, `typeship init`, `typeship agent-guide`, `typeship auth`, `typeship doctor`
