# Releasing

## The one thing to understand first

`npm publish` does not read git. It packs the **working directory** as it is
on disk, filtered by `files` in `package.json`, reads `version` from
`package.json`, and uploads that. Branch, tag and commit are irrelevant to
it. The only gate the registry enforces is that a version already published
cannot be published again.

Two consequences:

- You can publish a dirty tree, a feature branch, or the wrong thing, and
  npm will accept it. Discipline is the whole protection — which is why
  `npm run release` exists.
- You can publish **any** past version from **any** machine by checking out
  its tag, because a checkout gives you exactly that version's tree.

## Where tags live

On the **merge commit on `main`**, one per published version, annotated.

| Version | Tag | Merge commit |
|---|---|---|
| 0.5.4 | `v0.5.4` | `ab89383` — PR #9, contract corrections |
| 0.6.0 | `v0.6.0` | `f18767a` — PR #10, the design-system redesign |
| 0.6.1 | `v0.6.1` | `a253e37` — PR #11, keyboard access and contrast |

Merge pull requests with **“Create a merge commit”**. Squash rewrites the
branch into one commit and destroys the thematic history the branch was split
into, release commit included.

## Publishing a version that is already tagged

Works from a fresh clone on any machine that has an npm token.

```sh
git clone git@github.com:gorand/you-dont-know.git && cd you-dont-know
npm install

git checkout v0.5.4 && npm run release --silent && npm publish
git checkout v0.6.0 && npm run release --silent && npm publish
git checkout v0.6.1 && npm run release --silent && npm publish
git checkout main
```

**Publish in ascending version order.** npm's `latest` tag follows whatever
was published *last*, not the highest number. If the order slips:

```sh
npm dist-tag add @gorand/you-dont-know@0.6.1 latest
```

`npm publish --dry-run` runs the whole path without uploading. `npm pack
--dry-run` prints the file list that would ship.

## Cutting a new release

1. Work on a branch. The last commit on it is `chore(release): X.Y.Z`, which
   touches only `CHANGELOG.md`, `SKILL.md`, `README.md` and `package.json`.
2. Merge the PR into `main` with a merge commit.
3. `git checkout main && git pull`
4. `npm run release` — it refuses if anything is off.
5. `npm run release -- --tag` — creates the annotated tag on `main`'s tip,
   with its message taken from the CHANGELOG.
6. `git push origin vX.Y.Z`
7. `npm publish`
8. Make a GitHub Release from the tag, body = that CHANGELOG section:
   `gh release create vX.Y.Z --title "X.Y.Z" --notes-file -` (paste the
   section), or the web UI.

## What `npm run release` checks

It never publishes and never pushes. It fails, rather than warns, when:

- the version disagrees between `package.json`, `SKILL.md` and README's badge
  and prose — a bump that touched only `package.json` has shipped before;
- `CHANGELOG.md` has no section for it;
- the working tree is dirty;
- an **untracked** file sits inside a directory `files` publishes wholesale.
  `examples/` and `templates/` ship entire, so scratch output there rides
  along into the tarball silently;
- rebuilding the examples changes them, i.e. the artifacts about to be
  published are not what the current template produces;
- the version is already on the registry.

`--offline` skips the registry check. `--tag` adds the tag after the rest
pass.
