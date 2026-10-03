# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.11.0] — 2026-10-04

One action folds every group back and frames the whole diagram, through a
button that is there only once the reader has opened groups by hand.

### Added

- **Fold every group.** After a hand toggle on a group's disc, or a `Detail`
  mode other than `auto`, a button appears at the end of the zoombar. Its
  mark is the open fence's, two corners pointing in. One press folds every
  group, the current step's own included, forgets the hand toggles and the
  detail mode, and fits the whole diagram again. The button then goes away.
  `Esc` on the canvas does the same while the button is shown. At rest a
  lesson looks exactly as in 0.10.0.
- The folded overview holds for the step it was pressed on. The next step,
  or a return to this one, opens its own group as usual.

### Changed

- Hand toggles still last across steps, but they no longer pile up for good.
  Until now the only way back was `Detail`, up to three presses through "all
  open".

## [0.10.0] — 2026-10-04

The brief can be as long as the lesson needs: paragraphs, a title that stays
put while it scrolls, and the accent on every section heading.

### Added

- **A brief field can run to several paragraphs.** A blank line (`\n\n`) in
  `problem`, `whyNotBasic` or `cost` starts a new one; a single newline stays
  a space. Code chips and `[[asides]]` work inside. The brief has been its own
  dialog since 0.6.0, so the contract no longer keeps these three fields to a
  sentence or two: a hard process gets explained there at the length it
  takes. Step narration and the thesis keep their 1–2 sentences.
- **The brief's title and close button stay pinned while it scrolls**, with a
  hairline once text has gone under them. The thesis scrolls away with the
  rest, so the pinned part stays small on a phone. The arrow keys and
  PageDown scroll the brief from the close button, where focus opens.

### Changed

- **All three section headings of the brief are peach**, icon and label, not
  only the catch. Coral stays for the current material.
- The close button is centred on the title's first line, 4px higher than
  before. A one-paragraph brief otherwise sits where it did in 0.9.2, on
  every example.
- `inject-pipeline`'s cost is two paragraphs with an aside, so a shipped
  example shows both. It no longer counts "five invariants" at line numbers
  that had moved.

### Fixed

- **An aside planted in the brief opened behind it.** The pop lived outside
  the modal dialog, which sits in the top layer and makes the rest of the
  page inert: the click registered, nothing appeared, and Esc then closed the
  brief and left the pop over the page. It now opens over the brief, Esc
  closes the pop first, and scrolling the brief closes it.

## [0.9.2] — 2026-10-03

A folded group's disc waits for the pointer, its caption sits in its corner,
and the corners that mark a toggled group are neutral.

### Changed

- **A folded group's disc appears on hover or focus.** It does what a click
  on the block does, so at rest it only pulled the eye. It comes in when the
  pointer is over the block or when the block or the disc has keyboard focus,
  neutral until the disc itself is hovered. An open fence, which only its
  disc can close, and the dock keep theirs, and touch screens show it as
  before.
- **A folded group's icon and label sit in its top-left corner**, where an
  open fence carries them, instead of centred like a box of the flowchart.
  Group captions, folded or open, now hang on the icon's line; a one-line
  caption used to sit 11px below its icon.
- **The viewfinder corners that close in on a toggled group are neutral**,
  halfway between ink-soft and ink, instead of violet.

Frame and dock position match 0.9.1 on every step of every example.

## [0.9.1] — 2026-10-03

The dock's full-height button is now the same disc the group fences carry,
sitting on the dock's border where a fence's sits on its own.

### Changed

- **The button is a fence's disc.** Centred 4px below the dock's top border
  and 5px in from the right, filled with the canvas ground so it breaks the
  border line, with the fences' hover (coral) and focus (violet ring). Its
  mark is the chevron the fence discs used before their corner marks: up to
  raise the dock, down to bring it back.
- The dock no longer clips its content as a whole, so the disc is not cut
  in half; the body clips and rounds its own corners instead. Frame and dock
  position match 0.9.0 on every step of every example.

## [0.9.0] — 2026-10-03

A node can say what it is — a database, a cache, a screen, a key — with an
icon of its own, without changing its kind's shape.

### Added

