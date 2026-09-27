---
name: you-dont-know
description: >-
  Use when the user explicitly invokes /you-dont-know or asks for a visual
  interactive HTML lesson: a construction, pattern, architecture from
  references, or a general API/concept (Promises, REST, Node.js, vulnerabilities).
  Do not use for ordinary Q&A, code review, unsolicited tutorials, or
  /understand maps.
license: MIT
metadata:
  version: "0.6.4"
disable-model-invocation: true
argument-hint: "[topic-or-path]"
---

# You Don't Know

Interactive HTML lesson — You Don't Know JS vibe. Same locked shell for **any** topic: a pattern in this repo, architecture from cited files, or a general concept (Promise, REST, Node ecosystem, vulns).

**Core principle:** Propose the lesson shape. Build after confirmation. Artifact under `tmp/you-dont-know/<slug>/`.

**REQUIRED SUB-SKILL:** locked shell [templates/lesson.html](templates/lesson.html). Built on the `<AG/>` design system: void ground, Unbounded / Onest / JetBrains Mono, radii ≤6px, hairline strokes, elevation by stepping the surface. Do not invent a skin.  
**REQUIRED BACKGROUND:** [references/lesson-contract.md](references/lesson-contract.md). Inject with `node scripts/inject-lesson.mjs`.

## Colour roles

Three hues, and they never trade places.

| Token | Value | Role |
|-------|-------|------|
| `--color-primary` | violet `#8b5cf6` | focus rings, structural marks |
| `--color-accent` | coral `#ff6f5e` | the one "you are here / you can act here" colour: current step, highlighted node, live edge |
| `--color-accent-2` | peach `#ffc24b` | status: a `kind: "boundary"` node, the lesson's «Проблема» |

`--gradient-wave` (violet → coral → peach) appears exactly once in the shell — the brief's top bar. It is not a decoration to reach for again.

**The shell does not repaint per lesson.** `kind` picks the tone of the dot in the kicker and nothing else:

| `kind` | dot |
|--------|-----|
| `how` `concept` `api` | violet |
| `architecture` `repo` | muted ink |
| `security` `vuln` | peach |

A lesson that washed coral or peach across its chrome would spend the only colour that means "act here" and the only one that means "careful". `accent` in the JSON is legacy: old values (`iris` · `glacier` · `dusk`, and the older `cinnabar` · `kinpaku` · `patina`) still parse and map onto a tone, so every existing lesson rebuilds untouched — but nothing repaints.

Derive anything new with `color-mix()` from the tokens above. Never a hand-picked hex, never a fourth hue, never a radius past 6px, never `backdrop-filter`.

Do not restyle `:root` per lesson.

## Hard gates

1. **Explicit invoke.** No `/you-dont-know` (or equivalent ask for this visual lesson) → do not run.
2. **Phase A — propose.** Show the lesson shape. **STOP.**
3. **Phase B — build.** Only after the user confirms (number, title, or «да» on the outline).

### Phase A

**Named topic** (arguments or the user already named Promise / REST / a file):

```
Title: …
Kind: how | architecture | security
Steps: 4–8 runtime beats (one line each)
Why a lesson, not a paragraph: …
```

Then: «Подтвердите — пишу артефакт. Пока нет — файлов нет.»

**Unscoped invoke in a repo:** hunt 3–8 non-obvious mechanics. Numbered list (title, pattern, files, why it exists). Same confirm line.

Language = user's language. No HTML, no `docs/`, no chat-essay instead of the list.

### Phase B

For each confirmed item:

1. Ground in cited files **or** in the named concept. Quotes from the repo when `kind` is architecture. General API lessons may use canonical snippets; label them as such, do not fake a local path.
2. Write `tmp/you-dont-know/<slug>/lesson.json` to the contract. Identifiers in backticks. No HTML in JSON.
   - Narration: 1–2 sentences WHAT. WHY / invariant / race → `asides[]` + `[[asideId]]`.
3. Build:
   ```sh
   node ~/.agents/skills/you-dont-know/scripts/inject-lesson.mjs \
     ~/.agents/skills/you-dont-know/templates/lesson.html \
     tmp/you-dont-know/<slug>/lesson.json \
     tmp/you-dont-know/<slug>/index.html
   ```
   (From a clone of this skill: `node scripts/inject-lesson.mjs templates/lesson.html …`.)
