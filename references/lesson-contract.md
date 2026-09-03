# Lesson contract

Replace the `__LESSON_JSON__` token in `templates/lesson.html` with one JSON object. Strings in the user's language. Identifiers as in the cited system.

## Object shape

```json
{
  "lang": "en",
  "kind": "how",
  "title": "Promise settle order",
  "pattern": "Microtask queue",
  "repo": "ECMA-262",
  "thesis": "One sentence: why this exists.",
  "problem": "What breaks with the naive model.",
  "whyNotBasic": "Concrete failure of the naive alternative.",
  "cost": "What you pay for the real model.",
  "asides": [
    {
      "id": "why-microtask",
      "title": "Why not a macrotask",
      "body": "2–5 sentences. Backticks for identifiers. No nested [[aside]]."
    }
  ],
  "files": ["lib/promise.js"],
  "repeats": [],
  "nodes": [
    { "id": "call", "label": "then(onFulfilled)", "kind": "action" }
  ],
  "edges": [
    { "from": "call", "to": "queue", "label": "enqueue" }
  ],
  "steps": [
    {
      "id": "enqueue",
      "title": "Enqueue",
      "narration": "What happens at this instant. Optional [[why-microtask]].",
      "highlight": ["call"],
      "code": {
        "file": "lib/promise.js",
        "startLine": 1,
        "text": "real excerpt or a labeled canonical snippet"
      }
    }
  ]
}
```

## Rules

- `lang`: chrome (`Назад` / `Back`, transport labels) ships translations for `en` and `ru` only — set either to match the lesson's prose. Any other value falls back to the English chrome while the lesson content itself may still be authored in that language.
- `kind`: `how` | `concept` | `api` → **iris**; `architecture` | `repo` → glacier; `security` | `vuln` → dusk. Default iris.
- Optional `accent` overrides `kind`: `iris` | `glacier` | `dusk` only. Forbidden as primary: red, amber, green (and old names `cinnabar`, `patina`, `kinpaku`).
- State colors are shell tokens `--state-error` / `--state-warn` / `--state-ok`. JSON must not restyle them. `kind: "boundary"` stays error-red in every accent.
- `--node-fill` is achromatic. Do not put red / amber / green in `accent`.
- Optional `layout`: `"timeline"` | `"layers"` | `"tree"` | `"auto"`. `"tree"` indents `folder` / `file` by `parent`. `"auto"` uses tree only when every node is folder/file; uses group layout if any `kind: "group"`.
- Optional `detail`: `"auto"` (default) | `"progressive"` | `"full"` — how much of the diagram is open at once. See **Staged detail** below.
- Optional `nodes[].parent`: id of a `group` (fence) or, in `layout: "tree"`, a folder
- Optional `nodes[].collapsed`: boolean, `kind: "group"` only — that group's own default state (overrides the `detail` heuristic for it)
- Optional `steps[].expand`: group ids this step opens even though it highlights none of their children
- Optional `nodes[].rank`: explicit row
- Optional `edges[].kind`: `flow` (default) | `dashed` | `back` | `both`
- Optional `edges[].via`: junction node id (polyline through that node)
- Node `kind` (shape + Lucide glyph). Aliases in parentheses stay valid:

| kind | Shape | Use |
|------|--------|-----|
| `process` (`child`, `other`) | rounded rect | step / module |
| `start` | stadium | terminator |
| `decision` | diamond | branch |
| `cloud` | stadium + Lucide cloud | network / SaaS |
| `queue` | stadium | delay / queue |
| `folder` / `file` | rounded rect + Lucide glyph | tree / path |
| `group` | dashed fence | contains children via `parent` |
| `junction` | circle | edge pivot (`via`) |
| `provider` | rect + layers | stack |
| `host` | window | host app |
| `frame` (`hoc`) | dashed frame | wrapper |
| `inbox` (`consumer`) | tray | sink |
| `action` | rect | event |
| `boundary` | rect, `--state-error` | isolation |
| `subroutine` | rect | predefined process |
- **Every `nodes[].id` appears in at least one `steps[].highlight`.** Otherwise the node is dead (not clickable).
- 4–8 `steps` that follow **runtime**, not a file-tree tour
- Architecture lessons: `code.text` copied from the cited file; trim, do not invent
- Concept lessons: snippet may be canonical; `code.file` says so (e.g. `spec: Promise`)
- `repeats` may be `[]`
- Surface copy 1–2 sentences. Depth in `asides[]`. Plant `[[asideId]]`. Overlay, not in-flow
- `asides[].id` is `[A-Za-z0-9_-]+`. No nested `[[…]]`
- Prose may use `` `identifier` ``; no HTML in JSON
- Node `label` ≤ ~40 characters
- Edges: the shell places split-row arrows on **separate rails** with a lacquer overpass. Do not pack four labels onto one shared bus in JSON either — keep labels short (see **The grid** below for how much room a label actually gets)

