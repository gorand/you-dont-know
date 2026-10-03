# You Don't Know

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.9.1-violet.svg)](CHANGELOG.md)
[![Agent Skills](https://img.shields.io/badge/Agent_Skills-spec-informational.svg)](https://agentskills.io/specification)
[![npm](https://img.shields.io/badge/npm-%40gorand%2Fyou--dont--know-cb3837.svg)](https://www.npmjs.com/package/@gorand/you-dont-know)

Interactive HTML lessons for things that look simple until they aren't — the You Don't Know JS vibe.

Same locked shell for:

- a **construction / pattern** in a codebase
- **architecture** from cited files
- a **general API or concept** (Promises, REST, Node.js, vulnerabilities, …)

Not a blog post. A stepped diagram, narration, and code.

## Install

Requires [Node.js](https://nodejs.org/) 18+.

```sh
npx @gorand/you-dont-know            # ./.claude/skills/you-dont-know — this project only
npx @gorand/you-dont-know --global   # ~/.claude/skills/you-dont-know — every project
```

(package `@gorand/you-dont-know`; the installed folder and the `/you-dont-know`
command stay named `you-dont-know` either way). `--help` lists the rest
(`--agents`, `--target <dir>`). This only copies the skill files — it is
never a dependency of your project. You can also run the installer from a
local clone with `node bin/install.mjs [options]`.

**Any other harness that reads the [Agent Skills](https://agentskills.io/specification) layout**
(`.agents/skills/<name>/SKILL.md`): either `node bin/install.mjs --agents` /
`--agents --global`, or copy this folder by hand into
`~/.agents/skills/you-dont-know/` or a project's `.agents/skills/you-dont-know/`.
Claude Code itself does **not** read that path — see above.

Once installed where your harness looks for skills, invoke explicitly:
`/you-dont-know` plus a topic, or `/you-dont-know` in a repo to hunt candidates.

## Build a lesson

```sh
npm run example
npm run palette   # debug every node/edge kind
npm run dense     # 31 nodes, 6 groups — staged detail + zoom
```

Open `examples/how-promise/index.html` or `examples/palette/index.html` (`file://` is enough).

## Reading a big diagram

The canvas is a board, not a picture. `Ctrl`/`⌘` + wheel zooms at the cursor
(trackpad pinch too), `Shift` + wheel pans sideways, a plain wheel pans, and
dragging empty canvas moves it; `+` `-` `0` (fit) `1` (100%) `2` (zoom to the
current step) are the keys, and the corner zoombar does the same by mouse.

The layout runs on one 16px cell — every box, gap and pad is a whole number
of them, the grid under the diagram draws that same unit, and the gap between
rows is the corridor each horizontal edge run is routed into. So arrows go
*between* boxes instead of along them, and a same-row arrow has six cells to
carry its label.

Past ~12 nodes the shell also stages the diagram: groups fold into single
blocks, and each step opens exactly the group it talks about. The disc on a
group's corner toggles it by hand — its corner marks point out to open and in
to close — and the `Detail` switch flips the
whole canvas between `auto`, `all` and `step`. See
[references/lesson-contract.md](references/lesson-contract.md) → *Staged detail*.

The chrome stays out of the diagram's way. The step rail is a dimension line
down the left margin — a tick per step, the current one circled — and it opens
its titles *over* the canvas on hover or keyboard focus, so the diagram never
reflows. Narration and code sit in a dock the shell frames *around*: the scale
comes from the larger of the two areas that clear it, and the diagram is moved
off centre only as far as it takes to get out from under the panel. When a
step has more than the dock shows, a disc on its top border, the same one a
group fence carries, takes it to full height in one press and back, and its top edge is a grip for everything in
between — drag it, or focus it and use ↑ ↓. The diagram re-frames around
whatever height the reader picks. A step that fits shows neither.
Folding or unfolding a group re-lays the canvas out, so the change is shown:
boxes glide to their new places, children come out of (or slide into) their
block, and viewfinder corners close in on the group that was toggled. Everything
read once rather than per step — the thesis, the catch, the naive alternative,
the cost — is behind the `Brief` button.

Default working copy for a repo session: `tmp/you-dont-know/<slug>/`.

## Colour

The shell is built on the `<AG/>` design system: a void ground (`#0b0712`), Unbounded / Onest / JetBrains Mono, radii no larger than 6px, hairline strokes, and elevation by stepping the surface rather than by shadow. Three hues, each with one job:

| Token | | Role |
|-------|---|------|
| `--color-primary` | violet | focus rings, structural marks |
| `--color-accent` | coral | the current material — this step, this node, this edge |
| `--color-accent-2` | peach | status: a `boundary` node, the lesson's catch |

Edges are the one place a lesson picks a colour, and it picks a token, not a value: `edges[].tone` is `ink-soft` (default), `ink`, `primary` or `accent-2`, next to `edges[].line`, which is `solid`, `dashed`, `dotted` or `chain`. Coral is refused: a lit edge is coral whatever its tone.

The shell does not repaint per lesson. `kind` sets the tone of one dot in the kicker (violet · muted ink · peach) and the chrome names the kind in words — the reader has nothing to choose. `accent` in the JSON is legacy: old values still parse so existing lessons rebuild untouched, but nothing repaints.

Diagram glyphs follow [Lucide](https://lucide.dev) 24×24 outline icons ([ISC](https://github.com/lucide-icons/lucide/blob/main/LICENSE)). A node's `kind` picks its shape and default glyph; `nodes[].icon` names what the node is from a fixed, domain-neutral set — `database`, `cache`, `screen`, `function`, `key`, `route`, `server` and 21 more — so a lesson can tell a database from a handler without inventing shapes. Card shells are rect, stadium, or group fence. `folder` / `file` use the rect + glyph — not a tab polygon. `cloud` is Lucide on a stadium.

## Roadmap

- [x] Locked lesson shell, contract, `inject-lesson.mjs`
- [x] `npx`-shaped installer (`bin/install.mjs`)
- [x] Publish `@gorand/you-dont-know` to npm

## Versioning

SemVer. See [CHANGELOG.md](CHANGELOG.md). Current: **0.9.1** (`package.json` and `SKILL.md` `metadata.version`).

## Contract

See [references/lesson-contract.md](references/lesson-contract.md) and [SKILL.md](SKILL.md).

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md) · [RELEASING.md](RELEASING.md) · [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) · [SECURITY.md](SECURITY.md)

## License

MIT. See [LICENSE](LICENSE).
