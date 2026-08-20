# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] — 2026-08-20

### Changed

- `folder` card is a rounded rect (Lucide folder glyph + label). No tab polygon — arrows hit the box like `process`.

## [0.2.1] — 2026-08-20

### Removed

- Polygon shells `data`, `document`, `store`, `cpu` (artifacts; ortho arrows missed the outline)

### Changed

- `cloud` is a stadium card with the Lucide cloud glyph, not a freehand blob

## [0.2.0] — 2026-08-20

### Added

- Flowchart shapes: `start`, `decision`, `data`, `document`, `store`, `cloud`, `cpu`, `queue`, `folder`, `file`, `group`, `junction`, `subroutine`
- Group fences (`kind: "group"` + `nodes[].parent`)
- `layout: "tree"` for folder/file indent
- Edge kinds `dashed` | `back` | `both` and `edges[].via`
- Lucide 24×24 outline glyphs (`currentColor`, stroke 2)
- Debug lesson `examples/palette/`
- SemVer in `package.json` and skill `metadata.version`

### Changed

- Selected step in the left rail has a stronger hover than the selected rest state
- `child` / `other` alias `process`; `hoc` aliases `frame`; `consumer` aliases `inbox`

### Fixed

- Default “other” glyph is no longer a 2px circle

## [0.1.0] — 2026-08-20

### Added

- Locked lacquer shell, iris / glacier / dusk accents, inject script, how-promise example
