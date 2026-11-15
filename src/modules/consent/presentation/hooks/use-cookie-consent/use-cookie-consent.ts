import { useState } from 'react';
import type { ConsentStorage } from '@/modules/consent/domain/ports/consent-storage.port';

type ConsentStatus = 'pending' | 'accepted' | 'declined';

interface CookieConsent {
  readonly status: ConsentStatus;
  readonly accept: () => void;
  readonly decline: () => void;
}

export function useCookieConsent(storage: ConsentStorage): CookieConsent {
  const [status, setStatus] = useState<ConsentStatus>(() => (storage.hasAccepted() ? 'accepted' : 'pending'));

  const accept = () => {
    storage.saveAcceptance();
    setStatus('accepted');
  };
  const decline = () => setStatus('declined');

  return { status, accept, decline };
}
