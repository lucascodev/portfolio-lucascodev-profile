import { lazy, Suspense } from 'react';
import type { PortfolioContent } from '@/modules/portfolio/domain/types/portfolio-content.type';
import { LinuxDesktop } from '@/modules/portfolio/presentation/components/linux-desktop/linux-desktop';
import { SetupIntro } from '@/modules/portfolio/presentation/components/setup-intro/setup-intro';
import { useExperienceMode } from '@/modules/portfolio/presentation/hooks/use-experience-mode/use-experience-mode';
import type { DeskSetup } from '@/modules/setup';
import { useKeyPress } from '@/shared/presentation/hooks/use-key-press/use-key-press';
import { ErrorBoundary } from '@/shared/presentation/components/feedback/error-boundary/error-boundary';
import styles from './home-page.module.css';

interface HomePageProps {
  readonly content: PortfolioContent;
  readonly deskSetup: DeskSetup;
}

const SetupCanvas = lazy(() => import('@/modules/setup').then((module) => ({ default: module.SetupCanvas })));

export function HomePage({ content, deskSetup }: HomePageProps) {
  const experience = useExperienceMode();
  useKeyPress('Enter', experience.enterComputer, { isEnabled: experience.mode === 'setup' });
  useKeyPress('Escape', experience.powerOff, { isEnabled: experience.mode === 'desktop', worksWhileTyping: true });

  return (
    <main className={styles.page}>
      <div className={styles.scene}>
        <ErrorBoundary fallback={<p className={styles.sceneMessage}>não foi possível desenhar o setup aqui</p>}>
          <Suspense fallback={<p className={styles.sceneMessage}>desenhando o setup…</p>}>
            <SetupCanvas
              setup={deskSetup}
              isFocusedOnScreen={experience.isFocusedOnScreen}
              isPaused={experience.isDesktopFullyOn}
              onScreenSelect={experience.enterComputer}
              onCameraSettled={experience.handleCameraSettled}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      <SetupIntro profile={content.profile} isVisible={experience.mode === 'setup'} />
      {experience.isDesktopVisible && (
        <LinuxDesktop content={content} isShuttingDown={experience.mode === 'shutting-down'} onPowerOff={experience.powerOff} />
      )}
    </main>
  );
}
