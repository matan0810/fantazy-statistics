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

A hall of fame in the manner of a museum catalogue: warm black, ivory type, one flat
champagne gold used sparingly, hairlines instead of boxes, sharp corners and a great deal of
space. Precision over decoration: no gradients on type, no texture, no glow, no drawn
ornaments. What is honoured is marked by type, position and a touch of gold, not by effects.

- **Type.** Noto Serif Hebrew at a light weight (300) for every title, name and number that
  matters: a precise book serif with fine lining figures, in Hebrew and Latin. Assistant for
  labels and running text. Labels are small spaced capitals in English and lightly spaced in
  Hebrew (wide spacing breaks Hebrew letters apart). Neither font has an italic, so nothing
  is set in italic. Both are bundled: no outside host, and they work offline.
- **Colour.** Gold `#c8a96a`, flat, for the champion, rank one, the active tab and the key
  figures. Silver and bronze for ranks two and three. Each player has a muted jewel tone,
  used only as a hairline ring, a line or a dot. Competitions keep a small diamond in their
  colour.
- **Forms.**
  - Monogram: the player's serif initial inside a hairline ring in their colour; a champion
    adds a second, gold ring set off by a thin gap.
  - Rank: the numeral inside a hairline ring, in metal for the podium.
  - Honours: the first three side by side in reading order, each under a Roman numeral in
    metal (I, II, III), separated by hairlines. Used for the season's podium and for the hall
    of legends.
  - Museum label: a hairline frame, a spaced-capitals title, a rule, then the content. Used
    for the champions wall and the records.
  - Section heading: eyebrow and serif title at the start, the hint at the far end, a
    full-width hairline below.
  - Tabs: text with a gold hairline under the chosen one. Buttons: square, hairline, spaced
    capitals.
- **Motion.** Quiet: pages fade in, sections rise a few pixels, the rank lines draw
  themselves. All of it is off with reduced motion.

Layout follows the reading direction through logical CSS properties; nothing is mirrored by
hand except the chart's time axis (below). Hero headings are centred; everything else aligns
to the start.

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

- **Share image**: a 1080-pixel-wide PNG drawn on a canvas in the site's look, in the page's
  language and direction: title, every row with its rank ring, player colour, team and coach, points, gap
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
