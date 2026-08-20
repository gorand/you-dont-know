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

- `lang`: `en` | `ru` | … — chrome follows this (`Назад` / `Back`)
- `kind`: `how` | `concept` | `api` → **iris**; `architecture` | `repo` → glacier; `security` | `vuln` → dusk. Default iris.
- Optional `accent` overrides `kind`: `iris` | `glacier` | `dusk` only. Forbidden as primary: red, amber, green (and old names `cinnabar`, `patina`, `kinpaku`).
- State colors are shell tokens `--state-error` / `--state-warn` / `--state-ok`. JSON must not restyle them. `kind: "boundary"` stays error-red in every accent.
- `--node-fill` is achromatic. Do not put red / amber / green in `accent`.
- Optional `layout`: `"timeline"` | `"layers"` | `"tree"` | `"auto"`. `"tree"` indents `folder` / `file` by `parent`. `"auto"` uses tree only when every node is folder/file; uses group layout if any `kind: "group"`.
- Optional `nodes[].parent`: id of a `group` (fence) or, in `layout: "tree"`, a folder
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
- Edges: the shell places split-row arrows on **separate rails** with a lacquer overpass. Do not pack four labels onto one shared bus in JSON either — keep labels short
