---
name: typeship-ci
description: Run typeship in a pipeline - regenerate a linked project on a schedule and commit the packages, generate ad hoc from a spec, or gate a release on spec drift with a generated CLI's --validate. Use when the user wants typeship in GitHub Actions or another CI system.
license: MIT
allowed-tools: Bash(typeship *), Read, Write
---

# typeship in CI

Linked projects with a destination regenerate on their own and open pull requests, so most teams need no CI for generation. Use CI to commit packages alongside an app, build them into an image, or gate a release. Full page: https://typeship.dev/docs/guides/ci.md.

Key: create one in the console (`https://typeship.dev/console/keys`), store it as the secret `TYPESHIP_TOKEN`. The CLI reads it from the environment; no login step.

## Regenerate a project and commit

```yaml
- run: npm install -g typeship
- run: typeship projects generate prj_... > generations.json
  env: { TYPESHIP_TOKEN: ${{ secrets.TYPESHIP_TOKEN }} }
- run: |
    node -e '
      const fs=require("fs"),path=require("path");
      for (const g of JSON.parse(fs.readFileSync("generations.json")).data) {
        if (g.status!=="succeeded") { console.error(g.language,g.error); process.exit(1); }
        for (const f of g.files) { const p=path.join("packages",g.language,f.path); fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,f.content); }
      }'
```

Large generations return `files_omitted: true` with `files_index`; fetch each with `typeship generations get-file <id> --path <p>`.

## Ad hoc, no project

`typeship generate run --spec '{"url":"..."}' --language typescript --out packages/typescript` (anonymous: first 25 operations).

## Spec drift gate

A generated CLI's `--validate` checks live responses against the spec: `node packages/typescript/dist/cli.js accounts list --validate --limit 5`.

## Envelope in logs

Failures are one JSON envelope on stderr with `issues[].code`; exit 1 for a failed request, 2 for usage. Fail the job on non-zero and print stderr.
