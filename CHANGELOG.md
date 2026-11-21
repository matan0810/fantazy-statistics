# Changelog

All changes a visitor or the owner would notice are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and versions follow
[Semantic Versioning](https://semver.org/): fixes and new results are patch, features are
minor, breaking changes are major.

Versions before 3.0.0 were never numbered at the time. They were reconstructed from the git
history: each one is a state of `master` that was published to the live site (a deploy on the
old `gh-pages` branch), dated by that deploy.

## [Unreleased]

## [3.2.0] - 2026-11-21

### Added
- Eleven new records, so the page tells more than the leader's story: the eternal runner-up, eternal bronze, heartbreak, the best season without the title, the biggest leap, the greatest rivalry, above the champion, the steadiest, current form, the long wait and loyal to the name.
- Head to head on every player's page: the seasons above and below each rival.
- The rank lines compare several players at once: each name you pick stays lit until you pick it again.
- A turning gold arc while a proof screenshot loads, and a short message if it does not.

### Changed
- The home page shows the whole medal table again, under the hall of legends, instead of the top three; the podium stays on each season.
- Proof and download sit on a bar above the final table, next to what they act on.

### Fixed
- Back after following a link returns to the same place on the page, not only the same page.
- Opening a season from a record or a player starts at the top of the page.

### Security

- A Content Security Policy: the page runs and loads only the site's own files, with no inline script, and Trusted Types refuse any HTML or script address written from a string.
- Downloaded spreadsheets can no longer carry a formula: a cell that starts like one is kept as text.
- Saved choices, addresses and proof paths are checked strictly; a tampered value means the default view.
- Download file names cannot hide their type or point outside the downloads folder.
- No dependency runs code when it is installed, and CI no longer leaves its token on disk.

## [3.1.0] - 2026-11-20

### Added
- The podium returns, on the season page and for the hall of legends: three stone blocks of three heights, the champion in the middle under a crown and a soft light, each block with its numeral and the points or medals that earned it. It rises into place as it scrolls into view.
- Zoom on the rank lines: buttons, pinch, Ctrl and the wheel, or a double click, then drag to move along the seasons.

### Changed
- The site is now called The Pantheon, הפנתיאון in the Hebrew interface; the installed app is named The Pantheon.
- A gold trophy is the logo, the app icon and the favicon.
- The hall of legends on the home page leaves the Israeli league out by default; chips below it choose which competitions count, shared with the records page.
- The competition filter can be emptied: with nothing chosen, the page asks you to pick a competition.
- Record cards lead somewhere useful: a streak or an average opens the player on that competition, the closest title and the biggest win open the season and name the runner-up.
- The proof screenshots and downloads are small icon buttons in the corner of the page.
- Ori's name is spelled Ori in English.
- The rank lines run left to right, oldest season first, in Hebrew too, as on any chart.
- Clearer type: the serif is kept for titles and honoured names; names in lists, figures and labels use IBM Plex Sans Hebrew, with true tabular numerals.
- Lighter pages: sections appear softly as you scroll and the home page's figures count up; labels and tables lose their boxes; the home page keeps the champions, the legends and the rank lines, and the full ranking is on the records page.
- A player's career and the champions archive show one competition at a time, with tabs; a player's history shows eight seasons until you ask for all of them.

### Removed
- The note about the Israeli league on the records page.

## [3.0.0] - 2026-11-20

The third generation of the site, rebuilt from the ground up: TypeScript, its own design
system instead of a component library, tests, continuous integration and versioned releases.

### Added
- Rank lines on the home page: every player as a line through the seasons of a competition, by final rank. Pick a player to follow their path; a dot shows the season and opens it.
- English, with the whole page turning left to right. The language follows the browser and can be switched in the header.
- A page for every player: a trophy cabinet of medals, podium rate, their line in every competition and every season they played.
- The home page opens on the reigning champion of every competition and the hall of legends, the three greatest players of all time.
- New records: title streaks, the closest title race, the most one-sided title and the most seasons played.
- Every champion of every competition, with the season's high score.
- Every screen has its own address (`#/season/22`, `#/player/4`, `#/records`) to share.
- Seasons step with the arrow keys and with earlier and later buttons.
- Downloads: any table as an image to share (or straight to the share sheet on a phone), as a spreadsheet, the full archive, and the proof screenshots.
- The site works offline, fonts included, and the browser offers to install it.
- The version is shown in the header.

### Changed
- A new look, made to feel like a hall of fame in the manner of a museum catalogue: warm black, ivory type and a flat champagne gold, a light Hebrew serif (Noto Serif Hebrew) for titles, names and figures, hairlines instead of boxes, museum labels for the champions and the records, and Roman numerals for the podium. Each player keeps a quiet jewel tone.
- The final table shows the gap to first place and a bar against the leader.
- Faster: about half as much code to download (92 KB compressed instead of 169 KB), and no outside host at all (fonts are bundled).
- The old `#/stats` address opens the records page.

## [2.1.0] - 2026-07-21

### Added
- The coach of each team, read off the proof screenshots, in every season's table and in the form for adding a team.

## [2.0.3] - 2026-07-20

### Added
- World Cup 2026: the final table of eight and its proof screenshot.

## [2.0.2] - 2026-06-13

### Changed
- The statistics page loads only when it is opened, and the code is split into smaller files, so the site opens faster.
- Dependencies updated.

## [2.0.1] - 2026-06-08

### Changed
- The proof dialog shows a loading indicator and steps between several screenshots.
- The season picker shows how many seasons a competition has, and the season summary is laid out more clearly.

## [2.0.0] - 2026-06-07

The second generation: a whole new interface.

### Added
- A podium for every season, and summary cards: the champion, the number of teams and the season's points record.
- A statistics page: all-time records, the hall of fame ranked by titles, average leaders and a breakdown per competition, with a filter by competition.
- A card for every player: titles, podiums, results per competition and the full season history.
- Proof screenshots for seasons that have them.
- Champions League 24/25 and 25/26 results.
- Seasons whose points were lost are marked; their finishing order still counts, their points do not.

### Changed
- A colour identity per competition, applied to the whole page.
- The header shows the year the league began, worked out from the data.

### Removed
- The striped table colours of the first version.

## [1.0.3] - 2024-07-16

### Added
- Euro 2024 results.

## [1.0.2] - 2024-06-02

### Added
- Champions League 23/24 results.

## [1.0.1] - 2023-12-23

### Changed
- The site is built with Vite instead of Create React App. Nothing visible changed.

## [1.0.0] - 2023-10-31

The first site: published the night the project became a static site.

### Added
- A final table for every season of the Champions League, the World Cup, the Euro and the Israeli league: rank, player, points and team name, 18 seasons from 2015/16.
- A competition switch and a season picker; the last choice is remembered.
- Striped table colours per competition.

Before this release the project was a prototype with an Express and PostgreSQL server and a
form for entering results (October 2023). On launch night the data was exported from the
database into the site, and the server was dropped.
