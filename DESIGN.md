# Hall of Fame: design

## 1. Scope

| In                                             | Out                                       |
| ---------------------------------------------- | ----------------------------------------- |
| Four competitions, every season since 2015     | Live scores during a season               |
| Final tables, podiums, players, records        | Accounts, comments, editing from the site |
| Hebrew (RTL) and English                       | Other languages                           |
| Downloads: share image, CSV, proof screenshots | PDF                                       |
| Offline copy, installable from the browser     | An install button of our own              |

## 2. Look

One dark look on purpose: an ink ground, quiet raised surfaces and hairlines, and colour used
only where it carries meaning:

- **Gold, silver, bronze** for ranks 1 to 3, everywhere (badges, podium, pips, chart dots).
- **One identity colour per player** (`players.json`): their line, avatar and dots. The
  colours are saturated and far apart, so nine lines stay distinguishable.
- **One accent per competition**, for its tag, the selected season and its share image.

Type: Secular One for display (titles, names, every number that matters), Heebo for text.
Both are bundled, so the site has no outside host and works offline. Numbers use tabular
figures so columns line up.

Layout follows the reading direction through logical CSS properties; nothing is mirrored by
hand except the chart's time axis (below).

## 3. Rank lines

The home page's chart, and the player page's small ones, show one competition at a time:

- x: the competition's seasons in time order. In Hebrew time runs right to left, in English
  left to right.
- y: final rank, first at the top. The axis ends at the largest field of that competition.
- A line joins seasons in a row as a smooth curve (level at every season). A season the
  player missed leaves a gap, bridged by a faint dashed curve.
- Champion seasons are gold dots ringed in the player's colour.
- Hovering a line or a name, or choosing a name, picks out that line and fades the rest. On
  a mouse a dot opens its season; on touch the first tap shows the season with a link.
- Lines draw in on load, dots follow. With reduced motion they appear at once.
- A visually hidden table carries the same data for screen readers.

## 4. Statistics

Points are compared only within one competition: each has a different number of game weeks.
Across competitions the site uses titles, podiums and per-competition averages.

- **Medal table**: titles, then seconds, then thirds, then fewer seasons.
- **Average**: only seasons with known points; at least two for the "best average" record.
- **Title streak**: champions of one competition in consecutive seasons.
- **Closest title**: smallest points gap between first and second (a tie counts as 0).
- **Biggest win**: largest gap between first and second, as a percentage of second's points,
  so it compares across competitions.
- Seasons whose points were lost keep their order, medals and appearances, and are left out
  of everything based on points.
- The records page leaves the Israeli league out by default (a full-year season); the choice
  is remembered.

## 5. Addresses

`#/` home, `#/season/<id>`, `#/player/<id>`, `#/records`. `#/stats` (the old statistics
address) opens records. Unknown addresses show home and are rewritten. The last season seen
is where "Seasons" leads.

## 6. Downloads

- **Share image**: a 1080-pixel-wide PNG drawn on a canvas, in the page's language and
  direction: title, every row with its rank disc, player colour, team and coach, points, gap
  to first and a bar against the leader. On phones that can share files, "Share" opens the
  system share sheet.
- **CSV**: UTF-8 with a byte order mark, so Excel opens Hebrew correctly.
- **Full archive**: every result of every season in one CSV.

## 7. Offline copy

`public/sw.js` saves the page, its script, its stylesheet and the fonts the stylesheet uses.
The page comes from the network when it answers within 2.5 seconds, so a release shows on
the next visit, and from the saved copy otherwise. Proof screenshots are saved the first time
they are opened. A page is saved only if it really is the site, so a host error page never
replaces it. Cache lookups ignore `Vary`: a module script asks with an `Origin` header the
saved copy was not fetched with, and the saved files never change.
