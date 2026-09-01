# Examples

## `how-promise`

General `kind: "how"` lesson (iris, microtask queue).

## `palette`

Abstract debug surface: ISO shapes, Lucide architecture glyphs, group fences, folder list, edge kinds (`flow` / `dashed` / `back` / `both` / `via`). Placeholder-length labels — not representative of real prose density.

## `inject-pipeline`

Real `kind: "architecture"` lesson (glacier, ru), grounded in this skill's own build pipeline (`SKILL.md` → `inject-lesson.mjs` → `templates/lesson.html`). Unlike `palette`, content is realistic: 11 nodes across 9 kinds (`start`/`process`/`decision`/`group`/`file`/`subroutine`/`boundary`/`action`/`inbox`), a `group` with a nested `file`, two `back` edges, one `dashed` edge, 8 steps, 6 asides, full-length Cyrillic narration, and code excerpts up to 12 lines. Use this one — not `palette` — to judge real-world layout, wrapping, and inspector-panel behavior; `palette` stays the shape-vocabulary reference.

Build (from the skill root):

```sh
npm run example   # how-promise
npm run palette    # palette
npm run stress      # inject-pipeline

# same three against templates/lesson.next.html, output as index.next.html
npm run example:next
npm run palette:next
npm run stress:next

# all six in one shot
npm run build:compare
```
