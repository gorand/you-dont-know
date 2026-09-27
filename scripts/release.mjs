#!/usr/bin/env node
// Gate for a release. It never publishes and never pushes — it answers the
// one question that matters before either: is this tree exactly what the
// version on it claims to be?
//
//   node scripts/release.mjs                    check the current checkout
//   node scripts/release.mjs --tag              also create the annotated tag
//   node scripts/release.mjs --tag -m "…"       with the tag message spelled out
//
// It is written to be runnable from a fresh clone on a machine that has
// never seen this project, including from a detached HEAD at a tag, which is
// how an older version gets published after the fact.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const valueOf = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
const WANT_TAG = has("--tag");
const SKIP_NET = has("--offline");
const MESSAGE = valueOf("--message") || valueOf("-m");

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

// The tag's own message. A release section either opens with a paragraph
// that summarises it, in which case that paragraph IS the summary, or it
// goes straight to `### Fixed` and a list — and then the section has no
// summary to borrow. Taking the first line regardless is how v0.6.3 got
// tagged "0.6.3 — - The fold/unfold mark no longer moves when you use it. It
// sat at the": a bullet, cut mid-sentence at a fixed 72 characters.
function leadParagraph(section) {
  const para = [];
  for (const raw of section.split("\n").slice(1)) {
    const line = raw.trim();
    if (!line) { if (para.length) break; continue; }   // blank closes the paragraph
    if (line.startsWith("#")) { if (para.length) break; continue; }
    if (/^[-*+]\s/.test(line)) break;                  // a list ends it, or precedes it
    para.push(line);                                   // the paragraph is wrapped: join it
  }
  return para.length ? para.join(" ") : null;
}

// Keep the whole lead when it fits — "Tooling only" alone says less than
// "Tooling only. The published artifact is byte-identical to 0.6.1." Fall
// back to its first sentence, and only then cut, on a word and never inside
// one.
function summarise(text, limit) {
  const plain = text.replace(/[*_`]/g, "").trim();
  if (plain.length <= limit) return plain.replace(/\.$/, "");
  const stop = plain.search(/\.\s/);
  const sentence = stop > 0 ? plain.slice(0, stop + 1) : plain;
  if (sentence.length <= limit) return sentence.replace(/\.$/, "");
  const cut = sentence.lastIndexOf(" ", limit);
  return sentence.slice(0, cut > 0 ? cut : limit).replace(/[,;:]$/, "") + "…";
}

if (WANT_TAG && tagState === "absent") {
  const section = changelog.split(`## [${version}]`)[1].split(/^## \[/m)[0];
  const lead = MESSAGE || leadParagraph(section);
  if (!lead) {
    console.error(`\n  FAIL  the ${version} section opens with a list, so there is no summary to`);
    console.error("        take for the tag. Give one: npm run release -- --tag -m \"…\"");
    process.exit(1);
  }
  execFileSync("git", ["tag", "-a", tag, "-m", `${version} — ${MESSAGE ? MESSAGE : summarise(lead, 96)}`]);
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
