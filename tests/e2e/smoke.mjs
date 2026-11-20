// Browser smoke test: drives the built site in a real Chromium, on a desktop and on an
// emulated phone, in Hebrew and English.
//
//   npm run build && npm run e2e
//
// Every request that leaves localhost is refused and reported: the site must not depend
// on any other host (fonts are bundled).

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, devices } from 'playwright';
import { preview } from 'vite';

const { version } = JSON.parse(await readFile(new URL('../../package.json', import.meta.url)));

async function main() {
  const server = await preview({ preview: { port: 0 }, logLevel: 'silent' });
  const url = server.resolvedUrls.local[0];
  const browser = await chromium.launch();
  const problems = [];
  const step = (name) => console.log(`ok  ${name}`);

  const open = async (options, tag) => {
    const context = await browser.newContext({ acceptDownloads: true, ...options });
    await context.route(
      (target) => target.hostname !== 'localhost',
      (route) => {
        problems.push(`${tag}: request to another host ${route.request().url()}`);
        return route.abort();
      },
    );
    const page = await context.newPage();
    page.on('pageerror', (error) => problems.push(`${tag}: ${error.message}`));
    page.on('console', (m) => m.type() === 'error' && problems.push(`${tag}: console ${m.text()}`));
    return { context, page };
  };
  const noOverflow = async (page, where) => {
    const extra = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    assert.ok(extra <= 0, `${where}: the page is ${extra}px wider than the screen`);
  };
  const download = async (page, item) => {
    await page.getByRole('button', { name: /^(הורדה|Download)$/ }).click();
    const [file] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('menuitem', { name: item }).click(),
    ]);
    return readFile(await file.path());
  };

  // ---------- Desktop, Hebrew ----------
  const { context: desk, page } = await open(
    { viewport: { width: 1280, height: 800 }, locale: 'he-IL' },
    'desktop',
  );
  await page.goto(url);
  assert.equal(await page.evaluate(() => document.documentElement.dir), 'rtl');
  await page.getByRole('heading', { level: 1, name: 'היכל התהילה' }).waitFor();
  await page.getByText(`v${version}`, { exact: true }).waitFor();
  assert.match(page.url(), /#\/$/);
  step('desktop: home in Hebrew, right to left, with the version');

  const chart = page.getByRole('img', { name: /ליגת האלופות/ });
  await chart.waitFor();
  assert.ok((await chart.locator('path[pathLength]').count()) > 5, 'the chart draws the lines');
  const matanChip = page.getByRole('button', { name: /^מתן/ }).first();
  await matanChip.click();
  assert.equal(await matanChip.getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', { name: 'מונדיאל' }).first().click();
  await page.getByRole('img', { name: /מונדיאל/ }).waitFor();
  step('desktop: rank lines chart draws, picks a player and switches competition');

  assert.equal(
    await page
      .locator('a[href^="#/season/"]')
      .filter({ hasText: /אלופות|מונדיאל|יורו|ליגת העל/ })
      .count(),
    4,
  );
  const firstRow = page.getByRole('region', { name: 'טבלת המדליות' }).locator('tbody tr').first();
  assert.match(await firstRow.innerText(), /מתן/);
  step('desktop: four latest champions and the medal table');

  await page.getByRole('navigation').getByRole('link', { name: 'עונות' }).click();
  await page.getByRole('heading', { level: 1, name: /ליגת האלופות\s*25\/26/ }).waitFor();
  assert.match(page.url(), /#\/season\/22$/);
  await page.keyboard.press('ArrowRight'); // right to left: right is earlier
  await page.getByRole('heading', { level: 1, name: /24\/25/ }).waitFor();
  await page.keyboard.press('ArrowLeft');
  await page.getByRole('heading', { level: 1, name: /25\/26/ }).waitFor();
  step('desktop: seasons, and the arrow keys step through them');

  await page.getByRole('button', { name: 'הוכחה' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  step('desktop: the proof opens in a dialog and Esc closes it');

  const csv = (await download(page, /טבלה לאקסל/)).toString('utf8');
  assert.ok(csv.startsWith('﻿מקום,שחקן'), 'CSV has a BOM and Hebrew headers');
  assert.equal(csv.trim().split('\r\n').length, 7);
  const png = await download(page, /תמונה לשיתוף/);
  assert.deepEqual([...png.subarray(1, 4)], [0x50, 0x4e, 0x47], 'a PNG file');
  const archive = (await download(page, /הארכיון המלא/)).toString('utf8');
  assert.equal(archive.trim().split('\r\n').length, 102);
  step('desktop: downloads: season CSV, share image and the full archive');

  await page.locator('tbody tr').nth(1).click();
  await page.getByRole('heading', { level: 1, name: 'מתן' }).waitFor();
  assert.match(page.url(), /#\/player\/4$/);
  assert.ok((await page.getByRole('img').count()) >= 3, 'one chart per competition');
  step('desktop: a table row opens the player page');

  await page.goto(`${url}#/stats`);
  await page.getByRole('heading', { level: 1, name: 'שיאי כל הזמנים' }).waitFor();
  assert.match(page.url(), /#\/records$/);
  const titlesOfLeader = () => page.locator('tbody tr').first().locator('td').nth(2).innerText();
  assert.equal(await titlesOfLeader(), '9');
  await page.getByRole('button', { name: 'ליגת העל' }).click();
  assert.equal(await titlesOfLeader(), '11');
  step('desktop: the old #/stats address opens records, and the filter changes the table');

  await page.getByRole('button', { name: 'Switch to English' }).click();
  assert.equal(await page.evaluate(() => document.documentElement.dir), 'ltr');
  await page.getByRole('heading', { level: 1, name: 'All-time records' }).waitFor();
  await page.reload();
  await page.getByRole('heading', { level: 1, name: 'All-time records' }).waitFor();
  step('desktop: English, left to right, remembered after a reload');

  await desk.close();

  // ---------- Offline ----------
  // A context of its own: request interception would bypass the service worker.
  const offline = await browser.newContext({ locale: 'en-US' });
  const off = await offline.newPage();
  off.on('pageerror', (error) => problems.push(`offline: ${error.message}`));
  await off.goto(url);
  await off.evaluate(() => navigator.serviceWorker.ready);
  await off.reload();
  await off.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await offline.setOffline(true);
  await off.reload();
  await off.getByRole('heading', { level: 1, name: 'Hall of Fame' }).waitFor();
  const fonts = await off.evaluate(async () => {
    const faces = await document.fonts.load('16px "Secular One"', 'abc');
    const saved = await (await caches.open('hall-of-fame-v2')).keys();
    return { loaded: faces.length, saved: saved.filter((r) => r.url.endsWith('.woff2')).length };
  });
  assert.ok(fonts.loaded > 0 && fonts.saved > 0, `fonts work offline: ${JSON.stringify(fonts)}`);
  await offline.close();
  step('offline: opens from the saved copy, fonts included');

  // ---------- Phone, both languages ----------
  for (const locale of ['he-IL', 'en-US']) {
    const { context, page: phone } = await open(
      { ...devices['iPhone 13'], locale },
      `phone ${locale}`,
    );
    for (const hash of ['', '#/season/22', '#/season/17', '#/player/4', '#/records']) {
      await phone.goto(url + hash);
      await phone.locator('h1').first().waitFor();
      await noOverflow(phone, `${locale} ${hash || 'home'}`);
    }
    await phone.goto(url);
    await phone.getByRole('navigation').getByRole('link').nth(2).click();
    await phone.locator('h1').first().waitFor();
    assert.match(phone.url(), /#\/records$/);
    step(`phone ${locale}: every screen fits the width, tabs navigate`);
    await context.close();
  }

  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log('all good');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
