# Contributing

## Skill contract

This is an [Agent Skill](https://agentskills.io/specification). Keep `SKILL.md` frontmatter valid (`name`, `description`). Do not summarize the workflow inside `description` — that field is **when to use**, not how.

## Versioning

[SemVer](https://semver.org/):

- **MAJOR** — break the lesson JSON contract or remove a `kind` without an alias
- **MINOR** — new node/edge kinds, layouts, or shell features
- **PATCH** — contrast, copy, inject validation, docs

Bump together:

1. `package.json` `version`
2. `SKILL.md` `metadata.version`
3. `CHANGELOG.md` (Keep a Changelog)

Tag `vX.Y.Z` when you publish.

## Build a lesson HTML

```sh
npm run palette
npm run example
```

Or:

```sh
node scripts/inject-lesson.mjs templates/lesson.html path/to/lesson.json path/to/index.html
```

Inject exits `1` if a node id is missing from every `steps[].highlight`, if `parent` is unknown, or if `via` is unknown.

## Shell lock

Do not restyle `:root` per lesson. Primary hue stays 200–320 (iris / glacier / dusk). Traffic-light hues are `--state-*` only.

Glyphs in the diagram are Lucide-style 24×24 strokes. Do not add a one-off circle as `kind: "other"`.

## Visual QA

Open `examples/palette/index.html`. Check: readable node labels, group fences, reverse/dashed/via edges, selected-step hover on the left rail. The reader has no accent control — to check that `boundary` stays error-red in every accent, change `kind` in a copy of the JSON (or set `accent`) and rebuild.

Chrome: the header names the lesson's `kind`, the Dzen toggle keeps title + transport + rail, and the inspector has a switch of its own. Both switches are session state — a reload comes back to the full layout.
