# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.2] — 2026-09-01

### Fixed

- `layoutDag` (and, through it, `layoutContainers`) no longer counts
  `edges[].kind: "back"` toward a node's rank. A node that is only the
  *target* of back-edges (a loop start, e.g. `invoke` in a Phase A/B
  confirm-and-retry flow) previously drifted to the bottom of the layout
  instead of staying at rank 0, forcing its back-edges to snake across the
  whole diagram.
- `layoutContainers` (used whenever a lesson has a `kind: "group"` node) now
  ranks the whole graph once — groups and their children included — instead
  of laying out every group above a separately-ranked DAG of the remaining
  nodes. A `parent`-nested child that also sits mid-chain in the runtime
  flow (e.g. a file that is itself a pipeline step) no longer drops its
  connecting edges out of the rank computation and splits the graph into
  disconnected, side-by-side halves.
- `group` node labels no longer clip when the text wraps to two lines — the
  `foreignObject` height was hardcoded to `22px` regardless of wrapped line
  count; `layoutContainers`'s per-group header padding grew to match.

### Changed

- `kind: "decision"` no longer renders as a rotated-45° diamond — it now
  shares the same rounded-rect shell as `process`/`action`/`boundary` (the
  diamond was the one shape breaking the shell's otherwise rectilinear
  vocabulary, and its slanted sides cramped the label). Distinguished only
  by icon: Lucide `git-branch`, replacing the diamond glyph. The JSON
  contract (`kind: "decision"`) is unchanged — this is a shell-only
  rendering change.
- `prefers-reduced-motion: reduce` now also stops the SVG `<animateMotion>`
  token on live edges (previously only CSS transitions/animations were
  gated) — a static dot marks the live edge instead.
- Added `touch-action: manipulation` and a pressed/active state
  (`:active { transform: scale(...) }`) to every clickable surface that was
  missing one (nodes, rail steps, accent swatches, aside `.fn` buttons).
- Added `text-wrap: balance` on the lesson `h1` and a
  `<meta name="theme-color">` matching `--lacquer`.
- Widened default node spacing in the DAG/grouped layout
  (`gapX` 28→40, `gapY` 88→104) to give edge routing more room.

## [0.3.1] — 2026-09-01

### Changed

- npm package renamed `you-dont-know` → `@gorand/you-dont-know` (avoids a
  registry-name collision; unscoped `you-dont-know` was never published).
  The installed skill folder and the `/you-dont-know` command are unaffected —
  only the npm package identity changes.
- `package.json`: added `publishConfig.access: "public"` so a future
  `npm publish` of the scoped package defaults to public. `private: true`
  is left in place — publishing is a deliberate future step, not this one.
- README: added a `## Roadmap` section and an "npm: not yet published"
  badge; install instructions now run `node bin/install.mjs` from a local
  clone, with the `npx @gorand/you-dont-know` form documented for once it
  is published.

## [0.3.0] — 2026-09-01

### Added

- `bin/install.mjs` — an `npx you-dont-know` installer. Defaults to the
  project-scoped Claude Code location (`./.claude/skills/you-dont-know`);
  `--global` targets `~/.claude/skills/you-dont-know`; `--agents` targets
  the `.agents/skills` layout instead; `--target <dir>` overrides both.
  Not yet published to npm — run it from a local clone
  (`node bin/install.mjs`) until it is.
- `package.json` `bin` entry and `engines.node >= 18`.

### Changed

- README: install instructions now lead with Claude Code (`npx
  you-dont-know`) and note that Claude Code does not read `.agents/skills` —
  that path is documented as the Agent-Skills-spec-generic fallback, not
  the primary path.

## [0.2.3] — 2026-08-31

### Fixed

- `inject-lesson.mjs` escapes `</script` before writing the JSON into `templates/lesson.html` — a `kind: "vuln"` lesson quoting an XSS payload in `code.text` no longer truncates the embedding `<script>` tag
- Node SVG class (`kind-*`) now derives from the canonical kind (after alias resolution) instead of the raw JSON value, so `child` / `other` / `hoc` / `consumer` nodes cannot silently miss a `kind-*` rule that only targets the canonical name
- Removed the now-dead alias entries in `KIND_ICON` (`hoc`, `consumer`, `child`, `other`) — glyph lookup always runs on the canonical kind already

### Added

- `inject-lesson.mjs` rejects an unknown `nodes[].kind`, an `accent` outside `iris` | `glacier` | `dusk`, and a `[[asideId]]` reference with no matching `asides[].id`

### Changed

- `references/lesson-contract.md`: `lang` now documents that shell chrome only ships `en` / `ru` translations; other values render English chrome around content written in another language

## [0.2.2] — 2026-08-20

### Changed

- `folder` card is a rounded rect (Lucide folder glyph + label). No tab polygon — arrows hit the box like `process`.

## [0.2.1] — 2026-08-20

### Removed

- Polygon shells `data`, `document`, `store`, `cpu` (artifacts; ortho arrows missed the outline)

### Changed

- `cloud` is a stadium card with the Lucide cloud glyph, not a freehand blob

## [0.2.0] — 2026-08-20

### Added

- Flowchart shapes: `start`, `decision`, `data`, `document`, `store`, `cloud`, `cpu`, `queue`, `folder`, `file`, `group`, `junction`, `subroutine`
- Group fences (`kind: "group"` + `nodes[].parent`)
- `layout: "tree"` for folder/file indent
- Edge kinds `dashed` | `back` | `both` and `edges[].via`
- Lucide 24×24 outline glyphs (`currentColor`, stroke 2)
- Debug lesson `examples/palette/`
- SemVer in `package.json` and skill `metadata.version`

### Changed

- Selected step in the left rail has a stronger hover than the selected rest state
- `child` / `other` alias `process`; `hoc` aliases `frame`; `consumer` aliases `inbox`

### Fixed

- Default “other” glyph is no longer a 2px circle

## [0.1.0] — 2026-08-20

### Added

- Locked lacquer shell, iris / glacier / dusk accents, inject script, how-promise example
