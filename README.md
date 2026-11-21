# The Pantheon · הפנתיאון

The official name is The Pantheon (the installed app's name); the Hebrew interface calls it
הפנתיאון.

The record of our fantasy league: every season of the Champions League, the World Cup, the
Euro and the Israeli league, with its podium and final table, a page for every player, and
the all-time records. Hebrew and English, the page direction following the language.

Live at https://matan0810.github.io/fantazy-statistics

## Features

- **Rank lines** on the home page: every player is a line through the seasons, by final
  rank. Pick a player to follow their path, zoom in on a stretch of seasons, and open a
  season from its dot.
- **Seasons**: competition and season pickers (the arrow keys step through seasons), the
  champion, title margin and average, a podium of three blocks, and the final table with the gap to first.
- **Players**: medals, podium rate, their line in every competition, head to head against
  every rival, and every season.
- **Records**: most titles, title streaks, closest and most one-sided titles, best average,
  the eternal runner-up and bronze, heartbreak, the biggest leap, the greatest rivalry,
  the steadiest, current form, the long wait,
  the medal table, season high scores and every champion. Choose which competitions count
  (the Israeli league is off by default); the home page's legends follow the same choice.
- **Downloads**: any table as an image to share or a spreadsheet (CSV), the full archive,
  and the proof screenshots.
- **Every screen has an address** (`#/season/22`, `#/player/4`, `#/records`), so it can be
  shared.
- **Works offline** and can be installed from the browser menu ("Add to Home Screen").

## History

| Generation | Since         | What it was                                                                 |
| ---------- | ------------- | --------------------------------------------------------------------------- |
| Prototype  | October 2023  | An Express and PostgreSQL server with a form for entering results           |
| 1.x        | October 2023  | A static site: one table per season, data exported from the database        |
| 2.x        | June 2026     | A new interface: podiums, statistics, player cards, proof screenshots       |
| 3.x        | November 2026 | This rebuild: TypeScript, its own design system, tests, CI, releases, he/en |

Every version, with what changed, is in [CHANGELOG.md](CHANGELOG.md) and on the
[releases page](https://github.com/matan0810/fantazy-statistics/releases).

## Running locally

Needs Node 22.18 or newer.

```bash
npm install
npm run dev
```

| Command                 | What it does                                                    |
| ----------------------- | --------------------------------------------------------------- |
| `npm run dev`           | Dev server on http://localhost:5173/fantazy-statistics/         |
| `npm run build`         | Type check, then build into `dist/`                             |
| `npm run check`         | Types, ESLint, Prettier and unit tests; must pass before a push |
| `npm run e2e`           | Browser smoke test (needs a prior `npm run build`)              |
| `npm run format`        | Rewrite files with Prettier                                     |
| `npm run bump -- minor` | Prepare a release: version and CHANGELOG (see CLAUDE.md)        |

## Data

The league lives in four JSON files in [`src/data/`](src/data), checked by
[`src/domain/parse.ts`](src/domain/parse.ts) on every load and in the tests. See
[CLAUDE.md](CLAUDE.md#updating-results) for the fields and how to add a season.

## Layout

```
index.html, vite.config.ts   Vite entry page and build settings
public/                      icons, manifest, service worker (sw.js), proofs/ screenshots
src/data/                    players, seasons, results, proofs (JSON)
src/domain/                  pure logic, no React: parsing, statistics, records, routes, CSV
src/i18n/                    Hebrew and English strings, language provider
src/charts/                  the rank lines chart (SVG) and its geometry
src/screens/                 Home, Season, Player and Records screens
src/components/              podium, medal table, champion card, competition chips, download menu
src/ui/                      buttons, segmented control, dialog, menu, badges, icons
src/export/                  share image (canvas), CSV tables, file download
src/security/                Trusted Types policy for the one script loaded by hand
src/styles/global.css        design tokens and base rules
scripts/                     version bump and release plan
tests/                       service worker tests; e2e/ browser smoke test
.github/workflows/           checks.yml (shared), ci.yml, deploy.yml
```

## Branches, versions and deploying

- `dev`: all work lands here, and CI checks every push.
- `master`: the live site. It moves only on a release, by fast-forwarding to `dev`.

Every push to `master` runs all checks and publishes the site to GitHub Pages
(`.github/workflows/deploy.yml`). When the version in `package.json` is new, the same run
tags the commit and publishes a GitHub release with its CHANGELOG notes. The version is
shown in the site's header. In the repository settings, under Pages, the source must be
**GitHub Actions**.

See [CLAUDE.md](CLAUDE.md) for the working procedure, [DESIGN.md](DESIGN.md) for how the
site looks and why, [SECURITY.md](SECURITY.md) for what is stored, and
[CHANGELOG.md](CHANGELOG.md) for what changed.
