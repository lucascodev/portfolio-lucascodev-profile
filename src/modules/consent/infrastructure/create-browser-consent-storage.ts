import type { ConsentStorage } from '@/modules/consent/domain/ports/consent-storage.port';
import { buildConsentCookie } from '@/modules/consent/domain/rules/build-consent-cookie.rule';
import { hasAcceptedCookies } from '@/modules/consent/domain/rules/has-accepted-cookies.rule';

/** Keeps the acceptance in a first-party cookie of the page, limited to `sitePath`. */
export function createBrowserConsentStorage(sitePath: string): ConsentStorage {
  return {
    hasAccepted: () => hasAcceptedCookies(document.cookie),
    saveAcceptance: () => {
      document.cookie = buildConsentCookie(sitePath);
    },
  };
}