- **`nodes[].icon`**, one of 28 domain-neutral names: `user` · `browser` ·
  `screen` · `component` · `terminal` · `function` · `package` · `link` ·
  `config` · `state` · `rules` · `database` · `cache` · `disk` · `lock` ·
  `key` · `route` · `server` · `request` · `response` · `broadcast` · `mail`
  · `retry` · `timer` · `limit` · `trace` · `error` · `mock`. It replaces
  only the glyph: the kind still sets the shape and the role in the flow, so
  the layout does not move (checked against 0.8.0 on every step of the four
  lessons). An icon may also name any kind's glyph. The set comes from
  Lucide 1.51.0, like the kind glyphs.
- The palette's last step shows every icon under its own name.

### Changed

- `inject-lesson.mjs` fails on an unknown `nodes[].icon` and prints the
  names it knows. It reads them from the template, so the two cannot drift.
- `dense-request`, `mfe-architecture`, `inject-pipeline` and `how-promise`
  use icons where their kind left a generic cube. No kind changed.
- SKILL.md asks for icons when writing nodes and checks for rows of
  identical cubes in visual QA.

## [0.8.0] — 2026-10-03

The dock goes to full height in one press, and shows its height controls
only on a step that has more than it can show.

### Added

- **A full-height button in the dock's head.** One press shows the whole
  step; a second takes the dock back to its usual height. The grip on the top
  edge still fine-tunes anything in between, and full height stays full when
  the window is resized. It sits in the dock's top-right corner as a single
  chevron: up while the dock can be raised, down once it is.

### Changed

- **The grip and the button appear only when the step is cut off** at the
  usual height, or at a lower one the reader set. Most steps fit (22 of 33
  across the examples at 1440×900), and on those the grip promised a change
  it could not make. The check runs on a new step, a resize and the panel
  coming back, never mid-drag. The button keeps its place when hidden, so
  titles do not re-wrap between steps; frame and dock land exactly where
  0.7.2 put them on every step of every example.
- **A step without a code excerpt lets its narration use the dock's height**
  rather than its own 11rem, so full height can show a long one whole.
- **The canvas caption "Diagram · node opens a step" is gone.** It was the
  heading of the diagram pane in 0.1's split layout; on a full-bleed canvas
  it named the obvious, and a dock at full height covered it. The svg's
  accessible name still carries it.

### Fixed

- **Space presses a focused button.** The page took Space for play/pause
  whatever had focus, so it never pressed Brief, Dzen, the panel toggle or
  zoom, and on a focused node it opened the step and started autoplay too.
- **Under 1100px, full height stops under the zoombar**, which sits at the
  top of the canvas there; a dock at full height used to cover its edge.

## [0.7.2] — 2026-10-02

The fold/unfold disc says open or close with one mark that turns inside out,
and no longer carries a count.

### Changed

- **A folded group's disc shows two viewfinder corners pointing out; an open
  fence's, the same corners pointing in.** It replaces `+N` with a chevron on
  hover (folded) and a chevron (open). The corners are the design system's,
  the same marks that close in on a group after it is toggled, so the control
  and its feedback match. Hover turns the mark coral, focus rings the disc
  violet, as before.
- **No count on the disc.** The stack behind a folded block already says
  there is more, and a numeral in a disc is how the rail draws a step. The
  number of children stays in the disc's accessible name.

## [0.7.1] — 2026-10-02

Tooling only: the release gate now works on Windows. The lesson shell and
examples are byte-identical to 0.7.0.

### Fixed

- **`npm run release` runs npm on Windows.** It started npm with
  `execFileSync("npm", …)`, which cannot launch `npm.cmd`. The build check
  reported "npm run build failed" without building anything. The registry
  check hit the same error and read it as "not published yet", so on Windows
  it passed for a version that was already on npm. npm now runs through
  `cmd.exe` on Windows; other platforms are unchanged.
- **A Windows checkout builds the same bytes as any other.** With
  `core.autocrlf=true`, the Git for Windows default, the template was checked
  out CRLF and the inject script carried that into the examples, so the
  gate's rebuild check failed on a correct tree. `.gitattributes` now checks
  out every text file as LF. No file in the repository changed.

## [0.7.0] — 2026-10-02

Three things a real lesson ran into: a dock too short for a long excerpt, a
re-layout that hid where things went, and edges that could only be solid or
dashed. Every existing lesson rebuilds untouched.

### Added

