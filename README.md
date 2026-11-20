# היכל התהילה · Fantasy Statistics

Hall of fame for our fantasy league: every season, podium and record since 2015.
Live: https://matan0810.github.io/fantazy-statistics

## Features
- **Seasons**: competition tabs (Champions League / Mondial / Euro / Ligat HaAl), a season rail, a title card with the champion and key numbers (participants, team average, title margin), the podium, and the final table with the points gap to first place.
- **All-time stats**: records, a medal table, average leaders, and a champions archive per competition. Every archive row links to its season.
- **Shareable links**: every screen has its own URL (`#/season/12`, `#/stats`).
- **Downloads**
  - *Install as an app* (PWA): the "הורדת האפליקציה" button installs it to the home screen. It works offline.
  - *Image*: a ready-to-share PNG of any season table or of the medal table, or share it directly from a phone.
  - *Excel*: a CSV of the current table, or the full archive of all seasons.
  - *Proof screenshots*: each one can be downloaded from the proof dialog.

## Development
```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run deploy   # publish to GitHub Pages
```

Data lives in `src/data/` (`seasons.json`, `teams.json`, `proofs.json`). Proof images are in `public/proofs/`.
App icons are generated from `public/icons/icon.svg`.
