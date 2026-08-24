# typeship CLI commands

Generated from `typeship help --json` by scripts/check-skills.mts; do not edit. `typeship <resource> <command> --help` prints the same for one command.

## generate

### typeship generate run

POST /generate: Generate a package from a spec

| flag | type | required | description |
| --- | --- | --- | --- |
| `--spec` | json | yes | The specification for stateless generation, provided as exactly one URL or inline document. |
| `--outputs` | enum[] | yes | The one output package to generate. Linked projects can select any combination of outputs and keep each package current. |
| `--package-name` | string |  | Registry name for the selected delivery package: an npm package, Python distribution, or Go module path. Defaults to a name derived from the API title. |
| `--config` | object |  | Everything typeship needs beyond the spec, in one object: generation customization (globals, retries, pagination) and how the generated tooling behaves (cli, mcp, package, docs_url). Plain configuration. typeship never requires vendor extensions inside the spec itself. The same shape is accepted on a project and on POST /generate. |

## projects

### typeship projects list

GET /projects: List projects

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. |

### typeship projects create

POST /projects: Create a project

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string | yes |  |
| `--source` | json | yes |  |
| `--outputs` | enum[] | yes | First-class outputs Typeship will keep current for this project. |
| `--packages` | object |  | Independent delivery packages keyed by output. Every selected output owns its registry identity, version, destination pull request, and release lifecycle. Selected outputs must resolve to distinct repository-and-directory trees; the TypeScript SDK, CLI, and MCP packages must also have distinct npm names. |
| `--auto-regen` | boolean |  | Whether Typeship should regenerate automatically when the source changes. Default: false. |
| `--spec-patches` | object[] |  | Initial patches. Omit or pass an empty array for none. |
| `--mcp-enabled` | boolean |  | Serve this project as a hosted MCP endpoint. Requires the MCP output and Enterprise. Default: false. |
| `--relay-enabled` | boolean |  | Enable webhook relay sessions. Requires the CLI output and Pro. Default: false. |
| `--config` | json |  |  |
| `--idempotency-key` | string |  | Uniquely identifies this creation attempt. Retrying the same request with the same key returns the original response instead of creating another project. Reusing a key with different parameters returns 409. |

### typeship projects retrieve <project_id>

GET /projects/{project_id}: Retrieve a project

### typeship projects delete <project_id>

DELETE /projects/{project_id}: Delete a project (destructive: needs --force)

### typeship projects update <project_id>

PATCH /projects/{project_id}: Update a project

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string |  |  |
| `--source` | json |  |  |
| `--outputs` | enum[] |  | Replaces the selected outputs; delivered files are not deleted. |
| `--packages` | object |  | Independent delivery packages keyed by output. Every selected output owns its registry identity, version, destination pull request, and release lifecycle. Selected outputs must resolve to distinct repository-and-directory trees; the TypeScript SDK, CLI, and MCP packages must also have distinct npm names. |
| `--auto-regen` | boolean |  |  |
| `--spec-patches` | object[] |  | Replaces the full patch list. Pass an empty array to clear it. |
| `--mcp-enabled` | boolean |  | Serve this project as a hosted MCP endpoint. Requires the MCP output and Enterprise. |
| `--relay-enabled` | boolean |  | Enable webhook relay sessions. Requires the CLI output and Pro. |
| `--config` | json |  | Replaces the entire configuration; pass null to clear it. |

### typeship projects retrieve-github-health <project_id>

GET /projects/{project_id}/github: Diagnose a project's GitHub integration

### typeship projects list-generations <project_id>

GET /projects/{project_id}/generations: List a project's generations

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. |
| `--output` | enum |  | Only generations for this output. |

### typeship projects generate <project_id>

POST /projects/{project_id}/generations: Generate outputs and open pull requests

## generations

### typeship generations retrieve <generation_id>

GET /generations/{generation_id}: Retrieve a generation

### typeship generations retrieve-file <generation_id>

GET /generations/{generation_id}/file: Fetch one file from a generation

| flag | type | required | description |
| --- | --- | --- | --- |
| `--path` | string | yes | Repo-relative path inside the generated package. |

## spec-revisions

### typeship spec-revisions list <project_id>

GET /projects/{project_id}/spec_revisions: List specification revisions

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. |

### typeship spec-revisions retrieve <spec_revision_id>

GET /spec_revisions/{spec_revision_id}: Retrieve a specification revision

### typeship spec-revisions retrieve-content <spec_revision_id>

GET /spec_revisions/{spec_revision_id}/content: Retrieve a specification revision's raw text

## account

### typeship account retrieve

GET /me: The account behind the presented credentials

## api-keys

### typeship api-keys list

GET /api_keys: List API keys

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Maximum number of resources to return. Default: 20. |
| `--cursor` | string |  | Opaque cursor from the preceding page's next_cursor. |

### typeship api-keys revoke <api_key_id>

DELETE /api_keys/{api_key_id}: Revoke an API key (destructive: needs --force)

## Built-ins

`typeship login`, `typeship logout`, `typeship whoami`, `typeship config`, `typeship mcp`, `typeship docs`, `typeship upgrade`, `typeship feedback`, `typeship completion`, `typeship webhooks`, `typeship help`, `typeship version`, `typeship init`, `typeship agent-guide`, `typeship auth`, `typeship doctor`