- **The dock's top edge resizes it.** Drag it, or focus it and use ↑ ↓
  (Shift for a quarter), Home and End; Enter or a double-click goes to full
  height and back. It sets a cap, not a height — a short step still shrinks
  to fit — and the cap holds across steps for the session. The diagram
  re-frames around whatever height the reader picks.
- **A re-layout shows where things went.** Folding, unfolding, or a step that
  opens another group used to cut straight to a new picture. Boxes now glide
  from where they were, unfolded children come out of their block, folded
  ones slide into it, edges fade back in once everything lands, and the group
  that was toggled gets the design system's viewfinder corners in violet.
  Reduced motion skips the glide and keeps the corners.
- **`edges[].line`**: `solid` (default) · `dashed` · `dotted` · `chain`, the
  dash-dot of a drafting centre line. `kind` now says direction only;
  `kind: "dashed"` still parses as a dashed flow.
- **`edges[].tone`**: `ink-soft` (default) · `ink` · `primary` · `accent-2` —
  a token name, never a value, with an arrowhead per tone. `accent` is
  refused at build time: coral is the live edge. A lit edge goes coral
  whatever its tone and keeps its line type.
- **`examples/mfe-architecture`**, an anonymised agent-written lesson about a
  Module Federation repo (30 nodes, 6 groups, 22 edges), kept with its flaws
  as the fixture to test shell changes against. `npm run mfe` builds it.

### Changed

- `inject-lesson.mjs` fails on an unknown `edges[].line` or `edges[].tone`
  instead of rendering the default without a word.
- Parallel edges merged into one `label ×N` keep a `line` or `tone` only
  where all of them agree.
- The palette example demonstrates every line type and tone, unlit on its
  last step and lit on the one before.

## [0.6.4] — 2026-09-27

Tooling only, and it fixes something 0.6.3 shipped with. The published
artifact is byte-identical to 0.6.3.

### Fixed

- **`npm run release --tag` no longer invents a tag message from half a
  bullet.** v0.6.3 was tagged `0.6.3 — - The fold/unfold mark no longer moves
  when you use it. It sat at the`, because the script took the first
  non-heading line of the release section and cut it at 72 characters — and
  that section opens with `### Fixed` and a list. A section either opens with
  a paragraph that summarises it, in which case that paragraph is the
  summary, or it has none to borrow; the script now refuses in the second
  case and says how to supply one.
- The lead paragraph is joined across the lines it wraps over instead of
  being read one line deep, kept whole when it fits, and cut on a word rather
  than inside one when it does not.

### Added

- `--message` / `-m` on `scripts/release.mjs`, to spell the tag message out.
- `RELEASING.md` says where a tag message comes from, and that opening a
  CHANGELOG section with a sentence of prose makes it write itself.

## [0.6.3] — 2026-09-27

### Fixed

- **The fold/unfold mark no longer moves when you use it.** It sat at the
  top-right of an open fence but dead centre on the right edge of a folded
  block, so the one control whose entire job is to toggle jumped 40px on
  every toggle. It is now the design system's numbered callout at the
  top-right corner in both states — a disc filled with the canvas ground so
  it knocks a hole in the border it straddles, which is what makes it read as
  chrome applied on top rather than as content.
- Folded, the mark used to sit in the label's own row, so a block read as a
  list item with a trailing control instead of as a container. The label gets
  back the 40px that were reserved for it.
- The right edge at mid-height is where horizontal edges arrive, and an
  arrowhead measured 6px from the old mark. Across all seven steps of
  `dense-request`, no arrowhead now lands within 6px of a disc.
- A pill with a chevron was `<select>` vocabulary in a language otherwise
  made of corner marks, callouts and dimension lines — and it dressed a count
  as a button.
- **A bare numeral did not say what it counted**, and the step rail draws an
  identical disc with a numeral in it. A folded group reads `+N` now, which
  separates it from the rail's zero-padded `04` at a glance.
- **Open and folded show different things**, because they know different
  things. Open, the children are on screen and counting them again is noise,
  while the disc is the only way to close the fence — so it carries the
  chevron alone — up to close, down to open. Folded, the count is all that is
  known about what is hidden, so it leads and the chevron arrives on hover
  and focus. Focus stays violet and outranks the coral hover.
- **A mouse click no longer leaves the system focus ring on a node.** A
  `<g tabindex="0">` is not a button, so the UA paints its own ring on a
  plain `:focus` instead of waiting for `:focus-visible`; clicking a node
  left 5px of `rgb(153, 200, 255)` — a blue absent from this palette — until
  focus moved on. Introduced in 0.6.1, where the reset only covered
  `:focus-visible`.

