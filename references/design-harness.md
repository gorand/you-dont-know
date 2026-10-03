# Design harness — for iterating on `templates/lesson.next.html`

Working checklist assembled from external design skills, filtered down to what
actually applies to this artifact: **one self-contained HTML file, vanilla
CSS/JS, a hand-rolled SVG node-diagram engine, no framework, no build step,
Google Fonts as the only external dependency.** Most external skills assume
React/Tailwind/GSAP marketing sites — those parts are excluded below, not
silently skipped.

## Precedence

1. `SKILL.md` — Hard gates, Colour roles, Rationalizations. Always wins.
2. This checklist — fills gaps SKILL.md doesn't cover (a11y, motion,
   typography mechanics, touch). Never contradicts #1.
3. Anything else (external skill, personal taste) — proposal only, filtered
   through 1 and 2 before it touches the file.

## Sources and what was kept

| Source | Kept | Rejected / N/A |
|---|---|---|
| [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) | a11y, motion, typography, dark-mode, touch, hover-state rules below — all framework-agnostic | React/Next-specific items (hydration, `nuqs`, virtualization — no lists >50 items here) |
| [taste-skill](https://github.com/leonxlnx/taste-skill) (`design-taste-frontend`) | shape-consistency lock, color-consistency lock, button-contrast check, tactile `:active` feedback | Everything under hero/bento/marquee/eyebrow/serif/GSAP — the skill's own scope note excludes "dashboards, data tables, multi-step product UI," which is what this artifact is |
| [on-1.ru/ai-skills.md](https://on-1.ru) | the *process*: filter every external suggestion through the project's own lock before applying | Its concrete rules (fonts, hex colors, Framer Motion) — for a different project |
| Anthropic Canvas Design skill | nothing operational — "stay original" duplicates SKILL.md's own Rationalizations table | — |
| [21st.dev](https://21st.dev) | nothing — React/Tailwind/shadcn component-copy workflow, incompatible with a single dependency-free HTML file and the Artifact CDN allowlist | entire mechanism |

Rounds 1–7 below are a dated log and are left as they were written. Where
they name a surface token (`--lacquer`, `--raised`, `--graphite`) or a region
(`.inspector`, `.notes`), read Round 8: the shell was re-based on the `<AG/>`
design system and those names are history. The *rules* they establish still
stand; only the vocabulary moved.

## Checklist

### Accessibility
- [x] Every clickable SVG node (`.node`) is keyboard-reachable: `tabindex="0"`, `role="button"`, `aria-label`, and responds to `Enter`/`Space`, not just `click` — done in round 9, three rounds after it was first written down. The name says what activating it *does*, not only what it is called. Two things this turned up: an expanded fence renders as two `<g class="node">` and only the late pass (the one with the hit rect) may be a control, and the SVG itself had `role="img"` with no name.
- [x] Icon-only controls get `aria-label`, not just `title` — the chrome toggles do. (The accent swatches that first raised this are gone; the accent follows `kind`.)
- [x] A control that toggles chrome (Dzen, the inspector panel) carries
  `aria-pressed` and an `aria-label` that says what it does, both re-read
  from the `UI` strings so `en`/`ru` stay covered. The Dzen button's name
  changes with its state ("Focus mode…" / "Leave focus mode"), the
  inspector's does not — its `aria-pressed` already carries the state.
- [x] Chrome toggles are real `<button>`s, so `Enter`/`Space` activate them
  without extra key handling. Only `Enter` was ever true until round 13: the
  page's own key handler took `Space` for play on any focused element. The
  original "verified in Playwright" covered one key and claimed both.
- [ ] Decorative `<svg class="ico">` stay `aria-hidden="true"` (already true — keep it true for any new icon).
- [x] `:focus-visible` ring stays visible on every new interactive element (nodes included) — the global `outline` is not dependable on an SVG `<g>`, so the ring is carried on the shape: `.node-shell` for an ordinary node, `.hit` for a fence whose shell is in the other pass.

### Motion
- [x] `prefers-reduced-motion: reduce` must stop the SVG `<animateMotion>` token on live edges too — done via `REDUCE_MOTION` + `tokenMark()` (JS `matchMedia` check; static dot instead of `<animateMotion>`).
- [x] Keep animating only `transform`/`opacity`-equivalent properties; never `transition: all` (already true, verified — no rule found).
- [ ] Any new animation must be interruptible (user can navigate mid-transition without visual glitch).

### Typography
- [x] Ellipsis character `…`, never `...` (verified — no literal `...` in chrome copy).
- [x] `text-wrap: balance` on `h1`.
- [x] Numbers that are compared/aligned (counter, line numbers) stay `font-variant-numeric: tabular-nums` (already true).

### Dark mode / meta
- [x] `<meta name="theme-color">` matches the page ground — `#0b0712`, i.e. `--color-bg`, since Round 8.
- [x] `color-scheme: dark` stays on `html` (already true).

### Touch
- [x] `touch-action: manipulation` on nodes, `.ctrl`, `.step`, `.fn`.
- [x] A chrome mode that removes page rows has to be re-checked at ≤1100px.
  Round 8 hit exactly this again from the other side: `body` kept a row
  template wider than its new child count, `.stage` resolved to `auto`, and
  the canvas took no height at all. Any change to `body`'s children needs its
  `grid-template-rows` re-counted, in both media queries.

### Shape / color / tactile (taste-skill subset)
- [x] One corner-radius scale (`--r`) for rects; circular exceptions (the kind dot, junction nodes, `.fn`) stay the only documented exception — verified, not changed.
- [ ] `.ctrl.primary` text-on-background contrast ≥ 4.5:1 — verify after any palette tweak, not just at accent-lock time.
- [x] Every clickable surface (node, step, button, aside `.fn`) has a visible pressed/active state — `:active { transform: scale(...) }` added where missing (nodes, rail steps, `.fn`); `.ctrl` already had it. Chrome toggles add a held state on top of that (`aria-pressed`, filled).

### Sheen — tried, reverted
- [x] Spacing scale audited (`grep -oE '(padding|margin|gap): [^;]+;'`): consistent 2px-step grid off a 4/8px base (4·6·8·10·12·14·16·20·24), no stray odd values. No changes made — it was already coherent.
- [x] Tried a top-highlight sheen on `.inspector` / `.code-head` / `.pop`, and an inset gloss edge on `button.ctrl.primary`. Reverted — the only justification was "the token is named `--lacquer`," not an actual legibility/hierarchy problem the flat surfaces had. `--hairline` borders and the distinct `--lacquer`/`--raised`/`--graphite` fills already separate the zones. Don't re-add this without a concrete problem it solves (see Motion Motivation rule below, same logic applies to any visual treatment, not just animation).
- [x] Elevation is earned, not decorative. Flat: `.top`, `.stage`, node
  fills, and the rail at rest — it is a dimension line drawn on the sheet,
  with no plate under it. Raised, because each one genuinely floats over the
  canvas and has to be readable against whatever is beneath it: the dock, the
  open rail, the zoombar, the aside pop, the brief. That is the system's own
  rule — elevation by stepping the surface plus the two shadows it defines,
  and nothing else.

### Rule for future rounds
Before adding any visual treatment (shadow, gradient, gloss, elevation), name the concrete problem it fixes in one sentence. "It matches the token name" or "it looks nicer" is not a reason — see the sheen revert above.

## Round 3 — real screenshot findings (`inject-pipeline`, kind: architecture)

Found from an actual screenshot, not code reading alone:
- [x] **Group label clipping (bug).** `foreignObject` height for a `group` label was hardcoded to `22px` regardless of wrapped line count. A 2-line label (long `parent` path) got its ascenders/descenders cut. Fixed: `foH` for groups `22 → 50`, `layoutContainers` `padY` `30 → 54` so children don't collide with the taller label area.
- [x] **Decision diamond dropped.** Rotated-45° polygon was the one shape breaking the otherwise all-rectilinear (rect/pill/circle) shape language, and the slanted sides visibly cramped the label. `decision` now renders as the same rounded rect as `process`/`action`/`boundary`; distinguished only by icon (Lucide `git-branch` fork glyph, replacing the diamond icon). Contract's `kind` vocabulary and JSON shape are unchanged — this is a shell-only rendering change.

## Round 4 — second screenshot: group + DAG rank didn't compose

The round-3 back-edge fix (above) was correct but exposed a second, deeper bug: `layoutContainers` (used whenever the lesson has a `kind: "group"` node) always placed every group at the very top of the canvas, then laid out ungrouped ("outer") nodes as a *separate* `layoutDag` call below it — restricted to only the outer node ids. Any edge that routed through a grouped child (here: `confirm → lessonJson → inject`, where `lessonJson` sits inside the `slugDir` group) dropped out of the outer nodes' rank computation entirely, since `lessonJson` wasn't in that restricted id set. Result: the outer graph silently split into two disconnected components (`{invoke, phaseA, confirm}` and `{inject, validate, boundary, replace, output, browser}`), both computed their own independent rank-0 root, and got laid out side by side instead of as one sequence — while the group (rank-wise in the middle of the flow) was pinned above everything regardless.

Fixed: extracted `computeRank()` as a shared helper (also used by the now-simplified `layoutDag`), and rewrote `layoutContainers` to rank the **whole graph** once (groups and their children included), give each group a rank equal to the minimum rank among its children, then place groups and ungrouped nodes as one set of units sorted by that shared rank — same row for equal rank, packed left-to-right with the previous ~760px wrap width preserved. Verified outside the browser (no DOM needed — `computeRank`/`layoutContainers`/`layoutDag` are pure functions) against both `inject-pipeline` (rows now read `invoke → phaseA → confirm → slugDir(group) → inject → validate → boundary+replace → output → browser`, no coordinate collisions) and `palette` (three independent groups, no rank-linking edges between them, still land in their own rows same as before — not a regression).

- [x] **Collinear/tangled edges — root cause found.** Widening spacing alone (previous round) didn't fix it. Real cause: `layoutDag`'s rank/BFS counted `kind: "back"` edges as normal rank dependencies. A node that is only the *target* of back-edges (here: `invoke`, receiving two back-edges from `confirm` and `boundary`) never seeds the initial zero-indegree queue, so it only gets ranked once its (very late) back-edge sources are processed — it drifts to the bottom of a top-to-bottom flow instead of staying at rank 0 where it belongs. That single misplaced node was what forced both back-edges to snake across the entire canvas and tangle with everything in between. Fixed: `layoutDag` now skips `kind: "back"` edges when building `incoming`/`outs` for ranking (rendering is untouched — back-edges still draw normally afterward). Verified outside the browser by extracting `layoutDag` and running it standalone against `inject-pipeline/lesson.json`: ranks now read `invoke=0, phaseA=1, confirm=2, lessonJson=3, inject=4, validate=5, boundary=6, replace=6, output=7, browser=8` — matches the intended top-to-bottom flow.

## Round 5 — third screenshot: still open, promoted anyway

Rank is now correct top-to-bottom (round 4 fixed it). Remaining, **not** fixed this round:

- [ ] **Long back-edges draw straight through the column.** With `invoke` correctly back at rank 0, its two incoming `back`-edges (from `confirm`, from `boundary`) now have to span the full height of the diagram. Because every node in this lesson's outer column shares nearly the same `x`, `orthoPath`'s straight-line shortcut (`Math.abs(p.x - q.x) < 1.5`) draws them as one line running directly through every intervening node (including, visually, the group label) — same "collinear bus hides where an arrow goes" anti-pattern SKILL.md already names, just relocated rather than eliminated.
  - **Planned fix (next round, not attempted here — didn't want an unverified edit going into this commit):** force `kind: "back"` edges to attach via each node's **right-side** port (`fanPorts`, override the `edgeCardinal()` result for these edges specifically) and route them through a dedicated vertical rail offset to the right of the widest node in the column (`M p.x p.y L railX p.y L railX q.y L q.x q.y`), one rail per back-edge, spacing rails outward. Also need to widen the SVG `viewBox` (`maxX`) to fit the rail(s). Sketched but not written — start here next time.
- Not re-verified since round 4: whether `palette`'s 3 independent groups and `how-promise`'s linear chain still render correctly after the round-4 `layoutContainers` rewrite — only checked via the offline pure-function simulation (see round 4 notes), not a real screenshot. Low risk (simulation showed sane, non-overlapping coordinates for both), but flagging it as unverified-by-eye.

**Decision (user, this session):** promote `templates/lesson.next.html` → `templates/lesson.html` now. Net effect so far is neutral-to-positive versus the previous shipped shell — no regression found, several real bugs fixed (group label clipping, decision shape, back-edge rank, group+DAG rank composition) — the open back-edge-rail item is worth continuing on top of a promoted baseline rather than blocking on it. Resume this file's checklist from Round 5 next session; re-copy `templates/lesson.html` → `templates/lesson.next.html` to reopen the compare workflow.

## Round 6 — the back-edge rail, built and screenshot-verified

Picked up the Round 5 sketch (route `kind: "back"` edges through a dedicated
rail instead of straight through the column) and found three more real bugs
along the way, each caught by an actual Playwright screenshot, not code
reading:

- [x] **Back-edges now route around, not through.** `orthoPath`'s
  straight-line shortcut (same `x` → one line) is still what a back-edge
  gets by default — and for a *short*, local back-edge (two siblings in one
  group, e.g. `palette`'s `cloud → queue "retry"`) that default is already
  fine and stays untouched. A new `pathBlocked()` check runs that default
  route past every other node's bounding box first (excluding the edge's
  own endpoints and any `kind: "group"` container, which edges are always
  allowed to cross to reach a nested child); only a route that actually
  cuts through something gets rerouted onto a dedicated vertical rail to
  the right of the widest node (`M source → railX → railX → target`, one
  rail per rerouted edge, forced onto each node's right-side port instead
  of its natural side). Verified against `inject-pipeline`'s two long
  back-edges (`confirm → invoke`, `boundary → invoke`) — both now clear
  every intervening node and each other, live/animated state included —
  while `palette`'s short local back-edge kept its original compact arrow
  (confirmed by diffing against the pre-fix screenshot; the first pass at
  this fix routed *every* back-edge onto the rail unconditionally, which
  fixed `inject-pipeline` but turned `palette`'s clean short arrow into a
  long detour exiting its group's border — `pathBlocked()` is what makes
  the rail conditional).
- [x] **Group caption text no longer loses to edges passing through the
  group.** A `kind: "group"` node rendered its fence rect, icon, and label
  as one unit in `groupEls`, drawn *before* edges (needed so the group's
  translucent fill doesn't wash out real children placed on top of it
  later) — but that put the group's own caption text under the same
  z-order, so any edge merely passing through the group on its way to a
  nested child (`inject-pipeline`: `confirm → lessonJson`) painted directly
  over the caption ("tmp/you-d[line]nt-know/<slug[line]/"). `renderNode()`
  now takes a `part` ("shell" | "content") so the fence rect still draws
  early but the icon+label draw late, in the same pass as every other
  node's content — same fix, applied to text instead of a routed line.
- [x] **Two edge labels off the same node no longer overlap each other or
  the next row.** `nudgeLabel`'s collision test compared every label's `x`
  as if it were a box *center*, but a `text-anchor: start` label (any
  vertical edge — the common case) draws rightward *from* `x`; two labels
  close in `x` (`inject-pipeline`'s `validate` branching into `невалидно`
  dashed / `валидно`) under-counted their real overlap and could pass the
  test while still overlapping on screen. Fixed to compare true left-edge
  boxes. That alone pushed the second label down into the *next rank's*
  node — `layoutContainers`'s inter-rank gap (36px) had exactly enough
  room for one label, not two stacked ones; widened to 60px.

Not attempted this round: the rest of the Round 2 accessibility checklist
(keyboard nav on SVG nodes) — out of scope for a rendering-correctness pass.

**Decision:** promoted `templates/lesson.next.html` → `templates/lesson.html`,
rebuilt all three shipped example artifacts (`npm run build`), then deleted
`templates/lesson.next.html` and every `examples/*/index.next.html` — the
design pass is done, and those were scratch files for the compare, not
things to ship (see Workflow below). Verified via Playwright CLI screenshots
(`@playwright/cli` + `playwright install chromium` as devDependencies)
against all three fixtures (`palette`, `how-promise`, `inject-pipeline`),
stepping through every lesson step including live/highlighted state, not
just the static first frame. Recreate `templates/lesson.next.html` (copy
from `templates/lesson.html`) to reopen the compare workflow next round.

## Round 7 — edge routing: what the ports say, not what the centres suggest

Screenshot pass over `dense-request` steps 3-4, `inject-pipeline` and
`palette`, this time backed by a geometric checker driven from the same
Playwright session: it reads every rendered `path.edge` and every node box
out of the live SVG and reports crossings, runs within 10px of a border they
pass, pointless stairs, and two edges drawn on one line over the same
stretch. Baseline across all 24 steps of the four examples: 115 findings.
After the round: 0, with the number of rail edges (31 / 16 / 0 / 0) and the
world width unchanged — the routes got better, not longer.

- [x] **The shape of a route follows its port sides.** `orthoPath` chose
  between the vertical and the horizontal Manhattan route from
  `|a.y - b.y| >= |a.x - b.x| * 0.35`, a test with no connection to the
  ports `fanPorts` had already placed. A top/bottom pair that came out
  "horizontal" got its two horizontal legs laid at `p.y` and `q.y` — the
  border lines of both rows. That is the whole "arrows glued to the boxes"
  class: `route → trace` sliding along `rate`'s bottom edge, `idem → tx`
  along `outbox`'s top edge, `decision → cloud` along `process`'s bottom
  edge in `palette`. Reading the side off the port (`sideOf`) makes the
  three cases explicit: vertical pair → corridor, horizontal pair →
  mid-column, mixed → one elbow.
- [x] **Rails are decided before the ports are placed.** The rail check ran
  on the finished fan, so an edge that then left for the rail still held a
  slot on its node's natural side and pushed everything else off centre. In
  `inject-pipeline` that is exactly why `phaseA → confirm` — two identical
  boxes in one column — was a stair: `invoke → phaseA`, on its way to the
  rail, had taken the centre slot on `phaseA`'s bottom. Routing is now
  `routePlan` (naive pass → decide hops and rails) → `fanPorts` (with those
  decisions) → `alignPorts` → `lanePlan`.
- [x] **Ports line up when a straight run exists.** `alignPorts` pulls the
  two ends of an edge onto a shared cell centre inside the overlap of the
  two boxes, nearest-to-straight first, skipping any slot already taken or
  any run that would cut a box. Where no shared centre is free and the
  offset is under two cells, `diagonalOk` allows one slanted line instead —
  gated on `dx <= dy` and half a cell of clearance from every box
  (Liang-Barsky), so an acute diagonal scraping a corner falls back to the
  stair it replaces.
- [x] **Same-row edges hop instead of cutting through the sibling between
  them.** The obstruction check was gated on `spans >= 2`, so an edge inside
  one row was never tested: `dense-request` step 3 drew the service group's
  arrow to the response straight through the async group's body. Such an
  edge now leaves through the top (or bottom) into the corridor and comes
  back down; the rail remains the fallback for when the hop is blocked too.
- [x] **One corridor, one set of lanes.** Horizontal runs sit on cell
  centres a whole cell off the rows they pass (half a cell only in a strip
  too narrow for that), and a rail edge crossing its own row takes a lane
  from the same set rather than the private "one cell above the row" it used
  before — which both drew a line along its own box's right border and could
  land exactly on an existing run. Lane order within a strip is now: runs
  that only reach down into it, runs that cross it whole, runs that only
  reach up into it, so two stubs at the same `x` cannot overlap.

Checker heuristics worth keeping for the next round: a detour is only
*pointless* if the straight line between the two ports is genuinely free
(inflate every box by the cling threshold before testing, or a hop over a
row reads as a wasted stair); a `via` edge legitimately passes through the
middle of the node it names; and the right-hand rail is a large deliberate
deviation, so measure a stair by how far the intermediate points sit off the
line between the ports, not by the distance between the ports themselves.

## Round 8 — the redesign onto the `<AG/>` design system

Not a correctness pass like rounds 3–7: a deliberate redesign of the artifact,
against the user's own design system (`https://on-1.ru/ui`, tokens in
`DESIGN.md`). Direction agreed up front — **stage-first layout, dark only,
shell only**: CSS and markup may change, the `lesson.json` contract and the
engine's geometry may not.

What the baseline screenshots actually showed, before any code was read:

- the canvas got under half the screen while the inspector sat ~70% empty and
  the notes footer held ~110px on every step;
- `dense-request` was clipped top and bottom at fit-to-screen — `WAL / fsync`
  off the bottom edge at step 1 and step 4;
- the kicker, the stage label and the footer headings were all the same
  mono-uppercase treatment, so nothing signalled importance.

- [x] **Full-bleed canvas, floating chrome.** Slim top bar (eyebrow, title,
  two-line thesis), rail in the left margin, dock bottom-left, brief behind a
  button as a native `<dialog>`.
- [x] **The frame is computed around the dock, not around the canvas.** The
  first version of this shrank the fit box, which wasted the whole area above
  the dock; the second centred the box in whichever free rectangle was
  larger, which pinned the diagram to the right edge with empty canvas beside
  it. What works is separating the two questions: take the *scale* from the
  larger of the two rectangles that clear the dock, then start the *position*
  at the centre of the whole canvas and displace it only as far as it takes
  to clear the panel — right if that is the shorter move, up otherwise, and
  if neither fits, park it at the top rather than centred behind the panel.
- [x] **One graticule on the layout's own 16px cell**, at the system's weight
  (`--graticule-line`, 5% ink-soft), replacing the fine + every-fourth pair.
  `MAJOR` is gone with it — it described nothing once the second layer went.
- [x] **Three colour roles that do not trade places.** The three accents by
  `kind` could not survive the move: the system has no blue, and a new hex is
  forbidden by the system's own rule. Repainting the shell coral or peach
  instead would spend the only colour meaning "act here" and the only one
  meaning "careful". `kind` is a tone on one dot now.
- [x] **Boundary reads as its own category.** At rest it is dashed peach, so
  it is not mistaken for a second kind of coral highlight.
- [x] **An open group fence no longer takes the highlight colour.** Caught on
  `dense-request` step 4, where a step about a five-node group turned the
  whole screen coral. The children carry the highlight; the fence does not.

Two bugs I introduced and caught in the same pass, both worth recording
because neither would have shown up in a code read:

- [x] **Live arrowheads went black.** The `<defs>` markers were filled with
  `var(--primary)`, which the token rename deleted. An invalid `var()` makes
  `fill` fall back to its initial value — black on a near-black ground, so
  every live edge would have lost its head. Found by grepping the file for
  the old token names after the CSS was done, not by looking at it.
- [x] **The narrow layout collapsed to nothing.** `body` kept a three-row
  grid template from the old markup, which now has two children, so `.stage`
  resolved to `auto` and took no height at all. The screenshot at 900px was a
  header over an empty page. The stage is its own two-row grid at that width
  now, with the rail a horizontal strip and the canvas a real block.

Still open, and deliberately not touched — it is engine geometry, which this
pass was scoped out of:

- [ ] Edge labels that land on a group fence rather than in the gap beside it
  (`TLS 1.3` and `остаток` on `dense-request`). The round-7 checker would
  still flag these; they are a routing question, not a styling one.
- [ ] The round-2 accessibility item (keyboard nav on SVG nodes) is still
  unstarted.

## Round 9 — what the page measures, not what the palette promises

A short pass with no design intent: measure the shipped 0.6.0 artifact and
fix what the numbers say. Two instruments, both driven from Playwright
against the live page.

**Contrast.** Resolve every colour through a 1×1 canvas rather than parsing
the computed string — that way `oklch()`, `color-mix()` and a plain hex all
come back as the same RGB triple, and an element's own `opacity` can be
composited against its real ground. Five texts were under the 4.5:1 that
small text needs: line numbers 2.91, the canvas marginalia and the Ctrl+wheel
hint 3.29, a code comment 2.91, a keyword 4.14.

Four of the five were self-inflicted, and the lesson is worth keeping:
`--color-ink-soft` is 7.62:1 on the void and passes with room to spare, but
`color-mix(… 55-60%, transparent)` over it lands near 3 — mixing toward
transparent eats contrast much faster than the percentage suggests. Read the
token and lose weight with a small `opacity` instead: it is measurable and it
stops at a floor you can name. The fifth was a role error — `--color-primary`
is the focus and structure colour, and asking it to be a code keyword puts it
at 4.14 on the code surface.

**Keyboard.** 12 nodes, 0 with `tabindex`, 0 with a role, 0 with a name, while
the chevrons were 6 of 6. Fixed; see the accessibility checklist above.

Two notes for whoever measures next:

- **Check which build the browser actually has.** The first run of both
  instruments was against `main`'s working tree — the pre-redesign shell —
  and then against a cached copy of it. Every number was wrong and two of
  them looked plausible. Assert something structural about the page (here:
  `document.querySelector('.dock')`) before trusting a single measurement.
- **A crude geometric checker over-reports.** Counting an edge label as bad
  because it overlaps a group's *bounding box* flags 33 cases on
  `dense-request`, every one of them a label legitimately sitting inside the
  fence where its children live. The real defect is a label on the fence's
  *stroke*, which is 6 cases: `TLS 1.3`, `400`, `проброс`, `остаток`,
  `та же tx`, `201`. Still open — it is edge routing, not styling.

## Round 10 — the disclosure mark

Raised from a screenshot: the fold/unfold control read as a form element and
sat in the wrong place. Six findings, and they compounded.

- **It moved with its own state.** `y = open ? n.y + 6 : n.y + (n.h - bh) / 2`
  — top-right when open, centred on the right edge when folded. A control
  whose only job is to toggle jumped 40px on every toggle. This was the
  worst of the six and the least visible in code review.
- Folded, it sat in the label's optical row, so the block read as a list item
  with a trailing control rather than as a container.
- A pill with a chevron is `<select>` vocabulary, foreign to a language made
  of corner marks, callouts, dimension lines and detail bubbles.
- The count is information wearing a button.
- It landed where horizontal edges arrive: the right edge at mid-height is
  where ports sit, and an arrowhead measured 6px from it.
- It duplicated the stack ghost, which already offsets up-right by half a
  cell to say "more underneath".

Now the design system's numbered callout at the top-right corner in both
states, filled with the canvas ground so it knocks a hole in the border it
straddles.

Two things the first pass got wrong, both caught by looking at it again:

- **A bare numeral does not say what it counts**, and the step rail draws an
  identical disc with a numeral in it. Folded groups read `+N` now; the rail's
  zero-padded `04` and a group's `+4` separate at a glance.
- **Open and folded want different content.** Open, the children are on
  screen: counting them again is noise, and the disc is the only way to close
  the fence — so it carries the glyph alone. Folded, the count is all that is
  known about what is hidden, so it leads and the glyph waits for hover or
  focus. The symmetry of "count at rest, glyph on hover" looked tidy and
  served neither state. Carrying both when open was tried in between and
  dropped: two marks crowd a 26px disc, and the second is information the
  reader already has. A control that shows everything it knows is not
  thorough, it is loud.

The glyph is **one** chevron, up to close and down to open. A converging
pair says "collapse" more literally and was tried first, but at the size a
26px disc allows, its two tips sit close enough to merge into an X — and an
X beside a numeral reads as "times N". Widening the gap to 5.6px fixed the
reading and cost the disc its Callout size to seat both marks. A single
chevron has the room to stay a chevron at 26px, which is the size the design
system actually specifies. Two attempts to make a two-part glyph fit are two
more than the problem deserved.

Also found here, and unrelated to the mark: **a `<g tabindex="0">` is not a
button.** The UA draws its focus ring on a plain `:focus` rather than waiting
for `:focus-visible` the way it does for real controls, so a mouse click on a
node left 5px of system blue — `rgb(153, 200, 255)`, a colour this palette
does not contain — until focus moved on. The reset written in round 9 only
covered `:focus-visible`. Reset `:focus` on any focusable SVG group, and keep
the real ring on `:focus-visible`.

What the measurement taught, and worth keeping: **a negative clearance
between an edge and an opaque mark is not automatically a collision.** The
disc paints after the edges, so a line passing behind it is occluded — which
is the knock-out effect, not a defect. The test that means something is
whether an *arrowhead* disappears under it. Seven of those against the whole
path, zero against endpoints; the first number would have sent the design
back for no reason.

## Round 11 — a real lesson as the fixture: dock, motion, edge vocabulary

The first round driven by a real agent-written lesson rather than canonical
content: `examples/mfe-architecture`, an anonymised Module Federation repo
(30 nodes, 6 groups, 22 edges). Three findings, all from the author's own
screenshots.

- **The dock had one height, and a 15-line excerpt did not fit it.** The cap
  `min(46%, 27rem)` was right for a short excerpt and wrong for a wide config
  block, which wrapped and was cut at line 45. Its top edge is now a grip
  (`role="separator"`): drag, ↑ ↓ (Shift for a quarter), Home/End,
  Enter or double-click for full height and back. What it sets is a **cap**,
  not a height — a step with less to say still shrinks to fit — and the cap
  holds across steps for the session, like the other chrome modes. Two traps
  met on the way: a toggle that compares the *box* with the maximum never
  toggles back on a short step (the box sits below its cap), and
  `aria-valuenow` computed from the box reports 68% at End. Both read the cap
  now. The re-frame runs once, on release, so the diagram does not move under
  the reader's hand mid-drag.
- **A fold, an unfold, or a step that opens another group cut straight to a
  new layout**, and the reader had to find the block they had just touched.
  Now FLIP on every re-render: boxes that stayed glide from their old centre,
  unfolded children come out of the block that held them, folded ones slide
  into the block that replaces them (the old `<g>`s are re-parented into a
  ghost layer under the live boxes and dropped afterwards), and edges, which
  cannot be in two places at once, fade in over the last half. The toggled
  element then gets the design system's viewfinder corners, closing in once —
  violet, because this marks focus and not the current material, and lifted
  toward the ink (`color-mix(primary 62%, ink)`, the keyword shade) after the
  first look: the token itself is also the keyboard ring and the `frame`
  border, and corners in that exact colour read as one of them. Driven
  through the SVG `transform` attribute from `requestAnimationFrame`, not
  CSS: a CSS transform on a `<g>` holding a `foreignObject` misplaces the
  label in Safari. Reduced motion skips the glide; the corners still stand
  there for the same time, because "where did it go" is a question reduced
  motion does not stop the reader asking. Checked by diffing every edge path,
  node and viewBox per step against the shipped template for `how-promise`,
  `inject-pipeline` and `dense-request` once the motion settles: identical.
- **One dash pattern and one stroke colour were not enough to say two
  different things about two edges.** `edges[].line` adds `dotted` and
  `chain` (the dash-dot of a drafting centre line) next to `dashed`, and
  `kind` is left to say direction; `kind: "dashed"` still parses. A tone
  is a **token name** (`ink`, `primary`, `accent-2`, `ink-soft` by default),
  never a value, with an arrowhead marker per tone. Coral is refused by
  `inject-lesson.mjs`, not just undocumented: an edge that is coral at rest
  reads as lit. A lit edge goes coral whatever its tone, and keeps its line
  type — a dotted path stays dotted when it is the current one. Dots are
  1.9px round caps on a 4px period, a step heavier than the 1.4px tick of a
  solid edge.

## Round 12 — the disclosure glyph, once more

Round 10 settled on `+N` folded and one chevron open. The author overruled
both from use: the count on a folded block is not needed, and the open
state wanted something that fits the disc better than a chevron.

Four candidates were drawn at the shell's real geometry (r=13 disc, 1.4px
ring, 1.5px round-capped glyph in a ~9px box), at rest, hovered and focused,
natural size and ×4: a minus, a minus with end ticks (the design system's
DimensionLine), two viewfinder corners turned inward, and a shallow arc.
Inward corners won, and expand became the same mark turned outward — the
author's call, and the right one: **one mark that turns inside out reads as
one control**; a plus paired with anything else reads as two.

- It is the same vocabulary as the lock-on corners from round 11, so the
  control and the feedback it triggers look related.
- At natural size the corners were the faintest of the four (two short L's
  carry less ink than a cross), so the legs went from 3.4px to 4.4px.
- Then the opposite problem, outward: flipped inside the same ±5.6 box, the
  two corners sat at the rim with an empty diagonal between them and read as
  two marks. Shrinking the box only (±4.6, ±4.0) kept the gap, because the
  gap is set by where the leg tips stop, not by the box — the author pointed
  that out. Outward corners now keep 3.4px legs and stop 0.4px off the centre
  lines; four gaps (1.2 · 0.8 · 0.4 · 0) were compared and 0 started to read
  as a closed frame. The pair is no longer a literal flip, and does not need
  to be: what reads as "the same mark" is the shape, not the coordinates.
- No count anywhere on the disc. The stack ghost behind a folded block
  already says "more underneath", and a numeral in a disc is the rail's
  vocabulary for a step. The number stays in the accessible name.
- With one glyph at rest in both states, the hover/focus swap between a
  count and a hint glyph is gone; hover and focus only recolour the mark.

## Round 13 — the dock's controls, only where they change something

Raised by the author from use: the grip from round 11 sat on every step,
including the ones that had nothing more to show, and there was no quick way
to say "all of it". Measured before touching anything: at 1440×900, 22 of the
33 steps across the five examples fit the dock at its usual height, and all
33 carried the grip.

- **The controls follow the content.** The grip and a new full-height button
  show only when moving the cap would reveal something: the step is cut at the
  usual height, or at a lower one the reader picked. Concretely, controls iff
  `need > min(cap, usual)`. Above the usual height that still counts, so a
  reader who went to full height can always get back.
- **Both numbers are read off the dock itself**, not summed from its parts:
  lift the cap (`max-height: none`) to get what the step needs, push the box
  past it (`height: 9999px`) to get what the stylesheet gives. Nothing paints
  between the two reads. Summing children would miss a cap so low that the
  code head itself is clipped. One trap: a scroller that briefly fits its
  content loses its scroll offset, so both scrollers' offsets are saved and
  put back.
- **Never re-evaluated mid-drag or on a key.** Dragging up past what a step
  needs would hide the grip under the pointer that holds its capture. The
  check runs on a new step, a resize, the panel coming back and the webfonts
  landing. A grip that outlives its use until the next step is harmless; one
  that vanishes under the hand is not.
- **The button keeps its column when hidden** (`visibility`, not `display`), so
  a title does not re-wrap from one step to the next, and it is the disc's
  size, so the head is exactly as tall as before. Checked: frame and dock
  rectangle identical to 0.7.2 on all 99 step × size combinations (five
  examples, three window sizes).
- **The glyph is an arrow up to a line, and the same arrow turned back down.**
  The dock's foot is fixed and only its top moves, so "to the top" is literal;
  a symmetric maximise mark would promise growth in both directions. One mark
  turned around reads as one control, as in round 12.
- **Full is a state, not a number.** A taller window keeps a full dock full
  instead of leaving it at the old window's maximum.
- **With no excerpt the narration takes the dock's cap**, not its own 11rem.
  Otherwise full height could not show a long narration whole, and the
  button would have lied.
- **Under 1100px full height stops below the zoombar**, which moves to the top
  of the canvas there and lies across the dock's width. Reachable with End
  since 0.7.0; the button made it one press.

The canvas note in the top-left corner, «Diagram · node opens a step», is
gone. It was the heading of the diagram pane in the 0.1 split layout, turned
into marginalia by the round-8 redesign. On a full-bleed canvas "Diagram"
names the obvious, and a dock at full height covered it. Moving its other
half ("click a node for its step") into the top-right legend was tried and
reverted: the longer legend ran onto the API gateway node on
`dense-request`. The svg's accessible name still carries the full string.

Found on the way: **Space never pressed a focused button**, and on a focused
node it opened the step *and* started autoplay. The global handler took Space
for play and called `preventDefault` regardless of focus. Space now belongs to
a focused button or node. See the corrected checklist line above.

Open, for the next round. **A click on an open group is not designed.** It
goes to the first step whose highlight includes the group (failing that, a
neighbour), and that step lights several boxes, so the click reads as "it
selected a bunch of things". A click on the fence and a click on a box inside
it are different intents that currently share one rule. Draft the variants
(what a group click can mean, what an element click must mean) together with
a hover that says which one is about to happen. That hover is also where
"click a node for its step" belongs: in context, not as a permanent caption.

## Workflow

`templates/lesson.next.html` and `examples/*/index.next.html` are **not**
kept in the repo at rest — they're scratch files for the duration of a
design pass, recreated each time one starts and deleted (or just left
uncommitted) once the pass promotes or is abandoned. Housekeeping, not a
step you can skip: shipping them alongside the real template doubles every
example's file count with byte-for-byte duplicates once a pass is promoted,
and they'd otherwise ride along into the published npm package (`files` in
`package.json` globs the whole `templates/`/`examples/` directories).

```sh
# start a design pass: open a working copy of the shipped template
cp templates/lesson.html templates/lesson.next.html

# rebuild the shipped template's examples
npm run palette && npm run example && npm run stress   # or: npm run build

# rebuild the same fixtures against the working copy, output as *.next.html
node scripts/inject-lesson.mjs templates/lesson.next.html examples/palette/lesson.json examples/palette/index.next.html
node scripts/inject-lesson.mjs templates/lesson.next.html examples/how-promise/lesson.json examples/how-promise/index.next.html
node scripts/inject-lesson.mjs templates/lesson.next.html examples/inject-pipeline/lesson.json examples/inject-pipeline/index.next.html
```

Compare `examples/*/index.html` (current) against `examples/*/index.next.html`
(next) side by side in the browser. Promote by copying `lesson.next.html`
over `lesson.html` once the user signs off, then delete every `*.next.html`
(template and examples) before committing — they've done their job.
