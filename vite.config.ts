import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

/**
 * What the built page may load and run. GitHub Pages cannot send headers, so the policy is
 * a <meta> tag (which cannot carry frame-ancestors). Everything comes from the site itself:
 * its script, its stylesheet, its fonts and images; no inline script, no plugin, no form.
 * React sets styles through the CSSOM, which `style-src 'self'` allows. Trusted Types make
 * any write of HTML into the page from script fail. Only in the build: the dev server
 * injects inline scripts of its own.
 */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  // fontsource inlines its smallest subsets as data: URIs
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "object-src 'none'",
  "require-trusted-types-for 'script'",
  // the one policy the site creates, for its service worker (src/security/scriptUrl.ts)
  'trusted-types pantheon',
].join('; ');

function securityHeaders(): Plugin {
  return {
    name: 'security-meta',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY },
        injectTo: 'head-prepend',
      },
      {
        tag: 'meta',
        attrs: { name: 'referrer', content: 'no-referrer' },
        injectTo: 'head-prepend',
      },
    ],
  };
}

export default defineConfig({
  plugins: [react(), securityHeaders()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  base: '/fantazy-statistics/',
  test: {
    environment: 'node',
  },
});