## [0.6.2] — 2026-09-27

Tooling only. The published artifact is byte-identical to 0.6.1.

### Added

- **`npm run release`** — a gate that runs before a version leaves the repo
  and refuses rather than warns. It checks that the version agrees across
  `package.json`, `SKILL.md` and README's badge and prose; that `CHANGELOG.md`
  documents it; that the tree is clean **and** that no untracked file sits
  inside a directory `files` publishes wholesale; that rebuilding the examples
  changes nothing, so the artifacts in the tarball are what the current
  template produces; and that the version is not already on the registry.
  It never publishes and never pushes — `--tag` adds the annotated tag once
  the rest pass, taking its message from the CHANGELOG, and it runs from a
  detached HEAD so an older version can be published after the fact.
- **`RELEASING.md`** — the procedure, written for a machine that has never
  seen this project. It leads with the fact the rest follows from: `npm
  publish` packs the working directory and ignores git entirely.

## [0.6.1] — 2026-09-27

Measured against the rendered page rather than read off the palette. No
design intent in this one — it fixes what the numbers said about 0.6.0.

### Fixed

- **The diagram is reachable from the keyboard.** Of 12 nodes, none had
  `tabindex`, a role or an accessible name — the group chevrons were wired
  but the nodes were not, so a keyboard user could fold and unfold groups and
  could not open a single step from the diagram. Every node is now
  `role="button"`, `tabindex="0"`, activated by `Enter` and `Space`, and
  named by what activating it does rather than only by its label. The `<svg>`
  itself had `role="img"` with no name and took the lesson's title.
- An expanded group fence renders as two `<g class="node">`, so only the pass
  carrying the hit rect is a control; the other is `aria-hidden`. Without
  that split one fence sat in the tab order twice under the same name.
- **Five texts were below WCAG AA** (4.5:1 for small text): line numbers
  2.91:1, the canvas marginalia and the `Ctrl`+wheel hint 3.29:1, a code
  comment 2.91:1, a code keyword 4.14:1. Now 6.69 · 5.39 · 5.39 · 5.2 · 7.17.
  Four were caused by dimming `--color-ink-soft` with `color-mix(… N%,
  transparent)`, which costs far more contrast than the percentage suggests —
  they read the token directly and lose weight to a small `opacity` instead.
  The fifth was `--color-primary` doing duty as body text, which is not its
  role; it is lifted toward the ink for code keywords only.

### Known and not fixed

- Six edge labels land on a group fence's stroke rather than in the gap
  beside it (`TLS 1.3`, `400`, `проброс`, `остаток`, `та же tx`, `201` on
  `dense-request`). That is edge routing, not styling, and it deserves its
  own pass with a geometric checker the way rounds 6 and 7 had.

## [0.6.0] — 2026-09-27

The artifact is redesigned onto the `<AG/>` design system (on-1.ru). The
`lesson.json` contract is unchanged and every existing lesson rebuilds
untouched — what changed is the shell it is poured into.

### Changed

- **The canvas is the page now.** The old three-column layout gave the diagram
  under half the screen while the inspector sat about 70% empty and the notes
  footer held ~110px hostage on every step. The canvas is full-bleed, the
  chrome floats over it: a slim top bar, a step rail in the left margin, and a
  dock for narration and code.
- **The step rail is a dimension line.** Collapsed it is the scale — a tick per
  step, the current one circled as a drafting callout, coral end caps. It opens
  its titles *over* the canvas on hover or keyboard focus, so the diagram never
  reflows to make room for them.
- **Narration and code moved into a floating dock**, and the shell now frames
  the diagram *around* it: the scale comes from the larger of the two areas
  that clear the panel, and the diagram is displaced from centre only as far as
  it takes to get out from under it. This is what fixes the clipping that
  `dense-request` showed at fit-to-screen — step 1 went from 106% and cut off
  at both edges to 75% and whole.
- **Type is Unbounded (display) / Onest (text) / JetBrains Mono (labels and
  code)**, replacing Albert Sans everywhere, on the design system's own scale.
- **The canvas graticule is one density on the layout's 16px cell**, at the
  sheet's weight, instead of a fine grid plus a heavier line every four cells.
  The edges are the loudest line on the canvas again.
