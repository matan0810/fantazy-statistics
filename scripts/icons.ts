/**
 * Writes the app icons and the favicon from the mark in src/ui/mark.ts, so they can never
 * drift from the trophy in the header:
 *
 *   node scripts/icons.ts        (needs the Chromium that Playwright uses)
 *
 * public/favicon.svg is written as vector; the PNGs are rendered by Chromium.
 */
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { TROPHY } from '../src/ui/mark.ts';

const INK = '#0a0a09';
const GOLD = '#c8a96a';

/** The trophy on the site's black, filling `share` of the square. */
function icon(share: number, rounded: boolean): string {
  const scale = share;
  const offset = (100 - 100 * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" ${rounded ? 'rx="22"' : ''} fill="${INK}"/>
<g transform="translate(${offset} ${offset - scale}) scale(${scale})">
<path d="${TROPHY.body}" fill="${GOLD}"/>
<path d="${TROPHY.handles}" fill="none" stroke="${GOLD}" stroke-width="3.4" stroke-linecap="round"/>
<path d="${TROPHY.sheen}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>
</g></svg>`;
}

const root = new URL('../public/', import.meta.url);
await writeFile(new URL('favicon.svg', root), `${icon(0.9, true)}\n`);

const pngs = [
  { file: 'icons/icon-192.png', size: 192, share: 0.74 },
  { file: 'icons/icon-512.png', size: 512, share: 0.74 },
  { file: 'icons/apple-touch-icon.png', size: 180, share: 0.7 },
  // Android crops maskable icons to a circle of 80%: the trophy keeps to the middle.
  { file: 'icons/maskable-512.png', size: 512, share: 0.56 },
];
const browser = await chromium.launch();
for (const { file, size, share } of pngs) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(
    `<html><body style="margin:0;background:${INK}">${icon(share, false).replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`,
  );
  await page.screenshot({ path: new URL(file, root).pathname, omitBackground: false });
  await page.close();
}
await browser.close();
console.log('Wrote favicon.svg and', pngs.map((p) => p.file).join(', '));