## Staged detail

A diagram past ~12 nodes read at fit-to-screen is wallpaper: everything is on
screen and nothing is legible. The shell answers that in two ways, and both
are automatic — a lesson that says nothing about either still works.

**Folding.** A `kind: "group"` node can stand in FOR its children instead of
fencing them. Collapsed it draws as one solid block with the child count and
a chevron; every edge that touched a hidden child re-anchors onto the block
(edges wholly inside it disappear, parallel ones merge into a `label ×N`).

A folded block is a closed container first and a step link second: clicking
its body opens it, and so does the chevron (`Enter` / `Space` on the chevron
too). Its own step stays reachable from the rail, and from the fence itself
once it is open — an expanded fence opens its step on a body click like any
other node. Neither fold nor unfold changes the current step or moves the
frame: the reader who opened a group is looking at that group, and the view
only shifts when what they just opened no longer fits on screen.

Which groups are open comes from three layers, most specific first:

1. the reader's own chevron toggle on that group;
2. the canvas-wide `Детали / Detail` switch — `auto` · `all` (nothing folds)
   · `step` (only the current step opens);
3. `auto`, i.e. the lesson's own default: a group opens when the current step
   highlights one of its children or names it in `steps[].expand`, and stays
   folded otherwise — **but only for a complex diagram** (more than one
   collapsible group AND >12 nodes or >14 edges). Below that everything is
   open, exactly as before.

`detail: "progressive"` forces the staged reveal on a diagram the heuristic
would call simple; `detail: "full"` disables folding entirely (the reader can
still fold by hand). `nodes[].collapsed` sets one group's default either way.

Write for it: on a big lesson, put every node in a group named for the
periphery it belongs to, and let each step highlight the children it is
actually about. That is what turns the top level into a handful of large
shapes with detail one click away, with no extra keys in the JSON.

**Zoom.** The canvas pans and zooms like a Figma board: `Ctrl`/`⌘` + wheel
zooms at the cursor (trackpad pinch too), `Shift` + wheel pans sideways, a
plain wheel pans, dragging empty canvas moves it, and `+` `-` `0` (fit) `1`
(100%) `2` (zoom to the current step) work bare or with `Ctrl`/`⌘`. The
zoombar in the corner does the same for the mouse. Until the reader touches
the canvas the shell frames each step itself: fit-to-screen while that stays
readable, otherwise the step's own nodes. After that the frame is theirs — it
only follows when a step's nodes would sit off screen.

## The grid

Every box, gap and pad in the layout is a whole number of one 16px cell, and
the canvas paints a line every cell with a heavier one every four. Nothing in
the JSON sets these — they are here so you know what a label has to fit in:

| | cells | px |
|---|---|---|
| node | 12 × 4 | 192 × 64 |
| collapsed group | 15 × 6 | 240 × 96 |
| gap between columns | 6 | 96 |
| gap between rows | 7 | 112 |

The row gap is a **corridor**: every horizontal run of every edge is routed
into the empty strip between two rows, one lane per edge, so an arrow can
never be drawn across a node's face. Ports sit on cell centres, never on a
cell line, which keeps half a cell of clearance between any vertical run and
any box border — arrows read as going *between* the boxes, not along them.
An edge that skips a row entirely, and any long back-edge, leaves for a rail
to the right of the diagram rather than cutting through what is in the way.

What that costs you as an author: an edge `label` has ~96px between columns
and ~112px between rows before it starts stacking below its neighbour. Two
or three words. Put the sentence in `narration` or an aside.
