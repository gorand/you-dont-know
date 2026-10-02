#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const [, , templatePath, jsonPath, outPath] = process.argv;

if (!templatePath || !jsonPath || !outPath) {
  console.error("usage: inject-lesson.mjs <template.html> <lesson.json> <out.html>");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf8");
const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
if (!template.includes("__LESSON_JSON__")) {
  console.error("template missing __LESSON_JSON__");
  process.exit(1);
}

const ids = (data.nodes || []).map((n) => n.id);
const idSet = new Set(ids);
const highlighted = new Set();
(data.steps || []).forEach((s) => (s.highlight || []).forEach((id) => highlighted.add(id)));
const dead = ids.filter((id) => !highlighted.has(id));
if (dead.length) {
  console.error("nodes missing from any steps[].highlight (not clickable): " + dead.join(", "));
  process.exit(1);
}
const badParent = (data.nodes || []).filter((n) => n.parent && !idSet.has(n.parent));
if (badParent.length) {
  console.error("nodes[].parent not in nodes: " + badParent.map((n) => n.id).join(", "));
  process.exit(1);
}
const badVia = (data.edges || []).filter((e) => e.via && !idSet.has(e.via));
if (badVia.length) {
  console.error("edges[].via not in nodes: " + badVia.map((e) => e.from + "->" + e.to).join(", "));
  process.exit(1);
}

const EDGE_LINES = new Set(["solid", "dashed", "dotted", "chain"]);
const badLine = (data.edges || []).filter((e) => e.line !== undefined && !EDGE_LINES.has(e.line));
if (badLine.length) {
  console.error("edges[].line is solid | dashed | dotted | chain: " + badLine.map((e) => `${e.from}->${e.to} (${e.line})`).join(", "));
  process.exit(1);
}
// A tone is a token name. Coral (`accent`) is not one of them on purpose:
// it is the live edge, and an edge painted coral at rest would read as lit.
const EDGE_TONES = new Set(["ink-soft", "ink", "primary", "accent-2"]);
const badTone = (data.edges || []).filter((e) => e.tone !== undefined && !EDGE_TONES.has(e.tone));
if (badTone.length) {
  console.error("edges[].tone is ink-soft | ink | primary | accent-2 (accent is reserved for the live edge): "
    + badTone.map((e) => `${e.from}->${e.to} (${e.tone})`).join(", "));
  process.exit(1);
}

const KNOWN_KINDS = new Set([
  "process", "child", "other",
  "start", "decision", "cloud", "queue",
  "folder", "file", "group", "junction",
  "provider", "host", "frame", "hoc", "inbox", "consumer",
  "action", "boundary", "subroutine"
]);
const badKind = (data.nodes || []).filter((n) => n.kind && !KNOWN_KINDS.has(n.kind));
if (badKind.length) {
  console.error("nodes[].kind not in the shell vocabulary: " + badKind.map((n) => `${n.id} (${n.kind})`).join(", "));
  process.exit(1);
}

const groupIds = new Set((data.nodes || []).filter((n) => n.kind === "group").map((n) => n.id));
const badCollapsed = (data.nodes || []).filter(
  (n) => n.collapsed !== undefined && (typeof n.collapsed !== "boolean" || !groupIds.has(n.id))
);
if (badCollapsed.length) {
  console.error("nodes[].collapsed is a boolean on kind:\"group\" only: " + badCollapsed.map((n) => n.id).join(", "));
  process.exit(1);
}
const badExpand = (data.steps || []).flatMap((s) => (s.expand || []).filter((id) => !groupIds.has(id)));
if (badExpand.length) {
  console.error("steps[].expand must name kind:\"group\" ids: " + badExpand.join(", "));
  process.exit(1);
}
const KNOWN_DETAIL = new Set(["auto", "progressive", "full"]);
if (data.detail && !KNOWN_DETAIL.has(data.detail)) {
  console.error(`detail "${data.detail}" is not auto | progressive | full`);
  process.exit(1);
}

// `accent` no longer paints anything — the shell has three fixed colour
// roles and `kind` only tones one dot. Failing a build over an inert field
// would be wrong, so a recognised legacy value passes in silence and
// anything else is a warning that says the field is ignored.
const LEGACY_ACCENTS = new Set(["iris", "glacier", "dusk", "cinnabar", "patina", "kinpaku"]);
if (data.accent && !LEGACY_ACCENTS.has(data.accent)) {
  console.warn(`accent "${data.accent}" is not a known value — the field is legacy and ignored either way`);
}

const asideIds = new Set((data.asides || []).map((a) => a.id));
const asideRefRe = /\[\[([A-Za-z0-9_-]+)\]\]/g;
const textFields = [data.thesis, data.problem, data.whyNotBasic, data.cost]
  .concat((data.steps || []).map((s) => s.narration));
const danglingAsides = new Set();
textFields.forEach((t) => {
  const s = String(t || "");
  let m;
  while ((m = asideRefRe.exec(s))) {
    if (!asideIds.has(m[1])) danglingAsides.add(m[1]);
  }
});
if (danglingAsides.size) {
  console.error("[[asideId]] refs with no matching asides[].id: " + [...danglingAsides].join(", "));
  process.exit(1);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
// A `</script` anywhere in the JSON (e.g. a `kind: "vuln"` lesson quoting an
// XSS payload) would otherwise close the surrounding <script> tag early.
const json = JSON.stringify(data, null, 2).replace(/<\/script/gi, "<\\/script");
fs.writeFileSync(outPath, template.replace("__LESSON_JSON__", json));
console.log(outPath);
