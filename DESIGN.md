# The Pantheon: design

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

- **Type.** Two families with clear roles. Noto Serif Hebrew, light (300), only for display:
  the wordmark, page and section titles, the Roman numerals and the names on the podium and
  champion labels. IBM Plex Sans Hebrew for everything read at reading size: names in lists,
  every figure (true tabular numerals), labels and running text. Labels are small spaced
  capitals in English and lightly spaced in Hebrew (wide spacing breaks Hebrew letters
  apart). Only the weights that exist are used (300, 400, 500), so the browser never fakes a
  bold, and nothing is set in italic. Both families are bundled: no outside host, and they
  work offline.
- **Colour.** Gold `#c8a96a`, flat, for the champion, rank one, the active tab and the key
  figures. Silver and bronze for ranks two and three. Each player has a muted jewel tone,
  used only as a hairline ring, a line or a dot. Competitions keep a small diamond in their
  colour.
- **Forms.**
  - Monogram: the player's serif initial inside a hairline ring in their colour; a champion
    adds a second, gold ring set off by a thin gap.
  - Rank: the numeral inside a hairline ring, in metal for the podium.
  - Podium: the first three on stone blocks of three heights, champion in the middle, always
    laid out II · I · III (it is a picture, so it does not mirror in Hebrew). Each block
    carries its Roman numeral in metal and, at its foot, the figure that earned the place
    (points for a season, medals for the legends). The champion wears a fine gold crown and
    the gold ring, and stands in a soft beam of light. When it scrolls into view the blocks
    rise from bronze to gold, the people appear on them, then the light. Used for each
    season's podium only. The home page's hall of legends is the full medal table.
  - Mark: a solid gold trophy with a dark sheen down the cup, beside the wordmark and alone
    on black as the app icon and favicon. On the home page it stands in a laurel wreath (the
    emblem) above the title. One drawing for all of them: `src/ui/mark.ts`; `node
scripts/icons.ts` writes the icons and favicon from it.
  - Actions: proof and download are icon buttons on the bar above the table they belong to,
    named for screen readers and in a tooltip, with no visible words. A proof screenshot
    shows a fine turning gold arc until it has loaded, and a short line if it fails.
  - Museum label: a hairline frame, a spaced-capitals title, a rule, then the content. Used
    for the champions wall and the records.
  - Section heading: eyebrow and serif title at the start, the hint at the far end, a
    full-width hairline below.
  - Tabs: text with a gold hairline under the chosen one. Buttons: square, hairline, spaced
    capitals.
- **Restraint.** Each page shows one thing at a time: the home page has the champions,
  the medal table and the rank lines; a
  player's career and the champions archive show one competition at a time, behind tabs; a
  player's history shows eight seasons until asked for all. Labels have a single rule above
  them instead of a box, and tables sit between rules.
- **Motion.** Quiet, and only to guide the eye: each section fades and rises a few pixels as
  it scrolls into view, its tiles one after another; the home page's figures count up once;
  the rank lines draw themselves when the chart comes into view. All of it is off with
  reduced motion.

Layout follows the reading direction through logical CSS properties. Charts are the
exception: time runs left to right in both languages, as on any chart. Hero headings are
centred; everything else aligns to the start.

## 3. Rank lines

The home page's chart, and the player page's, show one competition at a time:

- x: the competition's seasons in time order, oldest on the left, in both languages.
- y: final rank, first at the top. The axis ends at the largest field of that competition.
- A line joins seasons in a row as a smooth curve (level at every season). A season the
  player missed leaves a gap, bridged by a faint dashed curve.
- Champion seasons are gold dots in the player's colour.
- **Zoom** on the time axis: the − / + / all-seasons buttons, Ctrl (or ⌘) with the wheel, a
  trackpad or two-finger pinch, and a double click. The view keeps the point under the
  pointer (or between the fingers) in place, never shows fewer than three seasons, and pans
  by dragging once zoomed. Vertical swipes still scroll the page. A drag never counts as a
  click on a dot. The logic is in `src/charts/zoom.ts`, tested on its own.
- Hovering a line or a name picks out that line and fades the rest. Names can be chosen
  together to compare several lines; each stays lit until chosen again, and "All" clears
  them. On
  a mouse a dot opens its season; on touch the first tap shows the season with a link.
- The lines draw in when the chart scrolls into view, dots follow. With reduced motion they
  appear at once.
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
- **Which competitions count.** The records page and the home page's legends share one
  choice, made with chips under them and remembered. By default the Israeli league is left
  out (a full-year season); nothing on the page says so. Every chip may be turned off, and
  then the page shows only a prompt to choose one.
- **Records of the rest of the league**, so the page tells more than the leader's story:
  - _Eternal runner-up_: most second places (fewer seasons first on a tie).
  - _Biggest leap_: most places gained between a player's two consecutive seasons of one
    competition, at least two (on a tie, the one that lands higher, then the later).
  - _Greatest rivalry_: of the pairs that met in at least half as many seasons as the most
    frequent pair, the most even record, then the most meetings. Shown from the side that
    leads.
  - _Eternal bronze_: most third places.
  - _Heartbreak_: the title lost by the fewest points, named with its champion.
  - _Best season without the title_: the most points above the season's average by
    someone who did not win it (seasons of at least three scored players).
  - _Above the champion_: most seasons finishing above the reigning champion of that
    competition (fewer seasons first on a tie).
  - _Steadiest_: the smallest spread of places relative to the field, over at least five
    seasons; shown as the spread in places.
  - _Current form_: the best average place over the last four seasons, at least three
    played. Within a year the club seasons (May) come before the summer tournaments.
  - _The long wait_: most seasons played before a first title (the later on a tie).
  - _Loyal to the name_: the same team name for the most seasons, at least two.
- **The order of the cards**: the leaders, then the near misses, then the long stories,
  and the seasons played last (`src/screens/records/storyCards.ts`).
- **Head to head**, on each player's page: for every rival they shared a ranked season
  with, the seasons above and below, as "above – below" and a hairline split in gold from
  the reading start. All competitions count, as on the rest of the player's page.
- **Where a record leads.** Titles, podiums and seasons played open the player. A streak and
  a best average open the player on that competition. The closest title and the biggest win
  open the season, and name the runner-up they were won against. The leap opens its season;
  the runner-up and the rivalry open the player.

## 5. Addresses

`#/` home, `#/season/<id>`, `#/player/<id>` (with `/<competition>` to open their career on
it, for example `#/player/4/ucl`), `#/records`. `#/stats` (the old statistics
address) opens records. Unknown addresses show home and are rewritten. The last season seen
is where "Seasons" leads.

Back and forward return to the place on the page where the reader left it: each history
entry gets an id in its state, and the scroll position is kept per id for the tab. A new page
opens at the top, except a step from one season to another, which keeps the place.

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
