// The service worker (public/sw.js), run in a sandbox with a fake network and a fake
// cache, so its choices can be checked without a browser.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';

const ORIGIN = 'https://site.test';
const SCOPE = '/fantazy-statistics/';
const SOURCE = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
const EXTRAS = [
  'favicon.svg',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
].map((f) => SCOPE + f);

const sitePage = (asset: string) =>
  `<!doctype html><html><head><script type="module" crossorigin src="${SCOPE}assets/${asset}.js"></script></head><body><div id="root"></div></body></html>`;
const ERROR_PAGE = '<!doctype html><html><body><h1>Site not found</h1></body></html>';

type Handler = (event: Record<string, unknown>) => void;
type Req = string | { url: string };

function sandbox() {
  const routes = new Map<string, string>();
  const store = new Map<string, Response>();
  const handlers: Record<string, Handler> = {};
  const abs = (r: Req) => new URL(typeof r === 'string' ? r : r.url, ORIGIN).href;
  const fetch = async (r: Req) => {
    const body = routes.get(new URL(abs(r)).pathname);
    if (body === undefined) throw new TypeError('network down');
    return new Response(body, { status: 200 });
  };
  const cache = {
    put: async (r: Req, res: Response) => void store.set(abs(r), res),
    addAll: async (list: string[]) => {
      for (const r of list) store.set(abs(r), await fetch(r));
    },
    keys: async () => [...store.keys()].map((url) => ({ url })),
    delete: async (r: Req) => store.delete(abs(r)),
    match: async (r: Req) => store.get(abs(r))?.clone(),
  };
  const caches = {
    open: async () => cache,
    keys: async () => ['hall-of-fame-v2'],
    delete: async () => true,
    match: async (r: Req) => store.get(abs(r))?.clone(),
  };
  const self = {
    location: new URL(ORIGIN),
    registration: { scope: ORIGIN + SCOPE },
    addEventListener: (type: string, fn: Handler) => (handlers[type] = fn),
    skipWaiting: () => undefined,
    clients: { claim: async () => undefined },
  };
  vm.runInNewContext(SOURCE, { self, caches, fetch, URL, Response, RegExp, setTimeout, Promise });
  for (const path of EXTRAS) routes.set(path, 'file');

  const respond = async (path: string, mode: string) => {
    let answer: Promise<Response> | undefined;
    handlers.fetch?.({
      request: { method: 'GET', url: path.startsWith('http') ? path : ORIGIN + path, mode },
      respondWith: (p: Promise<Response>) => (answer = p),
    });
    if (!answer) return undefined;
    const res = await answer;
    await new Promise((r) => setTimeout(r, 10)); // let background saves finish
    return res.text();
  };

  return {
    routes,
    stored: () => [...store.keys()].map((u) => new URL(u).pathname).sort(),
    install() {
      let done: Promise<unknown> = Promise.resolve();
      handlers.install?.({ waitUntil: (p: Promise<unknown>) => (done = p) });
      return done;
    },
    open: (path = SCOPE) => respond(path, 'navigate'),
    get: (path: string) => respond(path, 'no-cors'),
  };
}

describe('service worker', () => {
  it('installing saves the page, its script and the icons', async () => {
    const sw = sandbox();
    sw.routes.set(SCOPE, sitePage('one'));
    sw.routes.set(`${SCOPE}assets/one.js`, 'code');
    await sw.install();
    expect(sw.stored()).toEqual([SCOPE, `${SCOPE}assets/one.js`, ...EXTRAS].sort());
  });

  it('also saves the fonts the stylesheet uses, and drops them with an old release', async () => {
    const sw = sandbox();
    const page = sitePage('one').replace(
      '</head>',
      `<link rel="stylesheet" href="${SCOPE}assets/one.css"></head>`,
    );
    sw.routes.set(SCOPE, page);
    sw.routes.set(`${SCOPE}assets/one.js`, 'code');
    sw.routes.set(
      `${SCOPE}assets/one.css`,
      `@font-face{src:url(${SCOPE}assets/font-a.woff2) format("woff2")}`,
    );
    sw.routes.set(`${SCOPE}assets/font-a.woff2`, 'font');
    await sw.install();
    expect(sw.stored()).toContain(`${SCOPE}assets/font-a.woff2`);
    sw.routes.set(SCOPE, sitePage('two'));
    sw.routes.set(`${SCOPE}assets/two.js`, 'new');
    await sw.open();
    expect(sw.stored()).not.toContain(`${SCOPE}assets/font-a.woff2`);
  });

  it('an error page from the host never replaces the saved site', async () => {
    const sw = sandbox();
    sw.routes.set(SCOPE, sitePage('one'));
    sw.routes.set(`${SCOPE}assets/one.js`, 'code');
    await sw.install();
    sw.routes.set(SCOPE, ERROR_PAGE);
    expect(await sw.open()).toBe(sitePage('one'));
  });

  it('a new release replaces the page and drops the old script', async () => {
    const sw = sandbox();
    sw.routes.set(SCOPE, sitePage('one'));
    sw.routes.set(`${SCOPE}assets/one.js`, 'old');
    await sw.install();
    sw.routes.set(SCOPE, sitePage('two'));
    sw.routes.set(`${SCOPE}assets/two.js`, 'new');
    expect(await sw.open()).toBe(sitePage('two'));
    expect(sw.stored()).toContain(`${SCOPE}assets/two.js`);
    expect(sw.stored()).not.toContain(`${SCOPE}assets/one.js`);
  });

  it('with no network at all, the saved site opens', async () => {
    const sw = sandbox();
    sw.routes.set(SCOPE, sitePage('one'));
    sw.routes.set(`${SCOPE}assets/one.js`, 'code');
    await sw.install();
    sw.routes.clear();
    expect(await sw.open()).toBe(sitePage('one'));
  });

  it('keeps a proof screenshot once it has been seen', async () => {
    const sw = sandbox();
    sw.routes.set(`${SCOPE}proofs/a.png`, 'image');
    expect(await sw.get(`${SCOPE}proofs/a.png`)).toBe('image');
    sw.routes.clear();
    expect(await sw.get(`${SCOPE}proofs/a.png`)).toBe('image');
  });

  it('leaves other sites alone', async () => {
    // the worker does not answer, so the browser fetches it as usual
    expect(await sandbox().get('https://fonts.example/font.woff2')).toBeUndefined();
  });
});
