import { describe, expect, it } from 'vitest';
import { allowedScriptUrl } from './scriptUrl';

describe('the one script address the page may load by hand', () => {
  it('lets the service worker through', () => {
    expect(allowedScriptUrl('/fantazy-statistics/sw.js', '/fantazy-statistics/')).toBe(
      '/fantazy-statistics/sw.js',
    );
  });

  it.each([
    'https://evil.example/sw.js',
    '/fantazy-statistics/other.js',
    '/fantazy-statistics/sw.js?x=1',
    'data:text/javascript,alert(1)',
  ])('refuses %s', (url) => {
    expect(() => allowedScriptUrl(url, '/fantazy-statistics/')).toThrow(TypeError);
  });
});
