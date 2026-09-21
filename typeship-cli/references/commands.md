# typeship CLI commands

Generated from `typeship help --json` by scripts/check-skills.mts; do not edit. `typeship <resource> <command> --help` prints the same for one command.

## generate

### typeship generate run

POST /generate: Generate one Target from a Definition

| flag | type | required | description |
| --- | --- | --- | --- |
| `--definition` | json | yes | A Definition for stateless generation, provided as exactly one URL or inline entrypoint. |
| `--target` | object | yes | Stateless generator descriptor; no persisted Target is created. |
| `--package-name` | string |  | npm package or Python distribution override. Valid only for the TypeScript and Python SDK targets. |
| `--module-path` | string |  | Go module path override. Valid only for the Go SDK. Linked projects derive this from the Go destination repository by default. |
| `--config` | object |  | Everything Typeship needs beyond the Definition, in one object: generation customization (globals, retries, pagination, readme) and how the generated tooling behaves (cli, mcp, package, docs_url). Plain configuration. Typeship never requires vendor extensions inside the Definition itself. Stateless generation also accepts GraphQL settings here; stored projects keep those settings on their Definition. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

## projects

### typeship projects list

GET /projects: List projects

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same account, operation, filters, and ordering that issued it. |

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
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship projects retrieve <project_id>

GET /projects/{project_id}: Retrieve a project

### typeship projects delete <project_id>

DELETE /projects/{project_id}: Delete a project (destructive: needs --force)

### typeship projects update <project_id>

PATCH /projects/{project_id}: Update a project

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string |  |  |
| `--auto-generate` | boolean |  |  |
| `--relay-enabled` | boolean |  | Enable webhook relay sessions. Requires the CLI target and Pro. |
| `--config` | json |  | Replaces the Project's shared Target defaults. Send null to clear them. |

### typeship projects retrieve-diagnostics <project_id>

GET /projects/{project_id}/diagnostics: Analyze a project's latest Definition Revision

### typeship projects refresh-diagnostics <project_id>

POST /projects/{project_id}/diagnostics: Refresh a project's Diagnostics from its configured source

| flag | type | required | description |
| --- | --- | --- | --- |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship projects remediate-diagnostics <project_id>

POST /projects/{project_id}/diagnostics/remediations: Apply exact, reviewed diagnostic remediations

| flag | type | required | description |
| --- | --- | --- | --- |
| `--diagnostic-ids` | string[] | yes | Stable IDs of current diagnostics whose exact patches should be reviewed and applied. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship projects retrieve-integration-health <project_id>

GET /projects/{project_id}/integration-health: Diagnose a project's repository integrations

### typeship projects list-generations <project_id>

GET /projects/{project_id}/generations: List a project's generations

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same account, operation, filters, and ordering that issued it. |
| `--target-id` | string |  | Only generations for this persisted Target. |

### typeship projects generate <project_id>

POST /projects/{project_id}/generations: Generate targets and open pull requests

| flag | type | required | description |
| --- | --- | --- | --- |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

## definitions

### typeship definitions retrieve <definition_id>

GET /definitions/{definition_id}: Retrieve a Definition

### typeship definitions update <definition_id>

PATCH /definitions/{definition_id}: Update and resolve a Definition

| flag | type | required | description |
| --- | --- | --- | --- |
| `--source` | json |  |  |
| `--patches` | object[] |  |  |
| `--graphql` | json |  |  |
| `--diagnostic-policy` | object |  | Source pull-request enforcement threshold, new-versus-complete baseline, and explicitly reviewed rule or location exceptions. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

## targets

### typeship targets list <project_id>

GET /projects/{project_id}/targets: List a project's Targets

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same account, operation, filters, and ordering that issued it. |

### typeship targets create <project_id>

POST /projects/{project_id}/targets: Create an independently configured Target

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string | yes |  |
| `--definition-id` | string | yes | Unique identifier for a project's logical API Definition. |
| `--generator` | enum | yes | Generator implementation selected by a Target. This is configuration, not identity; several Targets may use the same generator. |
| `--state` | active\|disabled |  | Default: "active". |
| `--edition` | string |  | Default: "2026-08-24". |
| `--release-channel` | stable\|prerelease |  | Default: "stable". |
| `--proposed-version` | string |  | Optional larger or prerelease SemVer for the next reviewed release. |
| `--checks` | object |  | Required checks run against the complete combined package. Generated checks and customer commands share one reproducible workflow; repository_required names existing repository checks. |
| `--config` | json |  | Target-specific overrides merged over Project.config. GraphQL settings are rejected here and belong to the Definition. |
| `--deliveries` | json[] |  |  |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship targets retrieve <target_id>