4. Visual-QA `index.html`: node labels readable on the surface fill; Lucide glyphs not a 2px circle; `` `code` `` as chips; every node clickable; edges on separate rails; asides = overlay; coral marks only the current material, peach only a boundary. The rail reads as a dimension line collapsed and opens its titles **over** the canvas — the diagram must not reflow when it does. The dock must never sit on top of the diagram it explains: the shell frames around it, so if a step's nodes end up under the panel, that is a bug, not a layout. Dzen (focus mode) keeps the title, the transport and the rail and gives the canvas the rest; leaving it brings back exactly the chrome the reader had. On a staged lesson also: the folded top level reads as a few large blocks, each step opens exactly its own group, and the chevron badge is not covered by a label. Every arrow runs *between* boxes, never along one's border or across its face; every box edge lands on a grid line; every edge label sits in the gap it belongs to, not on a node. Two boxes stacked in one column are joined by **one straight line** — a stair with a one-cell jog in it means the ports never lined up. A slanted edge is only right where it replaces such a stair and clears every box; one scraping a corner should have stayed orthogonal.

### Complex diagrams (>12 nodes)

The shell folds them for you — but only if the JSON gives it something to
fold. Put every node in a `kind: "group"` named for the periphery it belongs
to (client · edge · gateway · service · storage), and let each step highlight
the children it is actually about. The canvas then shows a handful of large
blocks and opens one group per step; the reader pans / zooms (Ctrl+wheel,
Shift+wheel, drag) and toggles any group by its chevron. Details and the
`detail` / `collapsed` / `expand` overrides: [references/lesson-contract.md](references/lesson-contract.md) → *Staged detail*.

A flat 25-node lesson with no groups gets no staging — it is still one wall
of boxes, just zoomable. Group it.

Shell vocabulary (shapes, groups, tree, edge kinds) lives in `examples/palette/` — rebuild after template edits. `examples/dense-request/` is the staged-detail reference (31 nodes, 6 groups).

Default dest is `tmp/`. Never `docs/` unless asked.

## Red flags — STOP

- Building before confirmation
- Gold / kinpaku / cream paper, or any hue outside the three tokens
- Coral spent on something that is not the current material (it stops meaning "here")
- A hand-picked hex, a radius past 6px, a `backdrop-filter`, a second gradient
- Node label that inherits SVG black (`currentColor`) — ink must be `--color-ink`
- Shared collinear edge bus that hides where an arrow goes
- Tab / sheet polygon for `folder` or `file` — Lucide glyph + path label already say directory; shell is a rounded rect
- Node with no `highlight` (dead click)
- A 20+ node lesson with every node top-level — nothing to fold, nothing to stage
- Lead-only narration when the reason is non-obvious and no `[[aside]]`
- Output in `docs/` or a markdown essay instead of the HTML shell

## Rationalizations

| Excuse | Reality |
|--------|---------|
| «Тема очевидна, сразу HTML» | Outline first, then confirm |
| «Жёлтый/красный акцент выразительнее» | Coral is already the accent — and it is spoken for. It marks the current material, nothing else |
| «Перекрасим оболочку под тип урока» | Three tokens, three fixed roles. The `kind` is a tone on one dot |
| «Пусть читатель выберет акцент» | There is nothing to choose. The shell states the kind; it does not offer a preference |
| «Подберём синий под архитектуру» | The system has no blue, and a new hex is not a decision this lesson gets to make |
| «Стрелки сошлись на одной линии — так короче» | Separate rails or a visible overpass |
| «Ступенька в один кубик — мелочь» | Two boxes in one column get one straight line. A stair means the ports never lined up |
| «Узел декоративный, клик не нужен» | Every node id is in at least one step.highlight |
| «Схема большая — читатель просто отзумит» | Zoom is the escape hatch, not the plan. Group the nodes so the top level is 5–7 blocks |
| «Подпись на ребре длинная, но зато точная» | An edge label gets ~96px. Two-three words; the sentence goes to narration |
