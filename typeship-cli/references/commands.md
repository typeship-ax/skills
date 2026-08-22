# typeship CLI commands

Generated from `typeship help --json` by scripts/check-skills.mts; do not edit. `typeship <resource> <command> --help` prints the same for one command.

## generate

### typeship generate run

POST /generate: Generate a package from a spec

| flag | type | required | description |
| --- | --- | --- | --- |
| `--spec` | object | yes | The spec to generate from. Provide exactly one of url or inline. |
| `--outputs` | enum[] | yes | Outputs for one delivery package. Choose one SDK output, or TypeScript SDK, CLI, and MCP in any combination. Linked projects can generate outputs in all ecosystems. |
| `--package-name` | string |  | npm name override for the generated package. |
| `--config` | object |  | Everything typeship needs beyond the spec, in one object: generation customization (globals, retries, pagination) and how the generated tooling behaves (cli, mcp, package, docs_url). Plain configuration. typeship never requires vendor extensions inside the spec itself. The same shape is accepted on a project and on POST /generate. |

## projects

### typeship projects list

GET /projects: List projects

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Items per page. |
| `--cursor` | string |  | Cursor of the page to fetch, from the previous page's nextPage. |

### typeship projects create

POST /projects: Create a project

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string | yes |  |
| `--spec-url` | string |  | Spec location for a URL-sourced project. Provide this or source; a project with neither has nothing to generate. |
| `--source` | object |  | Where the project's spec lives. |
| `--outputs` | enum[] | yes | First-class outputs to keep current. Any non-empty combination is valid. |
| `--packages` | object |  | Delivery packages keyed by registry ecosystem. TypeScript SDK, CLI, and MCP share npm delivery without becoming the same output. Python and Go SDKs use their own package ecosystems. |
| `--auto-regen` | boolean |  |  |
| `--spec-patches` | object[] |  |  |
| `--mcp-enabled` | boolean |  | Requires the MCP output and Enterprise. |
| `--relay-enabled` | boolean |  | Requires the CLI output and Pro. |
| `--config` | json |  |  |

### typeship projects get <project_id>

GET /projects/{project_id}: Retrieve a project

### typeship projects delete <project_id>

DELETE /projects/{project_id}: Delete a project (destructive: needs --force)

### typeship projects update <project_id>

PATCH /projects/{project_id}: Update a project

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string |  |  |
| `--spec-url` | string |  |  |
| `--source` | object |  | Where the project's spec lives. |
| `--outputs` | enum[] |  | First-class outputs; replaces the selection. Turning one off stops generating it; nothing already delivered is removed. |
| `--packages` | object |  | Delivery packages keyed by registry ecosystem. TypeScript SDK, CLI, and MCP share npm delivery without becoming the same output. Python and Go SDKs use their own package ecosystems. |
| `--auto-regen` | boolean |  |  |
| `--spec-patches` | object[] |  |  |
| `--mcp-enabled` | boolean |  | Serve this project as a hosted remote MCP endpoint. Requires the MCP output and Enterprise. |
| `--relay-enabled` | boolean |  | Enable the webhook relay so the generated CLI's webhooks listen command works for this API's users. Requires the CLI output and Pro. |
| `--config` | json |  | Replaces the whole config. Pass null to clear it. |

### typeship projects list-generations <project_id>

GET /projects/{project_id}/generations: List a project's generations

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Items per page. |
| `--cursor` | string |  | Cursor of the page to fetch, from the previous page's nextPage. |
| `--language` | typescript\|python\|go |  | Only generations for this language. |

### typeship projects generate <project_id>

POST /projects/{project_id}/generations: Generate outputs and open pull requests

### typeship projects mcp-usage <project_id>

GET /projects/{project_id}/mcp_usage: Retrieve hosted MCP endpoint usage for a project

| flag | type | required | description |
| --- | --- | --- | --- |
| `--days` | number |  | Window in days, 1 to 90. Default: 30. |

## generations

### typeship generations get <generation_id>

GET /generations/{generation_id}: Retrieve a generation

### typeship generations get-file <generation_id>

GET /generations/{generation_id}/file: Fetch one file from a generation

| flag | type | required | description |
| --- | --- | --- | --- |
| `--path` | string | yes | Repo-relative path inside the generated package. |

## spec-versions

### typeship spec-versions list <project_id>

GET /projects/{project_id}/spec_versions: List the specs this project has generated from

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Items per page. |
| `--cursor` | string |  | Cursor of the page to fetch, from the previous page's nextPage. |

### typeship spec-versions get <spec_version_id>

GET /spec_versions/{spec_version_id}: Retrieve a spec version

### typeship spec-versions get-content <spec_version_id>

GET /spec_versions/{spec_version_id}/content: Retrieve a spec version's raw text

## account

### typeship account me

GET /me: The account behind the presented credentials

## usage

### typeship usage retrieve

GET /usage: Retrieve usage for this account

## api-keys

### typeship api-keys list

GET /api_keys: List API keys

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  | Items per page. |
| `--cursor` | string |  | Cursor of the page to fetch, from the previous page's nextPage. |

### typeship api-keys revoke <api_key_id>

DELETE /api_keys/{api_key_id}: Revoke an API key (destructive: needs --force)

## Built-ins

`typeship login`, `typeship logout`, `typeship whoami`, `typeship config`, `typeship mcp`, `typeship docs`, `typeship upgrade`, `typeship feedback`, `typeship completion`, `typeship webhooks`, `typeship help`, `typeship version`, `typeship init`, `typeship agent-guide`, `typeship auth`, `typeship doctor`
