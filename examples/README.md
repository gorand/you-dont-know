# Examples

## `how-promise`

General `kind: "how"` lesson (iris, microtask queue).

## `palette`

Abstract debug surface: ISO shapes, Lucide architecture glyphs, group fences, folder list, edge kinds (`flow` / `dashed` / `back` / `both` / `via`). Placeholder-length labels — not representative of real prose density.

## `inject-pipeline`

Real `kind: "architecture"` lesson (glacier, ru), grounded in this skill's own build pipeline (`SKILL.md` → `inject-lesson.mjs` → `templates/lesson.html`). Unlike `palette`, content is realistic: 11 nodes across 9 kinds (`start`/`process`/`decision`/`group`/`file`/`subroutine`/`boundary`/`action`/`inbox`), a `group` with a nested `file`, two `back` edges, one `dashed` edge, 8 steps, 6 asides, full-length Cyrillic narration, and code excerpts up to 12 lines. Use this one — not `palette` — to judge real-world layout, wrapping, and inspector-panel behavior; `palette` stays the shape-vocabulary reference.

## `dense-request`

The staged-detail reference: 31 nodes (25 of them inside groups), 6 groups, 29 edges, `detail: "progressive"` (ru, iris). Deliberately past the point where one flat diagram stops being readable — the top level is six blocks, each step opens the group it narrates, and the rest stay folded. Use this one to judge the canvas viewport (Ctrl+wheel zoom, Shift+wheel, drag), the collapsed-block treatment, merged `×N` edges, and the auto-framing floor that keeps a step legible instead of fitting everything to nothing. Content is canonical, not from this repo.

Build (from the skill root):

```sh
npm run example   # how-promise
npm run palette   # palette
npm run stress    # inject-pipeline
npm run dense     # dense-request

# all four in one shot
npm run build
```

For a `templates/lesson.next.html` design-pass workflow (a working copy of
the shell to compare against the shipped one before promoting), see
`references/design-harness.md` — that file isn't kept in the repo at rest,
only recreated for the duration of a design pass.
