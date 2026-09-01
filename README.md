# You Don't Know

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.3.0-violet.svg)](CHANGELOG.md)
[![Agent Skills](https://img.shields.io/badge/Agent_Skills-spec-informational.svg)](https://agentskills.io/specification)

Interactive HTML lessons for things that look simple until they aren't — the You Don't Know JS vibe.

Same locked shell for:

- a **construction / pattern** in a codebase
- **architecture** from cited files
- a **general API or concept** (Promises, REST, Node.js, vulnerabilities, …)

Not a blog post. A stepped diagram, narration, and code.

## Install

Requires [Node.js](https://nodejs.org/) 18+.

**Claude Code (recommended):**

```sh
npx you-dont-know            # ./.claude/skills/you-dont-know — this project only
npx you-dont-know --global   # ~/.claude/skills/you-dont-know — every project
```

`npx you-dont-know --help` lists the rest (`--agents`, `--target <dir>`). This
runs `bin/install.mjs`, which copies the skill files — it is not a dependency
of your project. Until this package is published to npm, run it from a local
clone instead: `node bin/install.mjs [options]`, or `npx <path-to-this-repo>
[options]`.

**Any other harness that reads the [Agent Skills](https://agentskills.io/specification) layout**
(`.agents/skills/<name>/SKILL.md`): either `npx you-dont-know --agents` /
`--agents --global`, or copy this folder by hand into
`~/.agents/skills/you-dont-know/` or a project's `.agents/skills/you-dont-know/`.
Claude Code itself does **not** read that path — see above.

Once installed where your harness looks for skills, invoke explicitly:
`/you-dont-know` plus a topic, or `/you-dont-know` in a repo to hunt candidates.

## Build a lesson

```sh
npm run example
npm run palette   # debug every node/edge kind
```

Open `examples/how-promise/index.html` or `examples/palette/index.html` (`file://` is enough).

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

## Versioning

SemVer. See [CHANGELOG.md](CHANGELOG.md). Current: **0.3.0** (`package.json` and `SKILL.md` `metadata.version`).

## Contract

See [references/lesson-contract.md](references/lesson-contract.md) and [SKILL.md](SKILL.md).

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md) · [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) · [SECURITY.md](SECURITY.md)

## License

MIT. See [LICENSE](LICENSE).
