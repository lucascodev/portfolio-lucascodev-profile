import { Canvas } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { DeskSetup } from '@/modules/setup/domain/types/desk-setup.type';
import { DeskSetupScene } from '@/modules/setup/presentation/components/desk-setup-scene/desk-setup-scene';
import { calculatePrimaryScreenFrame } from '@/modules/setup/presentation/geometry/calculate-primary-screen-frame';
import { useIsInViewport } from '@/shared/presentation/hooks/use-is-in-viewport/use-is-in-viewport';
import { CameraRig } from './components/camera-rig/camera-rig';
import { Room } from './components/room/room';
import { SceneEffects } from './components/scene-effects/scene-effects';
import { SceneLighting } from './components/scene-lighting/scene-lighting';
import styles from './setup-canvas.module.css';

interface SetupCanvasProps {
  readonly setup: DeskSetup;
  readonly isFocusedOnScreen: boolean;
  readonly isPaused: boolean;
  readonly onScreenSelect: () => void;
  readonly onCameraSettled: (isFocusedOnScreen: boolean) => void;
}

const BACKGROUND_COLOR = '#07070d';
const INITIAL_FOG_NEAR = 3.5;
const INITIAL_FOG_FAR = 9;

export function SetupCanvas({ setup, isFocusedOnScreen, isPaused, onScreenSelect, onCameraSettled }: SetupCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInViewport = useIsInViewport(containerRef);
  const screenFrame = useMemo(() => calculatePrimaryScreenFrame(setup), [setup]);

  return (
    <div ref={containerRef} className={styles.container}>
      <Canvas
        shadows="percentage"
        frameloop={isInViewport && !isPaused ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.4, 1.6], fov: 50, near: 0.02, far: 30 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        fallback={<p className={styles.fallback}>Seu navegador não suporta WebGL, então o setup 3D não pôde ser exibido.</p>}
        aria-label="Modelo 3D interativo do meu setup de trabalho"
      >
        <color attach="background" args={[BACKGROUND_COLOR]} />
        <fog attach="fog" args={[BACKGROUND_COLOR, INITIAL_FOG_NEAR, INITIAL_FOG_FAR]} />
        <CameraRig
          deskHeight={setup.desk.heightMeters}
          deskDepth={setup.desk.depthMeters}
          focusFrame={screenFrame}
          isFocused={isFocusedOnScreen}
          onSettled={onCameraSettled}
        />
        <SceneLighting />
        <Room room={setup.room} desk={setup.desk} />
        <DeskSetupScene setup={setup} isFocusedOnScreen={isFocusedOnScreen} onPrimaryMonitorSelect={onScreenSelect} />
        <SceneEffects />
      </Canvas>
    </div>
  );
}
