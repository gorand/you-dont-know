# You Don't Know

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.5.0-violet.svg)](CHANGELOG.md)
[![Agent Skills](https://img.shields.io/badge/Agent_Skills-spec-informational.svg)](https://agentskills.io/specification)
[![npm](https://img.shields.io/badge/npm-not_yet_published-lightgrey.svg)](#roadmap)

Interactive HTML lessons for things that look simple until they aren't — the You Don't Know JS vibe.

Same locked shell for:

- a **construction / pattern** in a codebase
- **architecture** from cited files
- a **general API or concept** (Promises, REST, Node.js, vulnerabilities, …)

Not a blog post. A stepped diagram, narration, and code.

## Install

Requires [Node.js](https://nodejs.org/) 18+. **Not yet published to npm** — see
[Roadmap](#roadmap). Until it is, run the installer from a local clone:

```sh
node bin/install.mjs            # ./.claude/skills/you-dont-know — this project only
node bin/install.mjs --global   # ~/.claude/skills/you-dont-know — every project
```

Once published, the same tool runs via `npx @gorand/you-dont-know [options]`
(package `@gorand/you-dont-know`; the installed folder and the `/you-dont-know`
command stay named `you-dont-know` either way). `--help` lists the rest
(`--agents`, `--target <dir>`). This only copies the skill files — it is
never a dependency of your project.

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
blocks with a child count, and each step opens exactly the group it talks
about. Any chevron toggles a group by hand, and the `Detail` switch flips the
whole canvas between `auto`, `all` and `step`. See
[references/lesson-contract.md](references/lesson-contract.md) → *Staged detail*.

Default working copy for a repo session: `tmp/you-dont-know/<slug>/`.

## Accents

Lacquer surfaces. Node ink is always light (`--node-ink`). Primary is never traffic-light.

| kind in JSON | color |
|--------------|--------|
| `how` / `concept` / `api` | iris (violet) — default |
| `architecture` / `repo` | glacier (blue) |
| `security` / `vuln` | dusk (blue-violet) |

Error / warning / success live in `--state-*` and do not change with the switcher.

Diagram glyphs follow [Lucide](https://lucide.dev) 24×24 outline icons ([ISC](https://github.com/lucide-icons/lucide/blob/main/LICENSE)). Card shells are rect, stadium, diamond, or group fence. `folder` / `file` use the rect + glyph — not a tab polygon. `cloud` is Lucide on a stadium.

## Roadmap

- [x] Locked lesson shell, contract, `inject-lesson.mjs`
- [x] `npx`-shaped installer (`bin/install.mjs`)
- [ ] Publish `@gorand/you-dont-know` to npm — `private: true` and
      `publishConfig.access: "public"` are already set in `package.json`;
      publishing itself (npm account, `npm login`, `npm publish`) is a
      deliberate manual step, not yet done. Track progress here and in
      [CHANGELOG.md](CHANGELOG.md); install from a local clone until it lands.

## Versioning

SemVer. See [CHANGELOG.md](CHANGELOG.md). Current: **0.5.0** (`package.json` and `SKILL.md` `metadata.version`).

## Contract

See [references/lesson-contract.md](references/lesson-contract.md) and [SKILL.md](SKILL.md).

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md) · [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) · [SECURITY.md](SECURITY.md)

## License

MIT. See [LICENSE](LICENSE).
