import { COOKIE_CONSENT_ACCEPTED_VALUE, COOKIE_CONSENT_NAME } from '@/modules/consent/domain/constants/cookie-consent.constant';

export function hasAcceptedCookies(cookieHeader: string): boolean {
  return cookieHeader
    .split(';')
    .map((pair) => pair.trim().split('='))
    .some(([name, value]) => name === COOKIE_CONSENT_NAME && value === COOKIE_CONSENT_ACCEPTED_VALUE);
}
