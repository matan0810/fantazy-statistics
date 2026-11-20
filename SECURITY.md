# Security

The site is static: HTML, a script, a stylesheet, fonts and images served by GitHub Pages.
There is no server of ours, no account, no login and no form that sends anything anywhere.
What there is to protect is small but real: the visitors' browsers (no script but ours may
run in the page), the league's record (only the owner changes it), and the path from the
repository to the live site (only reviewed work reaches it).

## What the site stores on a device

In `localStorage`, all optional (the site works without storage):

| Key                           | What                                            |
| ----------------------------- | ----------------------------------------------- |
| `hall-of-fame:language`       | The language chosen in the header               |
| `hall-of-fame:season`         | The last season opened                          |
| `hall-of-fame:records-filter` | The competitions counted on Records and at home |

The service worker keeps a copy of the site's own files in the Cache Storage
(`hall-of-fame-v2`). Scroll positions for the back button live in memory only, per tab.

## Hosts

The site talks to no host but its own: fonts are bundled, there are no analytics and no
third-party scripts. The browser test fails if any request leaves the site's own address.
A new outside host needs a reason and a line here, and a change to the policy below.

## Threats and what answers them

| Threat                                                               | Answer                                                                                                                                                                                                                                                                                                                                                     | Checked by                                                                                       |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Script injection (XSS) through the data, an address or saved choices | Every text is rendered as React text, never as HTML; there is no `innerHTML` anywhere. A Content Security Policy allows only the site's own script, stylesheet, fonts and images, no inline script, no plugins, no forms, no `<base>`. Trusted Types make any write of HTML or of a script address from a string fail; the one policy admits only `sw.js`. | e2e: the policy is present, nothing is blocked in normal use, HTML and script writes are refused |
| A hostile address (`#/season/<img onerror…>`)                        | Routes are parsed into numbers and known names; anything else opens home and is rewritten.                                                                                                                                                                                                                                                                 | unit (`routes.test.ts`), e2e                                                                     |
| Tampered saved choices                                               | Each value read from `localStorage` is parsed and checked (`src/hooks/storage.ts`), never cast; a bad value means the default.                                                                                                                                                                                                                             | unit (`storage.test.ts`), e2e with poisoned storage                                              |
| Bad or hostile league data                                           | `src/domain/parse.ts` validates every record when the site loads and in the tests: ids, ranks, points, colours (`#rrggbb` only) and proof paths (images under `/proofs/`, no `..`, no query, no other scheme). A bad edit fails the checks and never ships.                                                                                                | unit (`parse.test.ts`)                                                                           |
| Spreadsheet formulas in a downloaded CSV ("CSV injection")           | A text cell starting with `=`, `+`, `-`, `@`, a tab or a carriage return gets a leading apostrophe, so Excel shows it as text. Numbers stay numbers.                                                                                                                                                                                                       | unit (`csv.test.ts`)                                                                             |
| A download name that hides its type or climbs folders                | File names drop path separators, reserved characters, control and direction marks, and a leading dot.                                                                                                                                                                                                                                                      | unit (`download.test.ts`)                                                                        |
| Leaking where visitors come from                                     | `referrer` is `no-referrer`; the site links nowhere else anyway.                                                                                                                                                                                                                                                                                           | build                                                                                            |
| A compromised dependency                                             | The site ships React, React DOM and two fonts, nothing else. `npm audit` blocks high advisories in those on every run. No package runs code at install time (`.npmrc`: `ignore-scripts`). The lockfile pins every version (`npm ci`). Dependabot proposes updates monthly, and each is read and tested before it is merged.                                | CI                                                                                               |
| A compromised workflow step stealing the token                       | Every workflow starts from read-only permissions; only the Pages deploy (`pages`, `id-token`) and the release job (`contents: write`, no `npm install`) get more. Checkouts do not leave the token on disk. No workflow runs on `pull_request_target`, and no untrusted text is put into a shell command.                                                  | review                                                                                           |
| A forged release                                                     | Releases are created only by the Deploy workflow, from `package.json`, `CHANGELOG.md` and `scripts/release-history.json`; each version, commit and date is checked for its exact form before it reaches `gh`.                                                                                                                                              | unit (`changelog.test.ts`)                                                                       |
| A host error page replacing the saved copy                           | The service worker saves a page only if it is the site (its root element and script), caches only its own origin and only `GET`.                                                                                                                                                                                                                           | unit (`tests/sw.test.ts`)                                                                        |
| Secrets in the repository                                            | There are none, and nothing in the site needs one.                                                                                                                                                                                                                                                                                                         | review; GitHub secret scanning (below)                                                           |

## Known limits, accepted

- **The origin is shared.** Every GitHub Pages project of this account is served from
  `matan0810.github.io`, so they share `localStorage` and the Cache Storage. Another
  project of the account could change the saved choices (they are validated, so the worst is
  a default view) or the saved copy of the site (shown only when the network is slow or
  absent, and replaced on the next good visit). The answer is trust in the account's own
  projects; a custom domain would give the site an origin of its own.
- **No `frame-ancestors`.** Pages cannot send headers and a `<meta>` policy cannot forbid
  framing. The site has no action a framed page could be tricked into, so this is accepted.
- **Trusted Types** are enforced by Chromium browsers; Safari and Firefox rely on the rest
  of the policy and on React.

## Settings only the owner can change

These live in the repository's settings on GitHub, and all work from a phone's browser:

- **Settings → Code security**: turn on Dependabot alerts and security updates, secret
  scanning with push protection, and CodeQL code scanning (default setup).
- **Settings → Rules → Rulesets**: a ruleset on `master` and `dev` that blocks force pushes
  and deletion.
- **Settings → Actions → General → Workflow permissions**: read repository contents only,
  and do not allow Actions to create or approve pull requests.
- The account itself: two-factor authentication.

## Reporting

Open an issue on the repository, or tell the owner directly.
