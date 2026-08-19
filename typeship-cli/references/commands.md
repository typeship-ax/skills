# typeship CLI commands

Generated from `typeship help --json` by scripts/check-skills.mts; do not edit. `typeship <resource> <command> --help` prints the same for one command.

## generate

### typeship generate run

POST /generate: Generate a package from a spec

| flag | type | required | description |
| --- | --- | --- | --- |
| `--spec` | json | yes | The spec to generate from. Provide exactly one of url or inline. |
| `--platforms` | json |  | Artifacts to generate from the spec. Defaults to [sdk]. |
| `--language` | string |  | Language to generate. Python and Go produce the SDK only; the CLI and MCP server are TypeScript artifacts and are skipped with a warning when requested alongside them. |
| `--package-name` | string |  | npm name override for the generated package. |
| `--config` | json |  | Everything typeship needs beyond the spec, in one object: generation customization (globals, retries, pagination) and how the generated tooling behaves (cli, mcp, docs_url). Plain configuration. typeship never requires vendor extensions inside the spec itself. The same shape is accepted on a project and on POST /generate. |

## projects

### typeship projects list

GET /projects: List projects

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  |  |
| `--cursor` | string |  |  |

### typeship projects create

POST /projects: Create a project

| flag | type | required | description |
| --- | --- | --- | --- |
| `--name` | string | yes |  |
| `--spec-url` | string |  | Spec location for a URL-sourced project. Provide this or source; a project with neither has nothing to generate. |
| `--source` | json |  | Where the project's spec lives. |
| `--platforms` | json |  | Artifacts to build. sdk is implied; cli and mcp require typescript among the languages. Free projects run one platform in total (one SDK language); more is a 402 until the account is on Pro. |
| `--languages` | json |  | Languages to generate. Each is a separate package, a separate pull request, a separate hosted generation, and one platform for billing. Defaults to typescript alone. |
| `--destinations` | json |  | Per-language pull-request destination, keyed by language. |
| `--package-names` | json |  | Registry name per language; unset derives from the API title. |
| `--destination` | json |  |  |
| `--auto-regen` | boolean |  |  |
| `--package-name` | string |  |  |
| `--spec-patches` | json |  |  |
| `--mcp-enabled` | boolean |  | Requires the mcp platform and Pro. |
| `--relay-enabled` | boolean |  | Requires the cli platform and Pro. |
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
| `--source` | json |  | Where the project's spec lives. |
| `--platforms` | json |  | Artifacts to build; replaces the list. Dropping cli or mcp turns off the hosted feature it serves. cli and mcp require typescript among the languages. Turning a platform off stops generating it; nothing already delivered is removed. |
| `--destination` | json |  |  |
| `--languages` | json |  | Languages to generate; replaces the list. Each is its own hosted generation and one platform for billing. |
| `--destinations` | json |  | Per-language pull-request destination, keyed by language. |
| `--package-names` | json |  | Registry name per language; unset derives from the API title. |
| `--auto-regen` | boolean |  |  |
| `--package-name` | string |  |  |
| `--spec-patches` | json |  |  |
| `--mcp-enabled` | boolean |  | Serve this project as a hosted remote MCP endpoint. Requires the mcp platform and Pro. |
| `--relay-enabled` | boolean |  | Enable the webhook relay so the generated CLI's webhooks listen command works for this API's users. Requires the cli platform and Pro. |
| `--config` | json |  | Replaces the whole config. Pass null to clear it. |

### typeship projects list-generations <project_id>

GET /projects/{project_id}/generations: List a project's generations

| flag | type | required | description |
| --- | --- | --- | --- |
| `--limit` | number |  |  |
| `--cursor` | string |  |  |
| `--language` | string |  | Only generations for this language. |

### typeship projects generate <project_id>

POST /projects/{project_id}/generations: Run a hosted generation

### typeship projects mcp-usage <project_id>

GET /projects/{project_id}/mcp_usage: Retrieve hosted MCP endpoint usage for a project

| flag | type | required | description |
| --- | --- | --- | --- |
| `--days` | number |  | Window in days, 1 to 90. |

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
| `--limit` | number |  |  |
| `--cursor` | string |  |  |

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
| `--limit` | number |  |  |
| `--cursor` | string |  |  |

### typeship api-keys revoke <api_key_id>

DELETE /api_keys/{api_key_id}: Revoke an API key (destructive: needs --force)

## Built-ins

`typeship login`, `typeship logout`, `typeship whoami`, `typeship config`, `typeship mcp`, `typeship docs`, `typeship upgrade`, `typeship feedback`, `typeship completion`, `typeship webhooks`, `typeship help`, `typeship version`, `typeship init`, `typeship agent-guide`, `typeship auth`, `typeship doctor`
