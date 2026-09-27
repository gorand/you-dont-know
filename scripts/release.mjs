#!/usr/bin/env node
// Gate for a release. It never publishes and never pushes — it answers the
// one question that matters before either: is this tree exactly what the
// version on it claims to be?
//
//   node scripts/release.mjs            check the current checkout
//   node scripts/release.mjs --tag      also create the annotated tag
//
// It is written to be runnable from a fresh clone on a machine that has
// never seen this project, including from a detached HEAD at a tag, which is
// how an older version gets published after the fact.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const args = new Set(process.argv.slice(2));
const WANT_TAG = args.has("--tag");
const SKIP_NET = args.has("--offline");

const git = (...a) => execFileSync("git", a, { encoding: "utf8" }).trim();
// Asking about a tag that is not there is an expected answer, not an error —
// git still prints "unknown revision" to stderr on the way to the exception.
const gitQuiet = (...a) => execFileSync("git", a, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
const problems = [];
const notes = [];
const fail = (m) => problems.push(m);
const ok = (m) => notes.push("  ok    " + m);

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const version = pkg.version;
const tag = "v" + version;

// ---- 1. the version is stated in four places and they must agree ----------
// README carries it twice (badge and prose) and SKILL.md once in front
// matter; a release that bumped only package.json has shipped before.
const claims = [
  ["package.json", version],
  ["SKILL.md", (fs.readFileSync("SKILL.md", "utf8").match(/^\s*version:\s*"([^"]+)"/m) || [])[1]],
  ["README.md badge", (fs.readFileSync("README.md", "utf8").match(/version-([0-9][^-]*)-violet/) || [])[1]],
  ["README.md prose", (fs.readFileSync("README.md", "utf8").match(/Current:\s*\*\*([^*]+)\*\*/) || [])[1]],
];
const disagree = claims.filter(([, v]) => v !== version);
if (disagree.length) fail(`version disagrees: ${disagree.map(([w, v]) => `${w}=${v ?? "не найдено"}`).join(", ")} vs package.json=${version}`);
else ok(`version ${version} agrees across ${claims.length} files`);

// ---- 2. the changelog has a section for it -------------------------------
const changelog = fs.readFileSync("CHANGELOG.md", "utf8");
if (!new RegExp(`^## \\[${version.replace(/\./g, "\\.")}\\]`, "m").test(changelog)) {
  fail(`CHANGELOG.md has no "## [${version}]" section`);
} else ok(`CHANGELOG.md documents ${version}`);

// ---- 3. nothing uncommitted, and nothing untracked inside the tarball ----
// `files` in package.json is an allowlist, but it takes whole directories:
// an untracked file inside examples/ or templates/ ships silently. That is
// how a scratch *.next.html would have got into a published package.
const dirty = git("status", "--porcelain");
if (dirty) fail("working tree is not clean:\n" + dirty.split("\n").map((l) => "        " + l).join("\n"));
else ok("working tree clean");

const packedDirs = (pkg.files || []).filter((f) => f.endsWith("/"));
const untracked = git("ls-files", "--others", "--exclude-standard").split("\n").filter(Boolean);
const leaking = untracked.filter((f) => packedDirs.some((d) => f.startsWith(d)));
if (leaking.length) fail("untracked files inside packaged directories: " + leaking.join(", "));
else if (packedDirs.length) ok(`no untracked files under ${packedDirs.join(", ")}`);

// ---- 4. the shipped examples are what this template actually produces ----
// examples/ is published, so a stale index.html is a wrong artifact in the
// tarball rather than a cosmetic lapse.
try {
  execFileSync("npm", ["run", "build"], { stdio: "pipe" });
  const after = git("status", "--porcelain");
  if (after && after !== dirty) fail("rebuilding changed the examples — the published ones were stale:\n" + after.split("\n").map((l) => "        " + l).join("\n"));
  else ok("examples reproduce from the template");
} catch {
  fail("npm run build failed");
}

// ---- 5. this version is not already on the registry ----------------------
if (SKIP_NET) notes.push("  skip  registry check (--offline)");
else {
  try {
    execFileSync("npm", ["view", `${pkg.name}@${version}`, "version"], { stdio: "pipe" });
    fail(`${pkg.name}@${version} is already published — bump the version`);
  } catch {
    ok(`${pkg.name}@${version} is not on the registry yet`);
  }
}

// ---- 6. the tag ----------------------------------------------------------
const head = git("rev-parse", "HEAD");
let tagState = "absent";
try {
  const at = gitQuiet("rev-list", "-n1", tag);
  tagState = at === head ? "here" : "elsewhere";
  if (tagState === "elsewhere") fail(`${tag} already exists and points at ${at.slice(0, 8)}, not HEAD ${head.slice(0, 8)}`);
  else ok(`${tag} is on HEAD`);
} catch {
  notes.push(`  todo  ${tag} does not exist yet`);
}

// ---- report --------------------------------------------------------------
console.log(`\n${pkg.name} ${version} — ${head.slice(0, 8)}\n`);
notes.forEach((n) => console.log(n));
if (problems.length) {
  console.log("");
  problems.forEach((p) => console.error("  FAIL  " + p));
  console.error(`\n${problems.length} problem(s). Nothing was tagged.`);
  process.exit(1);
}

if (WANT_TAG && tagState === "absent") {
  const headline = (changelog.split(`## [${version}]`)[1] || "").split("\n").slice(1).find((l) => l.trim() && !l.startsWith("#")) || "";
  execFileSync("git", ["tag", "-a", tag, "-m", `${version} — ${headline.trim().replace(/[*_`]/g, "").slice(0, 72)}`]);
  console.log(`\n  made  annotated tag ${tag}`);
}

console.log(`
All checks passed. Nothing has been published or pushed — do that yourself:

  git push origin ${tag}
  npm publish

Publishing an older version later, from any machine:

  git checkout ${tag} && npm run build && npm publish

Publish in ascending version order, or npm's "latest" ends up on whichever
went last: npm dist-tag add ${pkg.name}@<newest> latest
`);
