# You Don't Know

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.12.0-violet.svg)](CHANGELOG.md)
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
In a repo session the lesson is written to `tmp/you-dont-know/<slug>/`.

## Build a lesson

```sh
node scripts/inject-lesson.mjs templates/lesson.html path/to/lesson.json path/to/index.html
```

The examples in this repo rebuild the same way:

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
group's corner toggles it by hand: its corner marks point out to open and in
to close, and on a folded block, which opens on a click anyway, it waits for
the pointer. The `Detail` switch flips the whole canvas between `auto`, `all`
and `step`. Once the reader has opened groups by hand, a button at the end of
the zoombar folds every one of them back and frames the whole diagram, and
`Esc` does the same; it disappears again once there is nothing to fold, and
the next step opens its own group as usual. See
[references/lesson-contract.md](references/lesson-contract.md) → *Staged detail*.
Folding or unfolding a group re-lays the canvas out, so the change is shown:
boxes glide to their new places, children come out of (or slide into) their
block, and viewfinder corners close in on the group that was toggled.

A click on a box opens its step. An open group answers on its head strip,
the band its caption sits in, and a click there folds it, as a click on a
folded block opens it; inside the fence is canvas, so a click between two
boxes does nothing and a drag there pans. Under the pointer a group, and a
box that stands outside any group, show a panel over them: the step, as the
word, the rail's numbered callout and the title, then the links (⇄).
Folding stays with the group's head and its disc. A box inside a
group shows its actions as discs on its top border instead, the size of a
group's: the step its click opens, numbered as on the rail, and its links;
each disc names itself in a tooltip when the pointer reaches it.

Links are the other half of a box's story. A step lights the flow its
narration is about; what else the box talks to — a retry looping back, an
answer going home, the screens a store serves — stays faint, or folded into
a block. `L` on the box under the pointer or keyboard focus, its ⇄ disc, or
a long press on a touch screen puts that box and every edge it has on
screen, both ways: the groups holding it and its partners open, every other
group folds, the rest steps back, and the dock lists the partners, one row
each with every link to it. `Path` in the bar over the canvas widens it to
everything that leads to the box and everything it leads to. `Esc`, `L`
again, a click on empty canvas or a step change leaves, and the frame goes
back to where the reader had it.

Lit edges carry tokens that leave every edge at one rhythm and run at one
speed whatever its length: a long edge carries several, evenly spaced — the
gap widens with the edge, up to three times, so a long rail holds about
three — and a short one rests between them. A two-way edge carries them each way.

The chrome stays out of the diagram's way. The step rail is a dimension line
down the left margin — a tick per step, the current one circled — and it opens
its titles *over* the canvas on hover or keyboard focus, so the diagram never
reflows. Narration and code sit in a dock the shell frames *around*: the scale
comes from the larger of the two areas that clear it, and the diagram is moved
off centre only as far as it takes to get out from under the panel. When a
step has more than the dock shows, a disc on its top border (a group fence's
disc, carrying a chevron) takes it to full height in one press and back, and
its top edge is a grip for everything in between — drag it, or focus it and
use ↑ ↓. The diagram re-frames around whatever height the reader picks. A step
that fits shows neither.

Two buttons in the top bar take chrome away. One hides the dock and gives the
whole sheet to the diagram. Dzen, the focus mode, goes further: it drops what
*describes* the lesson — the kicker with its kind, the thesis, the `Brief`
button, the dock — and keeps what *drives* it: the title, the step controls
and the rail. Leaving Dzen brings the dock back the way the reader had it.
Both are for the session only; a reload opens the full layout.

What is read once rather than per step — the catch, the naive alternative,
the cost, and the thesis in full — is behind the `Brief` button. It opens in
its own dialog, so it can run as long as the mechanism needs: a blank line
starts a new paragraph, and the title and close button stay pinned while it
scrolls.

## Colour

The shell is built on the `<AG/>` design system: a void ground (`#0b0712`), Unbounded / Onest / JetBrains Mono, radii no larger than 6px, hairline strokes, and elevation by stepping the surface, with a shadow only on what floats over the canvas (the dock, the open rail, the zoombar, the aside pop, the brief). Three hues, each with one job:

| Token | | Role |
|-------|---|------|
| `--color-primary` | violet | focus rings, structural marks |
| `--color-accent` | coral | the current material — this step, this node, this edge |
| `--color-accent-2` | peach | status: a `boundary` node, the headings of the brief |

Edges are the one place a lesson picks a colour, and it picks a token, not a value: `edges[].tone` is `ink-soft` (default), `ink`, `primary` or `accent-2`, next to `edges[].line`, which is `solid`, `dashed`, `dotted` or `chain`. Coral is refused: a lit edge is coral whatever its tone.

The shell does not repaint per lesson. `kind` sets the tone of one dot in the kicker (violet · muted ink · peach) and the chrome names the kind in words — the reader has nothing to choose. `accent` in the JSON is legacy: old values still parse so existing lessons rebuild untouched, but nothing repaints.

Diagram glyphs follow [Lucide](https://lucide.dev) 24×24 outline icons ([ISC](https://github.com/lucide-icons/lucide/blob/main/LICENSE)). A node's `kind` picks its shape and default glyph; `nodes[].icon` names what the node is from a fixed, domain-neutral set — `database`, `cache`, `screen`, `function`, `key`, `route`, `server` and 21 more — so a lesson can tell a database from a handler without inventing shapes. The shapes stay few — a rect, a stadium (`start`, `queue`, `cloud`), a circle for a `junction`, the group fence — and the glyph says the rest.

## Roadmap

- [x] Locked lesson shell, contract, `inject-lesson.mjs`
- [x] `npx`-shaped installer (`bin/install.mjs`)
- [x] Publish `@gorand/you-dont-know` to npm
- [x] Fold every group back in one action, without a permanent control
- [x] A click on an open group, as opposed to a click on a box inside it:
  the group's head strip folds the group, a box opens its step, and the
  hover says which, in the rail's own marks
- [x] One box and every link it has, both ways (`L`), and the whole process
  through it (`Path`)

## Versioning

SemVer. See [CHANGELOG.md](CHANGELOG.md). Current: **0.12.0** (`package.json` and `SKILL.md` `metadata.version`).

## Contract

See [references/lesson-contract.md](references/lesson-contract.md) and [SKILL.md](SKILL.md).

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md) · [RELEASING.md](RELEASING.md) · [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) · [SECURITY.md](SECURITY.md)

## License

MIT. See [LICENSE](LICENSE).
