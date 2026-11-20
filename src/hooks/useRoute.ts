import { useEffect, useState } from 'react';
import { league } from '../domain/league';
import { parseRoute, routeHash, type Route } from '../domain/routes';

/** Reads the address; an unknown or old one is shown as its screen and written back as such. */
function current(): Route {
  const route = parseRoute(window.location.hash, league);
  const canonical = routeHash(route);
  if (window.location.hash !== canonical) window.history.replaceState(null, '', canonical);
  return route;
}

/** The current screen, from the address hash. Links are plain `<a href="#/...">`. */
export function useRoute(): Route {
  const [route, setRoute] = useState(current);

  useEffect(() => {
    const onHash = () => {
      const next = current();
      setRoute(next);
      // A season-to-season step keeps the reader's place; any other move starts at the top.
      if (next.name !== 'season') window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return route;
}

export function navigate(route: Route) {
  goTo(routeHash(route));
}

/** Moves to an address in the site (a `#/...` hash). */
export function goTo(hash: string) {
  window.location.hash = hash;
}
