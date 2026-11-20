# Security

The site is static: HTML, a script, a stylesheet, fonts and images served by GitHub Pages.
There is no server of ours, no account and no form that sends anything anywhere.

## What the site stores on a device

In `localStorage`, all optional (the site works without storage):

| Key                           | What                               |
| ----------------------------- | ---------------------------------- |
| `hall-of-fame:language`       | The language chosen in the header  |
| `hall-of-fame:season`         | The last season opened             |
| `hall-of-fame:records-filter` | The competitions chosen on Records |

The service worker keeps a copy of the site's own files in the Cache Storage
(`hall-of-fame-v2`).

## Hosts

The site talks to no host but its own: fonts are bundled, there are no analytics and no
third-party scripts. The browser test fails if any request leaves the site's own address.
A new outside host needs a reason and a line here.

## Data

All league data is public within the site and is built into it from `src/data/`. Everything
read from the data or from `localStorage` is validated before use, and every text is rendered
as React text, never as HTML.

## Reporting

Open an issue on the repository, or tell the owner directly.
