import {
  COOKIE_CONSENT_ACCEPTED_VALUE,
  COOKIE_CONSENT_MAX_AGE_SECONDS,
  COOKIE_CONSENT_NAME,
} from '@/modules/consent/domain/constants/cookie-consent.constant';

/** The `document.cookie` assignment that records the acceptance, scoped to the path the site is served from. */
export function buildConsentCookie(sitePath: string): string {
  return [
    `${COOKIE_CONSENT_NAME}=${COOKIE_CONSENT_ACCEPTED_VALUE}`,
    `Max-Age=${COOKIE_CONSENT_MAX_AGE_SECONDS}`,
    `Path=${sitePath}`,
    'SameSite=Lax',
  ].join('; ');
}
