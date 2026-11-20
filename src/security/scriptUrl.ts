/**
 * The page's policy forbids handing a plain string to anything that loads a script
 * (Trusted Types). The site loads one script by hand, its service worker; this is the
 * only address the policy lets through.
 */
export const POLICY_NAME = 'pantheon';

export function allowedScriptUrl(input: string, base: string): string {
  const expected = `${base}sw.js`;
  if (input !== expected) throw new TypeError(`Script address not allowed: ${input}`);
  return input;
}

/** The service worker's address, trusted where the browser enforces Trusted Types. */
export function serviceWorkerUrl(base: string): string | TrustedScriptURL {
  const url = `${base}sw.js`;
  const factory = window.trustedTypes;
  if (!factory) return url;
  return factory
    .createPolicy(POLICY_NAME, { createScriptURL: (input) => allowedScriptUrl(input, base) })
    .createScriptURL(url);
}
