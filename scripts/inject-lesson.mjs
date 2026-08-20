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

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, template.replace("__LESSON_JSON__", JSON.stringify(data, null, 2)));
console.log(outPath);
