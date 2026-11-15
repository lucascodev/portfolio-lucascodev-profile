import { Html, useCursor } from '@react-three/drei';
import { type ThreeEvent, useFrame } from '@react-three/fiber';
import { type ReactNode, useRef, useState } from 'react';
import type { Group } from 'three';
import { useBlueprintReveal } from '@/modules/setup/presentation/hooks/use-blueprint-reveal/use-blueprint-reveal';
import { useFadeVisibility } from '@/modules/setup/presentation/hooks/use-fade-visibility/use-fade-visibility';
import { usePrefersReducedMotion } from '@/shared/presentation/hooks/use-prefers-reduced-motion/use-prefers-reduced-motion';
import styles from './setup-item.module.css';

type Vector3Tuple = [number, number, number];

interface SetupItemProps {
  readonly label: string;
  readonly revealDelaySeconds: number;
  readonly tooltipPosition: Vector3Tuple;
  readonly position?: Vector3Tuple;
  readonly rotationY?: number;
  readonly isLiftable?: boolean;
  readonly isInteractive?: boolean;
  readonly actionHint?: string;
  readonly isFadedOut?: boolean;
  readonly hasTooltip?: boolean;
  readonly onSelect?: () => void;
  readonly onHoverChange?: (isHovered: boolean) => void;
  readonly children: ReactNode;
}

const HOVER_LIFT_METERS = 0.012;
const HOVER_EASING_SPEED = 12;

export function SetupItem({
  label,
  revealDelaySeconds,
  tooltipPosition,
  position,
  rotationY = 0,
  isLiftable = false,
  isInteractive = true,
  actionHint,
  isFadedOut = false,
  hasTooltip = true,
  onSelect,
  onHoverChange,
  children,
}: SetupItemProps) {
  const liftRef = useRef<Group>(null);
  const contentRef = useRef<Group>(null);
  const [isPointerOver, setIsPointerOver] = useState(false);
  const isMotionReduced = usePrefersReducedMotion();
  const isHovered = isPointerOver && isInteractive;

  useCursor(isHovered);
  useBlueprintReveal(contentRef, { delaySeconds: revealDelaySeconds, isEnabled: !isMotionReduced });
  useFadeVisibility(liftRef, !isFadedOut);

  useFrame((_, deltaSeconds) => {
    const lift = liftRef.current;
    if (!lift) return;
    const targetY = isLiftable && isHovered && !isMotionReduced ? HOVER_LIFT_METERS : 0;
    lift.position.y += (targetY - lift.position.y) * Math.min(1, deltaSeconds * HOVER_EASING_SPEED);
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsPointerOver(true);
    onHoverChange?.(true);
  };

  const handlePointerOut = () => {
    setIsPointerOver(false);
    onHoverChange?.(false);
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!onSelect || !isInteractive) return;
    event.stopPropagation();
    onSelect();
  };

  return (
    <group position={position} rotation-y={rotationY}>
      <group
        ref={liftRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <group ref={contentRef}>{children}</group>
      </group>
      {isHovered && hasTooltip && (
        <Html position={tooltipPosition} center zIndexRange={[20, 10]} style={{ pointerEvents: 'none' }}>
          <span className={styles.tooltip}>
            {label}
            {actionHint && <span className={styles.actionHint}>{actionHint}</span>}
          </span>
        </Html>
      )}
    </group>
  );
}
