import { describe, expect, it } from 'vitest';
import { buildConsentCookie } from './build-consent-cookie.rule';
import { hasAcceptedCookies } from './has-accepted-cookies.rule';

describe('buildConsentCookie', () => {
  it('keeps the acceptance for 180 days, only on the path of the site', () => {
    expect(buildConsentCookie('/dev-portfolio/')).toBe('cookie_consent=accepted; Max-Age=15552000; Path=/dev-portfolio/; SameSite=Lax');
  });

  it('writes a cookie the reading rule recognizes', () => {
    const [storedPair] = buildConsentCookie('/').split('; ');

    expect(hasAcceptedCookies(storedPair)).toBe(true);
  });
});
