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
- `kind`: `how` | `concept` | `api` | `architecture` | `repo` | `security` | `vuln`. It sets the tone of the dot in the kicker — violet, muted ink, peach — and **nothing else**. The shell does not repaint per lesson.
- The header names the `kind` next to that dot. The seven kinds above have `en`/`ru` names in the shell; any other value is shown as written and gets the default tone.
- Optional `accent` is legacy and no longer repaints anything. Old values (`iris` | `glacier` | `dusk`, and the older `cinnabar` | `patina` | `kinpaku`) still parse and map onto a tone, so a lesson written against the three-accent shell rebuilds untouched. New lessons should leave it out.
- Colour is the shell's, in three fixed roles: `--color-primary` (violet) focus and structure, `--color-accent` (coral) the current material, `--color-accent-2` (peach) status. JSON must not restyle them, and `kind: "boundary"` is peach in every lesson. The one place JSON picks a colour is `edges[].tone`, and it picks a token from a fixed list, never a value.
- Optional `layout`: `"timeline"` | `"layers"` | `"tree"` | `"auto"`. `"tree"` indents `folder` / `file` by `parent`. `"auto"` uses tree only when every node is folder/file; uses group layout if any `kind: "group"`.
- Optional `detail`: `"auto"` (default) | `"progressive"` | `"full"` — how much of the diagram is open at once. See **Staged detail** below.
- Optional `nodes[].parent`: id of a `group` (fence) or, in `layout: "tree"`, a folder
- Optional `nodes[].collapsed`: boolean, `kind: "group"` only — that group's own default state (overrides the `detail` heuristic for it)
- Optional `steps[].expand`: group ids this step opens even though it highlights none of their children
- Optional `nodes[].rank`: explicit row
- Optional `edges[].kind`: `flow` (default) | `back` | `both`. `flow` and `back` both point from `from` to `to`, so write every edge the way the thing travels. `back` marks a loop-back against the flow — a retry, a return to an earlier step, an answer going home — and the layout leaves it out of the ranking, so it does not drag its target down a row. `both` has a head at each end and, lit, a token each way. `dashed` still parses and means a dashed `flow`; it predates `line`.
- Optional `edges[].line`: `solid` (default) | `dashed` | `dotted` | `chain` — how it is drawn. `chain` is the dash-dot of a drafting centre line. A line type means something only if the lesson says what and keeps it: one meaning per type, the same on every step.
- Optional `edges[].tone`: `ink-soft` (default) | `ink` | `primary` | `accent-2` — a token name. `accent` is refused at build time: coral is the live edge, and an edge that is coral at rest would read as lit. A lit edge turns coral whatever its tone and keeps its `line`. One or two tones a lesson, each with a stated meaning; a tone on every edge is a legend nobody reads.
- Parallel edges merged into one `label ×N` keep a `kind`, `line` or `tone` only where all of them agree; any disagreement falls back to the default.
- Optional `edges[].via`: junction node id (polyline through that node)
- Node `kind` (shape + Lucide glyph). Aliases in parentheses stay valid:

| kind | Shape | Use |
|------|--------|-----|
| `process` (`child`, `other`) | rounded rect | step / module |
| `start` | stadium | terminator |
| `decision` | rounded rect + fork glyph | branch |
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
| `boundary` | rect, dashed peach | isolation |
| `subroutine` | rect | predefined process |

- Optional `nodes[].icon`: what the node **is**, apart from its `kind`. The kind keeps the shape and the role in the flow; the icon replaces only the glyph, so a `process` box with `"icon": "database"` is still a process box. An icon may also name any kind's glyph (`"icon": "cloud"`). An unknown name fails the build and prints the list.

| icon | Means | e.g. |
|------|-------|------|
| `user` | a person, an actor | the user who clicks |
| `browser` | a client runtime, the web | browser, `fetch()` caller |
| `screen` | a page, a view, a route's UI | one exposed page |
| `component` | UI building blocks | layout, tooltip, loader |
| `terminal` | a command, a CLI | `/command`, a shell |
| `function` | pure code, a helper, a callback | parser, utils, `then()` |
| `package` | a library, a dependency | an npm package of hooks |
| `link` | an alias, a re-export, a reference | the old name of a module |
| `config` | settings, constants, props contract | `config/api.ts` |
| `state` | in-memory state, a store, a context | a reducer and its context |
| `rules` | a rule set, validation, invariants | 13 validation rules |
| `database` | a database, a table, a write to one | PostgreSQL, an outbox insert |
| `cache` | a cache, a key-value store | Redis, a response cache |
| `disk` | durable storage, a filesystem | WAL, `fsync` |
| `lock` | a lock, encryption | `FOR UPDATE`, TLS |
| `key` | a key, a token, a credential | JWT, an idempotency key |
| `route` | routing, path matching | `/orders` route |
| `server` | a service, a handler, a worker | a POST handler, a relay |
| `request` | an outgoing call | `fetch()` |
| `response` | the answer that goes back | `201 + Location` |
| `broadcast` | an event stream, pub/sub | a Kafka topic |
| `mail` | a message to a person | an e-mail, a notification |
| `retry` | a retry, a repeat | back-off on 429 |
| `timer` | a delay, a timeout, a scheduled task | a timer task |
| `limit` | a rate limit, a quota | 100 rps |
| `trace` | tracing, logs, metrics | a trace id |
| `error` | a failure path, a dead end | a dead-letter queue, `exit(1)` |
| `mock` | a test double, a fixture | MSW handlers |

  Pick by what the thing is, not by what it does in this step: two nodes with the same icon read as the same sort of thing, so a Redis key and a response cache share `cache`, and a database is never `queue` just because the stadium looked right. Leave it out where the kind's glyph already says it (`decision`, `boundary`, `file`).