GET /targets/{target_id}: Retrieve a Target

### typeship targets delete <target_id>

DELETE /targets/{target_id}: Delete an unused Target (destructive: needs --force)

### typeship targets update <target_id>

PATCH /targets/{target_id}: Update a Target, its Deliveries, or its next reviewed version

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string |  |  |
| `--state` | active\|disabled |  |  |
| `--edition` | string |  |  |
| `--release-channel` | stable\|prerelease |  |  |
| `--proposed-version` | string |  |  |
| `--checks` | object |  | Required checks run against the complete combined package. Generated checks and customer commands share one reproducible workflow; repository_required names existing repository checks. |
| `--config` | json |  | Target-specific overrides merged over Project.config. GraphQL settings are rejected here and belong to the Definition. |
| `--deliveries` | json[] |  |  |

### typeship targets list-releases <target_id>

GET /targets/{target_id}/releases: List immutable releases for a Target

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same account, operation, filters, and ordering that issued it. |

### typeship targets retrieve-draft <target_id>

GET /targets/{target_id}/draft: Retrieve a Target's rolling Draft release

### typeship targets update-draft <target_id>

PATCH /targets/{target_id}/draft: Select an exact Draft version or return to automatic versioning

| flag | type | required | description |
| --- | --- | --- | --- |
| `--body-version` | string | yes | Exact SemVer, or null to return to automatic selection. |
| `--expected-revision` | number |  |  |

### typeship targets retrieve-customizations <target_id>

GET /targets/{target_id}/customizations: Inspect preserved custom code for a Target Draft

### typeship targets reset-customizations <target_id>

POST /targets/{target_id}/customizations/reset: Resolve or reset custom code on the rolling Draft

### typeship targets adopt-release <target_id>

POST /targets/{target_id}/adopt: Adopt a verified existing package as Current

| flag | type | required | description |
| --- | --- | --- | --- |
| `--body-version` | string | yes | Exact already-published package version to make Current. |
| `--tag` | string | yes | Immutable repository tag containing the matching package source. |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

### typeship targets retrieve-release <target_release_id>

GET /target_releases/{target_release_id}: Retrieve an immutable Target release

### typeship targets republish-release <target_release_id>

POST /target_releases/{target_release_id}/republish: Retry publication of an exact Target release

| flag | type | required | description |
| --- | --- | --- | --- |
| `--idempotency-key` | string |  | Identifies one logical write for 24 hours. The key is scoped to the authenticated account and operation; account-less generation uses a hashed network identity. Retrying the same method, path, query, and JSON body replays the original response. Reusing the key with changed intent returns 409. After expiry the key starts a new write. |

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
| `--limit` | number |  | Maximum number of resources to return. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same account, operation, filters, and ordering that issued it. |

### typeship definition-revisions retrieve <definition_revision_id>

GET /definition_revisions/{definition_revision_id}: Retrieve a Definition Revision

### typeship definition-revisions retrieve-content <definition_revision_id>

GET /definition_revisions/{definition_revision_id}/content: Retrieve a Definition Revision's canonical content

### typeship definition-revisions retrieve-document-content <definition_revision_id> <document_id>

GET /definition_revisions/{definition_revision_id}/documents/{document_id}/content: Retrieve one source document from a Definition Revision

## account

### typeship account retrieve

GET /me: The account behind the presented credentials

## api-keys

### typeship api-keys list

GET /api_keys: List API keys

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. Valid only for the same account, operation, filters, and ordering that issued it. |

### typeship api-keys revoke <api_key_id>

DELETE /api_keys/{api_key_id}: Revoke an API key (destructive: needs --force)

## Built-ins

`typeship login`, `typeship logout`, `typeship whoami`, `typeship config`, `typeship mcp`, `typeship docs`, `typeship upgrade`, `typeship completion`, `typeship help`, `typeship version`, `typeship init`, `typeship agent-guide`, `typeship auth`, `typeship doctor`
