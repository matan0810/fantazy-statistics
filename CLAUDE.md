# Hall of Fame: working procedure

Hall of Fame (repository `fantazy-statistics`) is the record of our fantasy league: every
season of four competitions, its podium and final table, player pages and all-time
records, in Hebrew and English. A static React site on GitHub Pages.
Live at https://matan0810.github.io/fantazy-statistics.

This file is binding. Follow it on every task, in every session.

## 1. Ground rules

- The owner writes in Hebrew. Answer in Hebrew.
- Everything in the repository is in English: docs, code comments, commit messages. The only
  Hebrew is interface text (`src/i18n/strings.ts`) and the league's data (names, teams).
- Keep the site simple. A new feature earns a control only if it cannot be a default.
- `master` is production: every push to it deploys the site. **Nothing reaches `master`
  until the owner says to release** ("תעלה גרסה", "תמזג", "release", or the like). A request
  to fix or build something is not a request to release it.
- Never rewrite published history: no force push, no rebase of `dev` or `master`.
- No model names or IDs in commits, docs or code.
- No secrets in the repository.

## 2. Branches

| Branch         | Role                                                                                                                            | Who writes                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `dev`          | Integration. Every task lands here. CI runs every check on every push.                                                          | Claude                          |
| `master`       | Production. Every push deploys the site and, with a new version, tags a release.                                                | Claude, only on a release order |
| `dependabot/*` | Dependency updates, opened as pull requests against `dev`.                                                                      | Dependabot                      |
| other          | A session's own working branch, when the environment gives it one. It is fast-forwarded into `dev` and is otherwise disposable. | Claude                          |

`master` is always an ancestor of `dev`: work flows `dev` → `master` by fast-forward only.
(`gh-pages` is the old deploy target; it stays untouched until Pages is switched to Actions.)

Start every session with:

```
git fetch origin dev master
git checkout dev                 # or the session's working branch, reset to origin/dev
git pull --ff-only origin dev
git log --oneline -5 origin/master
git log --oneline origin/master..origin/dev   # what is waiting for the next release
```

If `master` has commits that `dev` lacks, stop and tell the owner; that should never happen.

## 3. Doing a task

1. **Understand.** Restate the request in one or two lines. If something is genuinely the
   owner's decision (look, scope, what counts as a record), ask before building.
2. **Plan.** For anything bigger than a small fix, outline the change and the files it
   touches. Update `DESIGN.md` when a rule, number or behaviour changes.
3. **Build** on `dev` (or a working branch based on it), in small commits that each leave the
   checks green.
4. **Test.** All of these, every time:
   - `npm run check` passes (types, ESLint, Prettier, unit tests).
   - New logic gets a unit test next to it (`*.test.ts`). Statistics are checked against the
     real data in `src/domain/stats.test.ts`.
   - Any UI change is checked in a real browser: `npm run build && npm run e2e` (extend
     `tests/e2e/smoke.mjs` for new screens or flows), and look at screenshots: desktop
     1280×800 and a 390px phone, Hebrew and English, no page errors and no sideways scroll.
5. **Record.** Add a line under `## [Unreleased]` in `CHANGELOG.md` for every change a visitor
   or the owner would notice, under Added, Changed, Fixed, Removed or Security. Update
   `README.md` when setup, commands or layout change, `SECURITY.md` when what is stored or
   which hosts the site talks to changes.
6. **Commit and push to `dev`.** From a working branch: push it, then
   `git push origin HEAD:dev` (a fast-forward; if `dev` moved, merge `origin/dev` first).
7. **Report** to the owner in Hebrew: what changed, what was tested and how, what was not
   tested, and anything they need to do by hand. Say plainly that it is on `dev` and not live.

### Updating results

League data lives in `src/data/` and is validated by `src/domain/parse.ts` when the site
loads and in the tests, so a bad edit fails the checks and never ships:

- `seasons.json`: one line per season: `id` (permanent, used in addresses), `competition`,
  `year` (the year it ended), optional `name`, and `pointsLost: true` when only the order is known.
