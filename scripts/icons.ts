/**
 * Writes the app icons and the favicon from the mark in src/ui/mark.ts, so they can never
 * drift from the header:
 *
 *   node scripts/icons.ts        (needs the Chromium that Playwright uses)
 *
 * The icons show the emblem (the trophy in its laurel wreath), as the header does. The
 * favicon, a few pixels wide in a tab, shows the trophy alone and is written as vector.
 */
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { EMBLEM_TROPHY, LEAF_PATH, TROPHY, WREATH, WREATH_TIE } from '../src/ui/mark.ts';

const INK = '#0a0a09';
const GOLD = '#c8a96a';

const trophy = `<path d="${TROPHY.body}" fill="${GOLD}"/>
<path d="${TROPHY.handles}" fill="none" stroke="${GOLD}" stroke-width="3.4" stroke-linecap="round"/>
<path d="${TROPHY.sheen}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>`;

const wreath = WREATH.map(
  (b) =>
    `<path d="${b.stem}" fill="none" stroke="${GOLD}" stroke-width="1.3"/>` +
    b.leaves
      .map(
        (l) =>
          `<path d="${LEAF_PATH}" fill="${GOLD}" transform="translate(${l.x.toFixed(2)} ${l.y.toFixed(2)}) rotate(${l.rotate.toFixed(1)}) scale(${l.scale.toFixed(3)})"/>`,
      )
      .join(''),
).join('');

/** As src/ui/Emblem.tsx draws it. */
const emblem = `${wreath}<path d="${WREATH_TIE}" fill="none" stroke="${GOLD}" stroke-width="1.4"/>
<g transform="${EMBLEM_TROPHY}">${trophy}</g>`;

/** A drawing in its 100-unit box, filling `share` of a square on the site's black. */
function icon(drawing: string, share: number, rounded: boolean, nudge = 0): string {
  const offset = (100 - 100 * share) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" ${rounded ? 'rx="22"' : ''} fill="${INK}"/>
<g transform="translate(${offset} ${offset + nudge * share}) scale(${share})">${drawing}</g></svg>`;
}

const root = new URL('../public/', import.meta.url);
await writeFile(new URL('favicon.svg', root), `${icon(trophy, 0.9, true, -1)}\n`);

const pngs = [
  { file: 'icons/icon-192.png', size: 192, share: 0.86 },
  { file: 'icons/icon-512.png', size: 512, share: 0.86 },
  { file: 'icons/apple-touch-icon.png', size: 180, share: 0.82 },
  // Android crops maskable icons to a circle of 80%: the emblem keeps to the middle.
  { file: 'icons/maskable-512.png', size: 512, share: 0.66 },
];
const browser = await chromium.launch();
for (const { file, size, share } of pngs) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  const svg = icon(emblem, share, false).replace('<svg ', `<svg width="${size}" height="${size}" `);
  await page.setContent(`<html><body style="margin:0;background:${INK}">${svg}</body></html>`);
  await page.screenshot({ path: new URL(file, root).pathname });
  await page.close();
}
await browser.close();
console.log('Wrote favicon.svg and', pngs.map((p) => p.file).join(', '));
