# Examples

## `how-promise`

General `kind: "how"` lesson (microtask queue).

## `palette`

Abstract debug surface: ISO shapes, Lucide architecture glyphs, group fences, folder list, edge kinds (`flow` / `dashed` / `back` / `both` / `via`), and the `line` types and `tone`s — unlit on the last step, the same edges lit on the one before it. Placeholder-length labels — not representative of real prose density.

## `inject-pipeline`

Real `kind: "architecture"` lesson (ru), grounded in this skill's own build pipeline (`SKILL.md` → `inject-lesson.mjs` → `templates/lesson.html`). Unlike `palette`, content is realistic: 11 nodes across 9 kinds (`start`/`process`/`decision`/`group`/`file`/`subroutine`/`boundary`/`action`/`inbox`), a `group` with a nested `file`, two `back` edges, one `dashed` edge, 8 steps, 6 asides, full-length Cyrillic narration, and code excerpts up to 12 lines. Use this one — not `palette` — to judge real-world layout, wrapping, and dock behavior; `palette` stays the shape-vocabulary reference.

## `dense-request`

The staged-detail reference: 31 nodes (25 of them inside groups), 6 groups, 29 edges, `detail: "progressive"` (ru). Deliberately past the point where one flat diagram stops being readable — the top level is six blocks, each step opens the group it narrates, and the rest stay folded. Use this one to judge the canvas viewport (Ctrl+wheel zoom, Shift+wheel, drag), the collapsed-block treatment, merged `×N` edges, and the auto-framing floor that keeps a step legible instead of fitting everything to nothing. Content is canonical, not from this repo.

## `mfe-architecture`

A real-world hard case, anonymised: an agent's `kind: "architecture"` lesson about a Module Federation microfrontend with 11 exposes (ru), kept as the agent wrote it, not tidied up. 30 nodes in 6 groups, 22 edges (7 of them `Routes` fanning out of one node), 8 steps, 5 asides, `detail: "progressive"`. Product names, endpoints and ids are replaced, and the code excerpts are rewritten, but each one has the same shape and line count as the original. The wide `vite.config.ts` excerpt (15 lines) is the one to judge the dock against. Its flaws are the point: look here for what the skill still gets wrong on a real repo, and before changing anything, compare with `dense-request` (canonical content) to tell an engine problem apart from an authoring one.

Build (from the skill root):

```sh
npm run example   # how-promise
npm run palette   # palette
npm run stress    # inject-pipeline
npm run dense     # dense-request
npm run mfe       # mfe-architecture

# all five in one shot
npm run build
```

For a `templates/lesson.next.html` design-pass workflow (a working copy of
the shell to compare against the shipped one before promoting), see
`references/design-harness.md` — that file isn't kept in the repo at rest,
only recreated for the duration of a design pass.