- `results.json`: one line per player per season: `rank` (null if unknown), `points` (null
  exactly when the season's points were lost), `team`, `coach`.
- `players.json`: names in Hebrew and English, and the player's colour.
- `proofs.json`: screenshots per season id, files in `public/proofs/`.

A new season is a new `id`; never renumber one, since addresses (`#/season/12`) use it.

### Deferred work and ideas

Postponed work and ideas are GitHub issues, not TODO comments: one issue per topic, with what
was found and the options. Close the issue when the work ships, with the version.

### Definition of done

Checks green, browser checked when the UI changed, CHANGELOG updated, pushed to `dev`, CI on
`dev` green, owner told.

### Commits

- Imperative subject under 72 characters: `Add title streak record`, `Fix podium on phones`.
- A blank line and a short body when the reason is not obvious.
- One topic per commit. Release commits are exactly `Release vX.Y.Z`.

## 4. Code

- TypeScript in strict mode. No `any`, no non-null assertions; validate data from outside
  (the JSON files, `localStorage`) instead of casting it.
- Code layout is whatever Prettier produces. Comments say why, not what.
- One component per file, named like the file. Split a component that grows past about 150
  lines. Logic lives in `src/domain/` (pure, no React, no DOM) and in hooks, not in components.
- Styles are CSS Modules using the tokens in `src/styles/global.css`, with logical properties
  (`inline-start`, not `left`) so right-to-left works without special cases.
- Every text a visitor reads is in `src/i18n/strings.ts`, in both languages; a test checks
  that English has every Hebrew key.
- Buttons have a visible label or an `aria-label`; interactive elements are real `<button>`s
  and `<a>`s. Every screen has its own address.
- No new runtime dependency without a reason in the commit body: the site ships React and
  two fonts, nothing else.

## 5. What CI runs

`.github/workflows/checks.yml`, on every push to `dev` (and any working branch), every pull
request, and again on `master` before a deploy (`ci.yml` and `deploy.yml` both call it):

| Job                                    | What it proves                                               |
| -------------------------------------- | ------------------------------------------------------------ |
| Types, lint, format, audit, unit tests | `npm audit --omit=dev` (high and up), `npm run check`        |
| Browser smoke test                     | `npm run e2e` in Chromium: desktop and phone, he/en, offline |

A new check belongs in `checks.yml`, so `dev` and `master` can never drift apart.

## 6. Versions

Semantic versioning, `MAJOR.MINOR.PATCH`:

| Bump    | When                                         | Example                          |
| ------- | -------------------------------------------- | -------------------------------- |
| `patch` | Fixes only, or new results in the data       | a season's results added, a typo |
| `minor` | Anything new or changed that visitors notice | a new record, a new screen       |
| `major` | A break with the past                        | old addresses stop working       |

The version lives in `package.json` and `package-lock.json` (kept in step by `npm run bump`
and checked by a test) and is shown in the site's header.

## 7. Releasing (only on the owner's order)

A release is a push to `master` whose `package.json` version has no tag yet. Once the site is
deployed, `deploy.yml` tags that commit `vX.Y.Z` and publishes a GitHub release with the
version's CHANGELOG section. It also creates any missing tag from
`scripts/release-history.json`. Tags are created only by that workflow: cloud sessions cannot
push tags, so never try.

### Before

- [ ] `dev` is pushed and CI on `dev` is green.
- [ ] `## [Unreleased]` in `CHANGELOG.md` describes everything in
      `git log origin/master..origin/dev`. If it is empty there is nothing to release: say so.
- [ ] Pick the bump by section 6 and tell the owner which one and why.
- [ ] First release only: the owner switches **Settings → Pages → Source** to
      **GitHub Actions**, and `{ "version": "1.0.0", "commit": "2d0c4050c54397c8f4a76a379ca7425846675556" }`
      is added to `scripts/release-history.json` so the old site gets its `v1.0.0` tag.

### Release

```
npm run bump -- patch|minor|major     # version files + CHANGELOG section dated today
npm run check
git commit -am "Release vX.Y.Z"
git push origin HEAD:dev              # wait for CI on dev to pass
git push origin dev:master            # must fast-forward; if it is refused, stop and report
```

### After

- [ ] The Deploy run on `master` passed every job, including `release`.
- [ ] https://github.com/matan0810/fantazy-statistics/releases shows `vX.Y.Z` as the latest.
- [ ] The live site shows `vX.Y.Z` in its header. Cloud sessions may not reach it: ask the owner.
- [ ] Tell the owner: the version, the release link, what is in it, and what to check by hand.

### Changes with nothing for visitors

Docs, workflows and tooling can reach `master` without a bump, still only on the owner's
order: fast-forward `master` to `dev` as above and skip `npm run bump`. The site redeploys and
no tag is created.

## 8. Something is wrong in production

- _Rollback first:_ in the repository's Actions tab the owner can re-run the Deploy run of the
  previous release, which publishes that version again.
- _Hotfix:_ fix on `dev` with a test that reproduces the bug, add a `Fixed` line to the
  CHANGELOG, then ask the owner for a `patch` release.
- _Undo a release:_ `git revert` the offending commits on `dev`, then a `patch` release.
- Never reset or force-push `master` or `dev`.
- The owner often works from a phone. Instructions for them must work in a browser: GitHub
  settings pages and workflow runs. No terminal steps.

## 9. Dependency updates

Dependabot opens at most two pull requests a month against `dev`: one with every npm update,
one with every GitHub Actions update. When the owner asks to handle them: read the changelog
of each update, merge the branch into `dev` locally, run `npm run check` and `npm run e2e`,
push `dev`, and note it in the CHANGELOG if it matters to visitors. An update that breaks the
build is not merged: add an `ignore` for it in `dependabot.yml` with the reason, and tell the
owner. `playwright` is pinned to the version preinstalled in cloud sessions; do not upgrade it
alone.
