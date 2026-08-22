---
name: typeship-ci
description: Run typeship in a pipeline - trigger a linked project's normal destination pull request, generate ad hoc from a spec into a checkout, or gate a release on spec drift with a generated CLI's --validate. Use when the user wants typeship in GitHub Actions or another CI system.
license: MIT
allowed-tools: Bash(typeship *), Read, Write
---

# typeship in CI

Linked projects with a destination regenerate on their own and open pull requests, so most teams need no CI for generation. Use CI to commit packages alongside an app, build them into an image, or gate a release. Full page: https://typeship.dev/docs/guides/ci.md.

Key: create one in the console (`https://typeship.dev/console/keys`), store it as the secret `TYPESHIP_TOKEN`. The CLI reads it from the environment; no login step.

## Trigger the project's normal pull request

```yaml
- run: npm install -g typeship-ax
- run: typeship projects generate prj_...
  env: { TYPESHIP_TOKEN: ${{ secrets.TYPESHIP_TOKEN }} }
```

This runs the same URL- or repository-sourced project pipeline as a spec push: it records history and a spec version, then opens one pull request per changed destination with the compatibility report and semver check. A destination whose complete generated tree already matches reports `pr_status: no_changes` and gets no commit, branch, or pull request. Do not unpack and recommit this response; that would bypass the destination workflow you configured.

## Generate into this checkout

Use the stateless command when this CI job owns the commit: `typeship generate run --spec '{"url":"..."}' --outputs '["typescript-sdk"]' --out packages/typescript`. Anonymous and Free runs cover the first 25 operations; stateless runs do not use a linked-project slot.

## Spec drift gate

A generated CLI's `--validate` checks live responses against the spec: `node packages/typescript/dist/cli.js accounts list --validate --limit 5`.

## Envelope in logs

Failures are one JSON envelope on stderr with `issues[].code`; exit 1 for a failed request, 2 for usage. Fail the job on non-zero and print stderr.
