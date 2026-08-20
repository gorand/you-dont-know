# Examples

## `how-promise`

General `kind: "how"` lesson (iris, microtask queue).

## `palette`

Abstract debug surface: ISO shapes, Lucide architecture glyphs, group fences, folder list, edge kinds (`flow` / `dashed` / `back` / `both` / `via`).

Build:

```sh
node ../scripts/inject-lesson.mjs \
  ../templates/lesson.html \
  how-promise/lesson.json \
  how-promise/index.html

node ../scripts/inject-lesson.mjs \
  ../templates/lesson.html \
  palette/lesson.json \
  palette/index.html
```

Or from the skill root: `npm run example` and `npm run palette`.
