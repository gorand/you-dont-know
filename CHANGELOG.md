# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] — 2026-09-03

### Changed

- **The layout runs on one grid.** Every box, gap and pad is now a whole
  number of a single 16px cell (node 192×64, column gap 96, row gap 112,
  collapsed group 240×96), and the canvas paints that same unit — a faint
  line every cell, a readable one every four, both dropping to the coarse
  layer alone below ~0.55 scale. Before, the drawn grid was 24px while the
  layout ran on 40 / 52 / 104 / 16: the lines described nothing, and a
  same-row arrow got 40px of run to carry a label that needed more. Node
  edges now land on drawn lines and a horizontal edge has six cells.
- **Horizontal edge runs are routed into corridors.** The strip between two
  rows of nodes is computed from the finished layout, and every horizontal
  segment is placed inside it, one lane per edge per corridor. The old
  router put the run at a fraction of the whole vertical distance, so an
  edge crossing three ranks laid its horizontal segment straight across the
  middle row's boxes.
- **Ports sit on cell centres, never on cell lines.** Since every box edge
  is on a line, each vertical run now keeps half a cell of clearance from
  every border instead of grazing one — arrows read as going between the
  boxes rather than along them. Ports that collide after snapping are
  pushed apart by a whole cell.
- Any edge that skips a row — not just a back-edge — leaves for the
  right-hand rail when its natural route would cut through a node. Corridor
  routing keeps adjacent-rank edges clear on their own, so fewer edges
  reach the rail than before despite the wider net.
- Edge labels are pushed clear of node boxes, not only of other labels. One
  could previously land on a node, most visibly inside a group where the
  corridors are short.

### Fixed

- A node reached only by `kind: "back"` edges no longer defaults to rank 0,
  i.e. the top row. Back-edges are excluded from ranking (they are
  loop-backs, not dependencies), which left such a node with no rank at
  all: a dead-letter queue hanging off a consumer sat above the request
  that produces it, and since a group unit takes the lowest rank among its
  children, it hoisted the whole async tail up there with it. Such a node
  is now parked level with whatever loops back into it.
- When a cycle stalls the ranking pass, the node released first is the one
  furthest along the flow rather than the shallowest. Releasing the
  shallowest handed rank 0 to a node the whole graph feeds into.

## [0.4.0] — 2026-09-03

### Added

- **Canvas viewport.** The diagram is a pannable, zoomable board instead of
  a picture scaled to fit. `Ctrl`/`⌘` + wheel zooms at the cursor (trackpad
  pinch included), `Shift` + wheel pans sideways, a plain wheel pans,
  dragging empty canvas moves it, and two-finger pinch works on touch.
  Keys: `+` `-` `0` (fit) `1` (100%) `2` (zoom to the current step), bare or
  with `Ctrl`/`⌘`. A zoombar in the canvas corner does the same by mouse and
  reads out the current scale. The background grid pans and zooms with the
  content, so the surface reads as one board.
- **Staged detail.** A `kind: "group"` node can now stand in FOR its
  children instead of fencing them: collapsed it draws as one solid block
  with a child count and a chevron, and every edge that touched a hidden
  child re-anchors onto it (edges wholly inside the group disappear,
  parallel ones merge into `label ×N`). On a complex diagram (more than one
  collapsible group and >12 nodes or >14 edges) groups start folded and each
  step opens exactly the group it narrates — the top level becomes a handful
  of large shapes with detail one step, or one click, away. Below that
  threshold nothing changes.
- New contract keys, all optional: `detail` (`auto` | `progressive` |
  `full`), `nodes[].collapsed` on a group, `steps[].expand`. Validated by
  `inject-lesson.mjs`.
- A canvas-wide `Detail` switch (`auto` · `all` · `step`), hidden when the
  lesson has no collapsible group.
- Clicking a folded block's body opens it. A closed container's first
  meaning is "open me"; its step stays reachable from the rail and from the
  fence once open. An expanded fence opens its step on a body click as
  before.
- `examples/dense-request/` — 31 nodes across 6 groups, the reference for
  staged detail and the viewport (`npm run dense`).

### Changed

- Auto-framing replaces unconditional fit-to-screen. Until the reader
  touches the canvas the shell frames each step itself: fit-to-screen while
  that stays legible, otherwise the step's own nodes. After a manual zoom or
  pan the frame belongs to the reader — it only follows when the current
  step's nodes would sit off screen entirely.
- A collapsed group is laid out larger than a leaf node, so the folded level
  reads as containers rather than more of the same boxes.

### Fixed

- Folding or unfolding a group no longer re-frames the canvas onto the
  current step. A disclosure toggle is the reader navigating away from that
  step on purpose; auto-framing dragged them straight back. Toggling now
  keeps the frame and the scale, and corrects the view only when what was
  just opened would not fit on screen — centring on that group, never on the
  step.
- `computeRank` no longer strands nodes at rank 0 when the graph contains a
  cycle. Kahn's pass stalls on one, which put every node behind the cycle in
  the first row; it now breaks the cycle at the node with the fewest unmet
  dependencies and keeps ranking. Folding a group makes cycles easy to
  create (a service and a storage group that merely exchange edges collapse
  into an A⇄B pair), but the bug predates it and affected any cyclic lesson.

## [0.3.3] — 2026-09-02

### Fixed

- Long `kind: "back"` edges no longer draw straight through every
  intervening node between source and target. A new `pathBlocked()` check
  runs an edge's normal route past every other node's bounding box first
  (excluding `kind: "group"` containers, which edges legitimately cross to
  reach a nested child); only a route that actually cuts through something
  reroutes onto a dedicated vertical rail to the right of the widest node,
  one rail per rerouted edge. A short, local back-edge between two
  siblings keeps its original compact route unchanged.
- A `kind: "group"` node's caption text no longer loses to an edge that
  merely passes through the group on its way to a nested child. The
  group's fence rect still draws before edges (its translucent fill would
  otherwise wash out real children placed on top of it), but the icon and
  label now draw after — same pass as every other node's content — so no
  line can paint over the text anymore.
- `nudgeLabel`'s overlap check compared every edge label's `x` as a box
  *center*; `text-anchor: start` labels (any vertical edge) actually draw
  rightward *from* `x`, so two labels close together in `x` could pass the
  check while still visibly overlapping on screen. Fixed to compare true
  left-edge boxes.
- `layoutContainers`'s inter-rank gap (36px) had exactly enough room for
  one edge label, not two stacked ones (e.g. a validate step branching
  into a valid/invalid pair) — the second label had nowhere to go but into
  the next rank's node. Widened to 60px.

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