- **Surfaces, radii and strokes** follow the system: void → surface →
  surface-2 for elevation, radii capped at 6px, hairline 1px / tick 1.4px /
  mark 1.5px, and the two shadows the system has. No `backdrop-filter`, no
  fourth hue, no hand-picked hex.
- **Buttons have no filled variant.** Emphasis is an accent border; a held
  toggle carries its state on a coral underline rather than on colour alone.
- A step with no `code` no longer renders an empty code block.

### Removed

- **The three accents by `kind` (iris · glacier · dusk) are gone**, and with
  them `data-accent` and the `--state-*` tokens. The system has no blue, and
  inventing one would have meant a hand-picked hex; repainting the shell coral
  or peach instead would have spent the only colour that means "act here" and
  the only one that means "careful". Colour now has three fixed roles —
  violet for focus and structure, coral for the current material, peach for
  status — and they do not trade places.
- **The notes footer is no longer part of the layout.** The thesis, the catch,
  the naive alternative, the cost and the repeats are the lesson's brief, and
  they live behind a `Бриф` / `Brief` button as a native `<dialog>`.

### Added

- **The kind is stated as a tone, not a repaint**: the dot in the kicker takes
  violet (`how` · `concept` · `api`), muted ink (`architecture` · `repo`) or
  peach (`security` · `vuln`). The chrome still names the kind in words.
- Drafting apparatus from the design system, all inert: viewfinder corner
  marks on the canvas, sheet marginalia, one static bloom under the diagram,
  the page grain, and a chevron cut line above the brief's repeats.
- `--gradient-wave` appears exactly once, as the brief's 2px top bar.

### Fixed

- `kind: "boundary"` reads as its own category again rather than as a second
  kind of highlight: dashed peach at rest, solid peach when the step is on it.
- An open group fence no longer takes the highlight colour — its children
  carry it, so a step about a five-node group stops flooding the screen.
- The narrow layout (≤1100px) is rebuilt: the rail becomes a horizontal strip
  with the rule running across it, the canvas takes real height in a two-row
  stage grid, and the dock becomes a bottom sheet.

### Compatibility

- `accent` in the lesson JSON still parses. `iris` | `glacier` | `dusk` — and
  the older `cinnabar` | `patina` | `kinpaku` — map onto a kind tone, so a
  lesson written against any earlier shell rebuilds without edits. It no
  longer repaints anything, and new lessons should leave it out.

## [0.5.4] — 2026-09-27

### Fixed

- **The contract described `decision` as a diamond.** It has rendered as the
  same rounded rect as `process`, distinguished by a Lucide fork glyph, since
  the round-3 shape pass — the rotated polygon was the one shape breaking an
  otherwise rectilinear vocabulary, and its slanted sides cramped the label.
  The shape table and the `palette` fixture's own prose had gone on saying
  diamond.
- Edge routing is described by what it does rather than by the surface token
  it used to be painted with: where two runs cross, the upper one knocks a
  hole in the lower.

### Changed

- `.playwright-mcp/` is ignored, alongside the `.playwright-cli/` that was
  already there — both are scratch output from screenshot runs.

## [0.5.3] — 2026-09-04

### Removed

- **The accent switcher is gone from the chrome.** The three swatches let a
  reader repaint the lesson, which made the accent look like a preference.
  It is not: it states what kind of lesson this is (`how` · `concept` · `api`
  → iris, `architecture` · `repo` → glacier, `security` · `vuln` → dusk), and
  a reader who repaints it has only made the shell say something untrue.
- With them goes the write to `localStorage` that recorded the choice — it
  was never read back, so it did nothing but leave a key behind.

### Added

- **The header names the lesson's kind** where the swatches used to sit next
  to it: a dot in the accent that `kind` selected, then the name, in the
  kicker's own quiet mono. `en`/`ru` like every other chrome label; a `kind`
  the shell does not know is shown as the JSON wrote it, rather than
  pretending the lesson has no type.

### Changed

- `accent` in the lesson JSON stays, and stays an **author** override:
  `iris` | `glacier` | `dusk`, applied over whatever `kind` would have
  chosen. What is gone is the reader's copy of that control.
- `--state-error` / `--state-warn` / `--state-ok` are unchanged and still
  never follow `data-accent` — verified across all seven kinds, the explicit
  override, and an unknown one.

