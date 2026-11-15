import { deskSetupContent } from '@/content/desk-setup.content';
import { portfolioContent } from '@/content/portfolio.content';
import { CookieBanner, createBrowserConsentStorage } from '@/modules/consent';
import { HomePage } from '@/modules/portfolio';

const consentStorage = createBrowserConsentStorage(import.meta.env.BASE_URL);

export function App() {
  return (
    <>
      <HomePage content={portfolioContent} deskSetup={deskSetupContent} />
      <CookieBanner storage={consentStorage} />
    </>
  );
}
