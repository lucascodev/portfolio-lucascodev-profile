import { COOKIE_CONSENT_ACCEPTED_VALUE, COOKIE_CONSENT_NAME } from '@/modules/consent/domain/constants/cookie-consent.constant';

/** Reads the consent out of a `document.cookie` style header such as `theme=dark; cookie_consent=accepted`. */
export function hasAcceptedCookies(cookieHeader: string): boolean {
  return cookieHeader
    .split(';')
    .map((pair) => pair.trim().split('='))
    .some(([name, value]) => name === COOKIE_CONSENT_NAME && value === COOKIE_CONSENT_ACCEPTED_VALUE);
}
