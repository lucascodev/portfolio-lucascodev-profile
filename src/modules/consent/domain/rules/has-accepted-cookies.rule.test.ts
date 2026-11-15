import { describe, expect, it } from 'vitest';
import { hasAcceptedCookies } from './has-accepted-cookies.rule';

describe('hasAcceptedCookies', () => {
  it('finds the consent among other cookies', () => {
    expect(hasAcceptedCookies('theme=dark; cookie_consent=accepted; lang=pt')).toBe(true);
  });

  it('treats a visitor without the cookie as not having accepted', () => {
    expect(hasAcceptedCookies('')).toBe(false);
    expect(hasAcceptedCookies('theme=dark')).toBe(false);
  });

  it('ignores a consent cookie with another value or a look-alike name', () => {
    expect(hasAcceptedCookies('cookie_consent=rejected')).toBe(false);
    expect(hasAcceptedCookies('old_cookie_consent=accepted')).toBe(false);
  });
});
