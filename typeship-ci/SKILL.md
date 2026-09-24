---
name: typeship-ci
description: Run typeship in a pipeline - trigger a linked Project's normal pull requests, or generate a package into the checkout the job commits. Use when the user wants typeship in GitHub Actions or another CI system.
license: MIT
allowed-tools: Bash(typeship *), Read, Write
---

# typeship in CI

A Project that delivers to repositories regenerates when its spec changes and opens the pull requests itself, so most teams do not need CI for generation. Use CI to trigger that on your own schedule, or to generate a package into the repository the job commits to. Full guide: https://typeship.dev/docs/guides/ci.md.

## Authenticate

Create an API key in the console at https://typeship.dev/console/keys and store it as the secret `TYPESHIP_TOKEN`. The CLI reads it from the environment, so the job needs no login step.

## Trigger a Project's pull requests

```yaml
- run: npm install -g @typeship-ax/cli
- run: typeship projects generate <project_id>
  env:
    TYPESHIP_TOKEN: ${{ secrets.TYPESHIP_TOKEN }}
```

This runs the same pipeline as a spec change. It records the Definition Revision, then opens or updates one pull request per changed Target, with a compatibility report and version check. The command waits for every Target and reports each result. A Target whose repository already matches reports `pr_status: no_changes` and gets no commit or pull request.

Do not write this command's output into the checkout. The pull requests already deliver the packages, and a second copy bypasses their review.

## Generate into this checkout

When the job itself owns the commit, generate one package with `--out`:

```bash
typeship generate run \
  --definition '{"url":"<spec-url>"}' \
  --target '{"generator":"typescript-sdk"}' \
  --out packages/typescript
```

Plans limit how many operations are generated. Check `limits` in the output; see https://typeship.dev/docs/reference/limits.md.

## Failures

Failures print one JSON envelope on stderr with `issues[].code`. The exit code is 1 for a failed request and 2 for a usage error. Fail the job on any non-zero exit and print stderr to the log.
