# Design harness — for iterating on `templates/lesson.next.html`

Working checklist assembled from external design skills, filtered down to what
actually applies to this artifact: **one self-contained HTML file, vanilla
CSS/JS, a hand-rolled SVG node-diagram engine, no framework, no build step,
Google Fonts as the only external dependency.** Most external skills assume
React/Tailwind/GSAP marketing sites — those parts are excluded below, not
silently skipped.

## Precedence

1. `SKILL.md` — Hard gates, Color lock, Rationalizations. Always wins.
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

## Checklist

### Accessibility
- [ ] Every clickable SVG node (`.node`) is keyboard-reachable: `tabindex="0"`, `role="button"`, `aria-label`, and responds to `Enter`/`Space`, not just `click`.
- [ ] Icon-only controls (accent swatches) get `aria-label`, not just `title`.
- [ ] Decorative `<svg class="ico">` stay `aria-hidden="true"` (already true — keep it true for any new icon).
- [ ] `:focus-visible` ring stays visible on every new interactive element (nodes included) — don't rely on the global rule alone if the element sits inside an SVG.

### Motion
- [x] `prefers-reduced-motion: reduce` must stop the SVG `<animateMotion>` token on live edges too — done via `REDUCE_MOTION` + `tokenMark()` (JS `matchMedia` check; static dot instead of `<animateMotion>`).
- [x] Keep animating only `transform`/`opacity`-equivalent properties; never `transition: all` (already true, verified — no rule found).
- [ ] Any new animation must be interruptible (user can navigate mid-transition without visual glitch).

### Typography
- [x] Ellipsis character `…`, never `...` (verified — no literal `...` in chrome copy).
- [x] `text-wrap: balance` on `h1`.
- [x] Numbers that are compared/aligned (counter, line numbers) stay `font-variant-numeric: tabular-nums` (already true).

### Dark mode / meta
- [x] `<meta name="theme-color" content="#0c0b09">` matching `--lacquer`.
- [x] `color-scheme: dark` stays on `html` (already true).

### Touch
- [x] `touch-action: manipulation` on nodes, `.ctrl`, `.step`, `.accents button`, `.fn`.

### Shape / color / tactile (taste-skill subset)
- [x] One corner-radius scale (`--r`) for rects; circular exceptions (accent swatches, junction nodes, `.fn`) stay the only documented exception — verified, not changed.
- [ ] `.ctrl.primary` text-on-background contrast ≥ 4.5:1 — verify after any palette tweak, not just at accent-lock time.
- [x] Every clickable surface (node, step, button, accent swatch, aside `.fn`) has a visible pressed/active state now — `:active { transform: scale(...) }` added where missing (nodes, rail steps, accent swatches, `.fn`); `.ctrl` already had it.

### Sheen — tried, reverted
- [x] Spacing scale audited (`grep -oE '(padding|margin|gap): [^;]+;'`): consistent 2px-step grid off a 4/8px base (4·6·8·10·12·14·16·20·24), no stray odd values. No changes made — it was already coherent.
- [x] Tried a top-highlight sheen on `.inspector` / `.code-head` / `.pop`, and an inset gloss edge on `button.ctrl.primary`. Reverted — the only justification was "the token is named `--lacquer`," not an actual legibility/hierarchy problem the flat surfaces had. `--hairline` borders and the distinct `--lacquer`/`--raised`/`--graphite` fills already separate the zones. Don't re-add this without a concrete problem it solves (see Motion Motivation rule below, same logic applies to any visual treatment, not just animation).
- [ ] Deliberately left flat: `.top` header, `.rail`, `.stage`, `.notes` footer, `.step`/node fills — flush-in-grid panels, not floating cards (taste-skill: "cards only when elevation communicates real hierarchy").

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

## Workflow

```sh
# rebuild the current (shipped) template's examples
npm run palette && npm run example

# rebuild the experimental template's examples, same fixtures
npm run palette:next && npm run example:next

# both in one shot
npm run build:compare
```

`templates/lesson.html` stays the one `SKILL.md` points to and the one real
invocations use. `templates/lesson.next.html` is the working copy — edit only
this one during the design pass. Compare `examples/*/index.html` (current)
against `examples/*/index.next.html` (next) side by side in the browser.
Promote by copying `lesson.next.html` over `lesson.html` only once the user
signs off.
