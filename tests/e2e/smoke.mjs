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
    // A broken step fails in seconds, not after Playwright's half-minute wait.
    context.setDefaultTimeout(15_000);
    await context.route(
      (target) => target.hostname !== 'localhost',
      (route) => {
        problems.push(`${tag}: request to another host ${route.request().url()}`);
        return route.abort();
      },
    );
    // Anything the Content Security Policy blocks is a bug.
    await context.exposeFunction('__cspViolation', (what) =>
      problems.push(`${tag}: blocked by the CSP: ${what}`),
    );
    await context.addInitScript(() =>
      document.addEventListener('securitypolicyviolation', (e) =>
        window.__cspViolation(`${e.violatedDirective} ${e.blockedURI} ${e.sourceFile ?? ''}`),
      ),
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
  const policy = await page
    .locator('meta[http-equiv="Content-Security-Policy"]')
    .getAttribute('content');
  assert.match(policy ?? '', /default-src 'none'.*script-src 'self'/, 'the page carries its CSP');
  await page.getByRole('heading', { level: 1, name: 'הפנתיאון' }).waitFor();
  await page.getByText(`v${version}`, { exact: true }).waitFor();
  assert.match(page.url(), /#\/$/);
  step('desktop: home in Hebrew, right to left, with the version');

  const chart = page.getByRole('img', { name: /ליגת האלופות/ });
  await chart.waitFor();
  assert.ok((await chart.locator('path[pathLength]').count()) > 5, 'the chart draws the lines');
  const matanChip = page.getByRole('button', { name: /^מתן/ }).first();
  await matanChip.click();
  assert.equal(await matanChip.getAttribute('aria-pressed'), 'true');
  const gabiChip = page.getByRole('button', { name: /^גבי/ }).first();
  await gabiChip.click();
  await page.mouse.move(0, 0);
  assert.equal(await matanChip.getAttribute('aria-pressed'), 'true', 'picks add up');
  assert.equal(await chart.locator('[data-active]').count(), 2, 'two lines stand out');
  await gabiChip.click();
  await page.getByRole('group', { name: 'תחרות' }).getByRole('button', { name: 'מונדיאל' }).click();
  await page.getByRole('img', { name: /מונדיאל/ }).waitFor();
  step('desktop: rank lines chart draws, picks several players and switches competition');

  // time runs left to right in Hebrew too, and the axis zooms and resets
  await page.getByRole('group', { name: 'תחרות' }).getByRole('button', { name: 'אלופות' }).click();
  const ucl = page.getByRole('img', { name: /ליגת האלופות/ });
  await ucl.waitFor();
  const labelX = (text) =>
    ucl
      .locator('text', { hasText: text })
      .first()
      .evaluate((el) => el.getBoundingClientRect().x);
  assert.ok((await labelX('15/16')) < (await labelX('25/26')), 'oldest season on the left');
  const reset = page.getByRole('button', { name: 'כל העונות' });
  assert.equal(await reset.isDisabled(), true);
  await page.getByRole('button', { name: 'הגדלה' }).click();
  await page.getByRole('button', { name: 'הגדלה' }).click();
  assert.equal(await reset.isDisabled(), false);
  assert.equal(
    await ucl.locator('text', { hasText: '15/16' }).count(),
    0,
    'zoomed in on the middle',
  );
  await reset.click();
  await ucl.locator('text', { hasText: '15/16' }).waitFor();
  step('desktop: the chart runs left to right and zooms in and back out');

  assert.equal(
    await page
      .locator('a[href^="#/season/"]')
      .filter({ hasText: /אלופות|מונדיאל|יורו|ליגת העל/ })
      .count(),
    4,
  );
  const legends = page
    .locator('#medals-title')
    .locator('xpath=ancestor::section')
    .locator('tbody tr');
  assert.ok((await legends.count()) >= 8, 'the whole table, not only the top three');
  assert.match(await legends.first().innerText(), /מתן/, 'the leader comes first');
  step('desktop: four reigning champions and the legends table');

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
  await dialog.getByRole('img').waitFor();
  await dialog.getByRole('status').waitFor({ state: 'detached' });
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  step('desktop: the proof opens in a dialog, loads past its spinner, Esc closes it');

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
  assert.equal(await page.getByRole('img').count(), 1, 'one chart, for the competition chosen');
  await page
    .getByRole('group', { name: 'תחרות' })
    .getByRole('button', { name: 'ליגת העל' })
    .click();
  await page.getByRole('img', { name: /ליגת העל/ }).waitFor();
  const seasonsShown = () =>
    page.getByRole('region', { name: 'כל העונות' }).getByRole('listitem').count();
  assert.equal(await seasonsShown(), 8);
  await page.getByRole('button', { name: 'כל 23 העונות' }).click();
  assert.equal(await seasonsShown(), 23);
  step('desktop: the player page: a row opens it, career by competition, all seasons on demand');

  await page.goto(`${url}#/stats`);
  await page.getByRole('heading', { level: 1, name: 'ספר השיאים' }).waitFor();
  assert.match(page.url(), /#\/records$/);
  const titlesOfLeader = () => page.locator('tbody tr').first().locator('td').nth(2).innerText();
  assert.equal(await titlesOfLeader(), '9');
  await page
    .getByRole('group', { name: 'תחרויות בחישוב' })
    .getByRole('button', { name: 'ליגת העל' })
    .click();
  assert.equal(await titlesOfLeader(), '11');
  step('desktop: the old #/stats address opens records, and the filter changes the table');

  // back from a record returns to the same place on the page, not only the same page
  const leap = page.getByRole('link', { name: /הזינוק הגדול/ });
  assert.match(await leap.innerText(), /ממקום 5 למקום 1/);
  await page.evaluate(() => window.scrollTo({ top: 700 }));
  await page.waitForTimeout(100);
  const before = await page.evaluate(() => window.scrollY);
  await leap.click();
  await page.waitForURL(/#\/season\/\d+$/);
  await page.getByRole('heading', { level: 1, name: /יורו/ }).waitFor();
  assert.ok((await page.evaluate(() => window.scrollY)) < 5, 'a new page starts at the top');
  await page.goBack();
  await page.getByRole('heading', { level: 1, name: 'ספר השיאים' }).waitFor();
  await page.waitForFunction((y) => Math.abs(window.scrollY - y) < 3, before);
  for (const label of [
    'הסגן הנצחי',
    'היריבות הגדולה',
    'הברונזה הנצחית',
    'הלב השבור',
    'העונה הגדולה בלי תואר',
    'מעל האלוף',
    'היציב',
    'הכושר הנוכחי',
    'ההמתנה הארוכה',
    'נאמן לשם',
  ])
    await page.getByRole('link', { name: new RegExp(label) }).waitFor();
  step('desktop: new records, and back from one returns to the same place');

  const closest = page.getByRole('link', { name: /האליפות הצמודה/ });
  assert.match(await closest.innerText(), /מול גבי/);
  await closest.click();
  await page.waitForURL(/#\/season\/4$/);
  await page.goBack();
  for (const name of ['ליגת האלופות', 'מונדיאל', 'יורו', 'ליגת העל']) {
    const chip = page
      .getByRole('group', { name: 'תחרויות בחישוב' })
      .getByRole('button', { name, exact: true });
    if ((await chip.getAttribute('aria-pressed')) === 'true') await chip.click();
  }
  await page.getByText('בחרו תחרות כדי לראות כאן נתונים.').waitFor();
  assert.equal(await page.locator('table').count(), 0, 'nothing counted, nothing shown');
  await page
    .getByRole('group', { name: 'תחרויות בחישוב' })
    .getByRole('button', { name: 'ליגת האלופות' })
    .click();
  await page.locator('table').first().waitFor();
  step('desktop: a record leads to its season and names the runner-up; no competition, no figures');

  await page.goto(`${url}#/player/2/ligat-haal`);
  await page.getByRole('img', { name: /ליגת העל/ }).waitFor();
  const rivals = page.locator('#head-to-head-title').locator('xpath=ancestor::section');
  assert.ok((await rivals.getByRole('link').count()) >= 5, 'head to head lists the rivals');
  step('desktop: a player address can open the career on a competition');
  await page.goto(`${url}#/records`);
  await page.getByRole('heading', { level: 1, name: 'ספר השיאים' }).waitFor();

  await page.getByRole('button', { name: 'Switch to English' }).click();
  assert.equal(await page.evaluate(() => document.documentElement.dir), 'ltr');
  await page.getByRole('heading', { level: 1, name: 'Book of records' }).waitFor();
  await page.reload();
  await page.getByRole('heading', { level: 1, name: 'Book of records' }).waitFor();
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
  await off.getByRole('heading', { level: 1, name: 'The Pantheon' }).waitFor();
  const fonts = await off.evaluate(async () => {
    const faces = await document.fonts.load('16px "Noto Serif Hebrew Variable"', 'abc');
    const saved = await (await caches.open('hall-of-fame-v2')).keys();
    return { loaded: faces.length, saved: saved.filter((r) => r.url.endsWith('.woff2')).length };
  });
  assert.ok(fonts.loaded > 0 && fonts.saved > 0, `fonts work offline: ${JSON.stringify(fonts)}`);
  await offline.close();
  step('offline: opens from the saved copy, fonts included');

  // ---------- Security ----------
  // A context of its own: these steps provoke the errors the others treat as failures.
  const hostile = await browser.newContext({ locale: 'he-IL' });
  hostile.setDefaultTimeout(15_000);
  const evil = await hostile.newPage();
  const dialogs = [];
  evil.on('dialog', (d) => {
    dialogs.push(d.message());
    return d.dismiss();
  });
  const crashes = [];
  evil.on('pageerror', (error) => crashes.push(error.message));

  // Saved choices that another page on the shared github.io origin could have written.
  await evil.addInitScript(() => {
    localStorage.setItem('hall-of-fame:language', '"<img src=x onerror=alert(1)>"');
    localStorage.setItem('hall-of-fame:season', '{"__proto__":{"polluted":true}}');
    localStorage.setItem('hall-of-fame:records-filter', '"not a list"');
  });
  await evil.goto(url);
  await evil.getByRole('heading', { level: 1, name: 'הפנתיאון' }).waitFor();
  assert.equal(await evil.evaluate(() => ({}).polluted), undefined, 'no prototype pollution');
  step('security: tampered saved choices fall back to the defaults');

  await evil.goto(`${url}#/season/<img src=x onerror=alert(1)>`);
  await evil.getByRole('heading', { level: 1, name: 'הפנתיאון' }).waitFor();
  assert.match(evil.url(), /#\/$/, 'an address with markup is shown as home');
  await evil.goto(`${url}#/player/javascript:alert(1)`);
  await evil.getByRole('heading', { level: 1, name: 'הפנתיאון' }).waitFor();
  step('security: addresses with markup or scripts open home');

  const html = await evil.evaluate(() => {
    try {
      document.body.insertAdjacentHTML('beforeend', '<b>x</b>');
      return 'allowed';
    } catch {
      return 'blocked';
    }
  });
  assert.equal(html, 'blocked', 'Trusted Types stop writing HTML from script');
  const script = await evil.evaluate(() => {
    const s = document.createElement('script');
    try {
      s.src = 'data:text/javascript,alert(1)';
      return 'allowed';
    } catch {
      return 'blocked';
    }
  });
  assert.equal(script, 'blocked', 'Trusted Types stop script addresses');
  step('security: the page refuses to write HTML or load scripts from strings');

  await hostile.route('**/proofs/**', (route) => route.abort());
  await evil.goto(`${url}#/season/22`);
  await evil.getByRole('button', { name: 'הוכחה' }).click();
  await evil.getByText('התמונה לא נטענה').waitFor();
  step('security: a proof that fails to load says so instead of spinning');

  assert.deepEqual(dialogs, [], 'nothing opened a dialog');
  assert.deepEqual(crashes, [], 'nothing crashed');
  await hostile.close();

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

    // The phone's own back (a swipe or the system key) returns to the same place.
    // Bring a record card into view first: a tap on something off screen would scroll to it.
    const card = phone.getByRole('link', { name: /Biggest leap|הזינוק הגדול/ });
    await card.scrollIntoViewIfNeeded();
    await phone.waitForTimeout(150);
    const place = await phone.evaluate(() => window.scrollY);
    assert.ok(place > 300, 'the card is well down the page');
    await card.tap();
    await phone.waitForURL(/#\/season\/\d+$/);
    await phone.goBack();
    await phone.waitForURL(/#\/records$/);
    await phone.waitForFunction((y) => Math.abs(window.scrollY - y) < 3, place);
    step(`phone ${locale}: back returns to the same place on the page`);
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