- **Every `nodes[].id` appears in at least one `steps[].highlight`.** Otherwise the node is dead (not clickable).
- 4–8 `steps` that follow **runtime**, not a file-tree tour
- Architecture lessons: `code.text` copied from the cited file; trim, do not invent
- Concept lessons: snippet may be canonical; `code.file` says so (e.g. `spec: Promise`)
- `repeats` may be `[]`
- `thesis`, `problem`, `whyNotBasic`, `cost` and `repeats` are the lesson's **brief**: the thesis also sits in the top bar, the rest live behind the `Бриф` / `Brief` button. They are read once, so they do not hold canvas height on every step — write them as standing context, not as commentary on the current step
- `problem`, `whyNotBasic` and `cost` have no length cap: the brief is a scrolling dialog, so a process that needs explaining gets explained there. A blank line (`\n\n`) starts a new paragraph; a single newline is a space. `` `code` `` and `[[asideId]]` work as anywhere else
- Surface copy — the thesis, step narration — 1–2 sentences. Depth in `asides[]`. Plant `[[asideId]]`. Overlay, not in-flow
- `asides[].id` is `[A-Za-z0-9_-]+`. No nested `[[…]]`
- Prose may use `` `identifier` ``; no HTML in JSON
- Node `label` ≤ ~40 characters
- Edges: the shell places split-row arrows on **separate rails**, the overpass knocking a hole in the line beneath it. Do not pack four labels onto one shared bus in JSON either — keep labels short (see **The grid** below for how much room a label actually gets)

## Staged detail

A diagram past ~12 nodes read at fit-to-screen is wallpaper: everything is on
screen and nothing is legible. The shell answers that in two ways, and both
are automatic — a lesson that says nothing about either still works.

**Folding.** A `kind: "group"` node can stand in FOR its children instead of
fencing them. Collapsed it draws as one solid block, its caption in the
top-left corner where an open fence carries it, with a disc on its corner
whose viewfinder corners point out (open me) — open, they point in (close me).
On a folded block the disc appears on hover or keyboard focus, since a click
on the block does the same; an open fence, which only its disc can close,
shows it always, and so does a touch screen. Every edge that touched a hidden child re-anchors onto the block
(edges wholly inside it disappear, parallel ones merge into a `label ×N`).

A folded block is a closed container first and a step link second: clicking
its body opens it, and so does the disc (`Enter` / `Space` on the disc
too). How many children it holds is in the disc's accessible name, not on it.
An open fence answers on its head strip — the band its icon and caption sit
in — and a click there folds it again: the head of a group works the group,
both ways. Inside the fence is canvas, so a click between two of its boxes
does nothing and a drag there pans. A group's own step stays reachable from
the rail and from the step disc it shows under the pointer (see *Clicks and
links*). Neither fold nor unfold changes the current step or moves the
frame: the reader who opened a group is looking at that group, and the view
only shifts when what they just opened no longer fits on screen.

Which groups are open comes from four layers, most specific first:

1. the reader's own toggle on that group's disc — it lasts across steps until
   one of the two resets below;
2. **fold every group**, pressed on the current step: every group folded,
   every toggle and the detail mode forgotten, the whole diagram framed
   again. It holds for that step only; the next step opens its own material
   as usual. The button sits at the end of the zoombar and shows only once
   the reader has changed the picture by hand (a toggle or a detail mode) and
   some group is open, so at rest the canvas carries no extra control. `Esc`
   on the canvas does the same while the button is there;
3. the canvas-wide `Детали / Detail` switch — `auto` · `all` (nothing folds)
   · `step` (only the current step opens). Pressing it also drops every hand
   toggle;
4. `auto`, i.e. the lesson's own default: a group opens when the current step
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
readable, otherwise the step's own nodes. The frame is computed around the
dock, not around the bare canvas — the scale comes from the larger of the two
areas that clear the panel, and the diagram is then displaced from centre only
as far as it takes to get out from under it. After that the frame is theirs —
it only follows when a step's nodes would sit off screen.

## Clicks and links

A click on a box opens the first step that highlights it; a click on a
group's head strip folds or opens the group. Under the pointer, or under
keyboard focus, a group and a box that stands outside any group show a panel
over them: the step, as the word, the rail's numbered callout and the title,
then the links (⇄). Folding is not on it: the head strip and the corner disc
already fold a group. A box inside a group shows its actions as discs on its top border
instead, the size and spot of a group's disc: the step its click opens,
numbered as on the rail, and its links when it has any; each disc names
itself in a tooltip under the pointer. A touch screen has no hover, so
there a long press stands in for the links button.

**Links.** A step lights what its narration is about, which is mostly the
forward flow; everything else a box talks to stays faint, or folded into a
block where its edges merge into a `label ×N`. `L` on the box under the
pointer or keyboard focus, or its ⇄ button, turns that around for one box:
the groups that hold it and its partners open, every other group folds,
whatever is not on one of its edges steps back, and every edge it has is lit
both ways. The dock lists the partners, one row each with every link to it,
so a request and its answer read as one exchange; a row opens the partner's
links. `Path`, in the bar over the canvas, widens the view to everything
that leads to the box and everything it leads to — `back` edges are not
followed, but the box's own are on its path. `Esc`, `L` again, a click on
empty canvas or a step change leaves, and the frame goes back to where the
reader had it. The JSON has no key for any of this.

Write for it: a short label on every edge, and two edges rather than one
`both` when the two directions carry different things. `POST` out and `201`
back is two rows' worth of information in the dock; `both` with one label is
one.

## The grid

Every box, gap and pad in the layout is a whole number of one 16px cell, and
the canvas paints one graticule line on that same cell. Nothing in the JSON
sets these — they are here so you know what a label has to fit in:

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
