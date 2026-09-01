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
  version: "0.3.2"
disable-model-invocation: true
argument-hint: "[topic-or-path]"
---

# You Don't Know

Interactive HTML lesson — You Don't Know JS vibe. Same locked shell for **any** topic: a pattern in this repo, architecture from cited files, or a general concept (Promise, REST, Node ecosystem, vulns).

**Core principle:** Propose the lesson shape. Build after confirmation. Artifact under `tmp/you-dont-know/<slug>/`.

**REQUIRED SUB-SKILL:** locked shell [templates/lesson.html](templates/lesson.html). Lacquer surfaces. Default accent **iris** (`kind: "how"`). Do not invent a skin. Primary is never red / amber / green.  
**REQUIRED BACKGROUND:** [references/lesson-contract.md](references/lesson-contract.md). Inject with `node scripts/inject-lesson.mjs`.

## Accents by kind

| `kind` | Accent | Use |
|--------|--------|-----|
| `how` `concept` `api` | **iris** (violet) | How it works |
| `architecture` `repo` | glacier (blue) | Structure of *this* system |
| `security` `vuln` | dusk (blue-violet) | Attacks, trust, isolation |

`--state-error` / `--state-warn` / `--state-ok` are locked (red / amber / green). They never follow `data-accent`. Do not use those hues as `--primary`. Chrome switcher: iris · glacier · dusk only.

Do not restyle `:root` per lesson.

## Color lock

Traffic-light hues are **state**, not brand.

| Token | Hue window (oklch) | Role |
|-------|--------------------|------|
| `--state-error` | 20–50 | error / `kind: "boundary"` |
| `--state-warn` | 70–110 | warning / «Проблема» |
| `--state-ok` | 125–165 | success |
| `--primary` | 200–320 only | iris · glacier · dusk |

`--state-*` never follow `data-accent`. Node titles use `--node-ink` (`#f4f2ee`) on achromatic `--node-fill` (chroma 0). Mix highlight in `srgb`, not `oklch` — oklch hue interpolation through 95→232 crosses green.

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
4. Visual-QA `index.html`: node labels readable on dark fill; Lucide glyphs not a 2px circle; `` `code` `` as chips; every node clickable; edges on separate rails; asides = overlay; live/error/ok strokes still distinct from `--primary`. Selected step in the rail must visibly hover darker than the selected rest state.

Shell vocabulary (shapes, groups, tree, edge kinds) lives in `examples/palette/` — rebuild after template edits.

Default dest is `tmp/`. Never `docs/` unless asked.

## Red flags — STOP

- Building before confirmation
- Gold / kinpaku / cream paper
- Primary accent in red / amber / green (steals error / warning / success)
- Node label that inherits SVG black (`currentColor`) — ink must be `--node-ink`
- Shared collinear edge bus that hides where an arrow goes
- Tab / sheet polygon for `folder` or `file` — Lucide glyph + path label already say directory; shell is a rounded rect
- Node with no `highlight` (dead click)
- Lead-only narration when the reason is non-obvious and no `[[aside]]`
- Output in `docs/` or a markdown essay instead of the HTML shell

## Rationalizations

| Excuse | Reality |
|--------|---------|
| «Тема очевидна, сразу HTML» | Outline first, then confirm |
| «Жёлтый/красный акцент выразительнее» | Primary = iris / glacier / dusk. Red stays error |
| «Cinnabar для security» | Security = dusk. Boundary/error keeps `--state-error` |
| «Стрелки сошлись на одной линии — так короче» | Separate rails or a visible overpass |
| «Узел декоративный, клик не нужен» | Every node id is in at least one step.highlight |
