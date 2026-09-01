#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// What ships inside the installed skill directory. Deliberately separate from
// package.json "files" (the npm publish manifest) — this one must not include
// bin/ itself.
const SKILL_ENTRIES = ["SKILL.md", "LICENSE", "README.md", "CHANGELOG.md", "templates", "scripts", "references", "examples"];

const HELP = `Usage: npx you-dont-know [install] [options]

Copies this skill into an agent skills directory.

Options:
  -g, --global      Install to the user-level directory instead of the project
  --agents          Target .agents/skills (this repo's own Agent OS
                     convention / generic Agent Skills layout) instead of
                     Claude Code's .claude/skills
  --target <dir>    Install into this exact directory, ignoring --global/--agents
  -h, --help        Show this help

Defaults to the project-scoped Claude Code location:
  ./.claude/skills/you-dont-know

Examples:
  npx you-dont-know                # ./.claude/skills/you-dont-know
  npx you-dont-know --global       # ~/.claude/skills/you-dont-know
  npx you-dont-know --agents       # ./.agents/skills/you-dont-know
  npx you-dont-know --target ~/tools/you-dont-know
`;

function parseArgs(argv) {
  const opts = { global: false, agents: false, target: null, help: false };
  const args = argv.filter((a) => a !== "install");
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "-g" || a === "--global") opts.global = true;
    else if (a === "--agents") opts.agents = true;
    else if (a === "--target") opts.target = args[++i];
    else if (a === "-h" || a === "--help") opts.help = true;
    else {
      console.error(`unknown argument: ${a}\n`);
      console.error(HELP);
      process.exit(1);
    }
  }
  return opts;
}

function resolveTarget(opts) {
  if (opts.target) return path.resolve(opts.target);
  const base = opts.global ? os.homedir() : process.cwd();
  const skillsDir = opts.agents ? ".agents/skills" : ".claude/skills";
  return path.join(base, skillsDir, "you-dont-know");
}

const opts = parseArgs(process.argv.slice(2));
if (opts.help) {
  console.log(HELP);
  process.exit(0);
}

const dest = resolveTarget(opts);
const existed = fs.existsSync(dest);

for (const entry of SKILL_ENTRIES) {
  const src = path.join(pkgRoot, entry);
  if (!fs.existsSync(src)) continue;
  fs.cpSync(src, path.join(dest, entry), { recursive: true });
}

console.log(`${existed ? "Updated" : "Installed"} you-dont-know at ${dest}`);
console.log(opts.agents
  ? "This harness must read .agents/skills (or an equivalent Agent Skills layout) to discover it there."
  : "Invoke with /you-dont-know in Claude Code.");