## [0.5.2] — 2026-09-04

### Added

- **Dzen — a focus mode for the canvas.** One toggle in the chrome clears
  everything that *describes* the lesson (kicker, thesis, accent swatches,
  the notes footer, the inspector) and keeps everything that *drives* it:
  the title, the transport, and the steps rail. The canvas roughly doubles
  on a laptop (820×641 → 1280×841 at 1500×950) and gains more than that on
  a tablet, where the notes footer had been eating the page. The rail stays
  and only gets denser — 14.5rem → 12.25rem with tighter step padding, which
  keeps two-line titles readable; dropping the titles would have cost more
  than the ~40px of canvas it bought.
- **The inspector has its own switch**, in or out of Dzen. Opening the panel
  inside Dzen reveals it *without* leaving the mode — Dzen is about the
  chrome, not about the panel.

Both switches are session state and nothing else: no `localStorage`, no
query flag. A reload always comes back to the full layout.

Leaving Dzen restores the chrome the reader had on the way in, with one
exception: if they worked the inspector switch **by hand** while in Dzen,
that newer, explicit choice stands. An explicit action is never undone by a
later mode switch.

### Fixed

- Below 1100px the `body` grid's rows are all `auto`, so any leftover page
  height was shared out among them. With the notes footer and the inspector
  gone there is leftover height, and it inflated the header instead of the
  canvas — a 26px title sitting in a 183px row. Leftover height now parks at
  the bottom (`align-content: start`) and the canvas claims its share
  through its own `min-height`.

## [0.5.1] — 2026-09-04

### Fixed

- **Arrows no longer run along the boxes they pass.** The router picked the
  shape of a route from the ratio between the two node centres, not from the
  sides its ports actually sit on, so a pair of top/bottom ports could get a
  route whose horizontal legs were laid at the ports' own `y` — which IS the
  border line of every box in that row. On `dense-request` steps 3 and 4 that
  drew `route → trace` and `idem → tx` as arrows glued to the bottom edge of
  `rate` and to the top edge of `outbox`. Routing now reads the port side and
  a top/bottom pair always turns inside the corridor between the rows.
- **Two boxes stacked in one column are joined by one straight line.** Ports
  are pulled onto a shared cell centre when the two boxes overlap there, the
  slot is free on both sides and the straight run is clear — so
  `inject-pipeline`'s `phaseA → confirm`, `lessonJson → inject` and
  `wal → resp` are single lines instead of stairs with a 16px jog. Where a
  shared centre is not available and the residual offset is under two cells,
  one slanted line replaces the stair; a diagonal that would scrape a box
  (or one flat enough to read as a run along a row) still goes orthogonal.
- **An edge bound for the rail no longer holds a slot on the side it never
  uses.** Rails were decided after the ports were fanned, so a railed edge
  still took a share of its node's natural side and pushed the edges that
  stayed there off their centre — the immediate cause of most of the stairs
  above. Routing now runs in two passes: decide first, place ports second.
- **Rail edges out of one box leave through different points.** Every rail
  edge was forced onto the same mid-right port, so two of them touching one
  node started as one doubled line. Rail ports are fanned like every other
  side now.
- **A same-row edge with a sibling in between goes over the row, not through
  it.** Only edges spanning two or more rows were ever checked for
  obstruction, so a hop between neighbours in one row — `dense-request`'s
  service group reaching past the async group to the response — was drawn
  straight across the box between them. Such an edge now hops through the
  corridor; the rail stays the fallback for when the hop is blocked too.

### Changed

- Horizontal runs sit on cell centres a whole cell clear of the rows they
  pass, falling back to the half cell the ports use only in a strip too
  narrow for it. Lanes were previously placed at a fraction of the corridor,
  which in a 48px strip put the outer two 12px off the boxes beside them.
- A rail edge that has to cross its own row does it through a corridor lane
  counted together with the ordinary runs in that strip, and through the
  roomier of the corridors above and below its row. It used to slide up its
  own box's right border to a lane nobody else knew about, which both drew a
  line along that box and could land on top of an existing run.
- Lane order inside a corridor is now: runs that only reach down into it,
  then runs that cross it whole, then runs that only reach up into it. Two
  stubs at the same `x` overlapped whenever the one dropping in from the row
  above got the lower line.

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
