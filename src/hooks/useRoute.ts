import { useEffect, useLayoutEffect, useState } from 'react';
import { league } from '../domain/league';
import { parseRoute, routeHash, type Route } from '../domain/routes';
import { entryOf, withEntry } from './historyEntry';

/** Where the reader was on each page of this tab's history, by entry. */
const positions = new Map<string, number>();
let made = 0;

/** This history entry's id, given to it the first time it is seen. */
function currentEntry(): string {
  const known = entryOf(window.history.state);
  if (known) return known;
  const id = `${Date.now().toString(36)}.${made++}`;
  window.history.replaceState(withEntry(window.history.state, id), '');
  return id;
}

/** Changes the address in place, keeping the entry (and so its saved place). */
export function replaceAddress(hash: string) {
  window.history.replaceState(window.history.state, '', hash);
}

/** Reads the address; an unknown or old one is shown as its screen and written back as such. */
function current(): Route {
  const route = parseRoute(window.location.hash, league);
  const canonical = routeHash(route);
  if (window.location.hash !== canonical) replaceAddress(canonical);
  return route;
}

/**
 * The current screen, from the address hash. Links are plain `<a href="#/...">`.
 *
 * Going back or forward returns to the place on the page where the reader left it; a new
 * page starts at the top, except a step from season to season, which keeps the place.
 */
export function useRoute(): Route {
  const [route, setRoute] = useState(current);
  const [target, setTarget] = useState<{ top: number } | null>(null);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    let entry = currentEntry();
    let shown = current().name;
    const onScroll = () => positions.set(entry, window.scrollY);
    const onHash = () => {
      entry = currentEntry();
      const next = current();
      const saved = positions.get(entry);
      const fromSeason = shown === 'season';
      shown = next.name;
      setRoute(next);
      if (saved !== undefined) setTarget({ top: saved });
      else if (!(fromSeason && next.name === 'season')) setTarget({ top: 0 });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  // After the new screen is laid out; its parts may still be growing, so try for a moment.
  useLayoutEffect(() => {
    if (!target) return;
    let frame = 0;
    const until = performance.now() + 2000;
    // The reader's own scroll ends the attempt: their hand wins over our memory.
    const stop = () => cancelAnimationFrame(frame);
    const apply = () => {
      window.scrollTo({ top: target.top });
      if (Math.abs(window.scrollY - target.top) > 2 && performance.now() < until)
        frame = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener('wheel', stop, { passive: true, once: true });
    window.addEventListener('touchstart', stop, { passive: true, once: true });
    return () => {
      stop();
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
    };
  }, [target]);

  return route;
}

export function navigate(route: Route) {
  goTo(routeHash(route));
}

/** Moves to an address in the site (a `#/...` hash). */
export function goTo(hash: string) {
  window.location.hash = hash;
}
