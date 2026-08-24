import { readFileSync } from "node:fs";

const expected = [
  "typeship",
  "typeship-api",
  "typeship-ci",
  "typeship-cli",
  "typeship-mcp-clients",
  "typeship-spec-prep",
];

for (const name of expected) {
  const text = readFileSync(`${name}/SKILL.md`, "utf8");
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  if (!new RegExp(`^name: ${name}$`, "m").test(frontmatter)) {
    throw new Error(`${name}/SKILL.md must declare its directory as its name`);
  }
  if (!/^description: .+/m.test(frontmatter)) {
    throw new Error(`${name}/SKILL.md must declare when the skill should be used`);
  }
}

for (const path of [
  ".claude-plugin/marketplace.json",
  ".codex-plugin/plugin.json",
  ".cursor-plugin/plugin.json",
  ".mcp.json",
]) {
  JSON.parse(readFileSync(path, "utf8"));
}

for (const path of ["README.md", "LICENSE"]) readFileSync(path, "utf8");

console.log(`Validated ${expected.length} skills and every package manifest.`);
