import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { type Group, MeshStandardMaterial } from 'three';
import { METERS_PER_KEY_UNIT } from '@/modules/setup/domain/constants/physical-units.constant';
import { buildKeyboardGeometry } from '@/modules/setup/domain/rules/keyboard/build-keyboard-geometry.rule';
import type { KeyboardSpec } from '@/modules/setup/domain/types/keyboard/keyboard.type';
import type { KeycapTone } from '@/modules/setup/domain/types/keyboard/keycap-tone.type';
import type { KeycapLegendPalette } from '@/modules/setup/presentation/textures/paint-keycap-legends';
import { KeyboardKnob } from './components/keyboard-knob/keyboard-knob';
import { useKeycapLegends } from './hooks/use-keycap-legends/use-keycap-legends';

interface KeyboardProps {
  readonly keyboard: KeyboardSpec;
}

const CASE_PADDING = 0.012;
const CASE_HEIGHT = 0.02;
const KEYCAP_HEIGHT = 0.011;
const KEYCAP_GAP = 0.0022;
const KEYCAP_ROUGHNESS = 0.6;
const KEY_REST_Y = CASE_HEIGHT + 0.004 + KEYCAP_HEIGHT / 2;
const KEY_TRAVEL = 0.0035;
const KEY_PRESS_SECONDS = 0.09;
const AVERAGE_SECONDS_BETWEEN_KEYSTROKES = 0.09;
const BACKLIGHT_INTENSITY = 2.2;
const LEGEND_ABOVE_KEYCAP = 0.0002;
const KEYCAP_TONES: readonly KeycapTone[] = ['base', 'modifier', 'accent'];

function useKeycapMaterials(colors: Readonly<Record<KeycapTone, string>>): Readonly<Record<KeycapTone, MeshStandardMaterial>> {
  const { base, modifier, accent } = colors;
  const materials = useMemo(
    () => ({
      base: new MeshStandardMaterial({ color: base, roughness: KEYCAP_ROUGHNESS }),
      modifier: new MeshStandardMaterial({ color: modifier, roughness: KEYCAP_ROUGHNESS }),
      accent: new MeshStandardMaterial({ color: accent, roughness: KEYCAP_ROUGHNESS }),
    }),
    [base, modifier, accent],
  );
  useEffect(() => () => KEYCAP_TONES.forEach((tone) => materials[tone].dispose()), [materials]);
  return materials;
}

export function Keyboard({ keyboard }: KeyboardProps) {
  const geometry = useMemo(() => buildKeyboardGeometry(keyboard.layout), [keyboard.layout]);
  const keyRefs = useRef<(Group | null)[]>([]);
  const pressedAtRef = useRef<number[]>([]);
  const nextKeystrokeAtRef = useRef(0);

  const { keycapColor, accentKeycapColor, modifierKeycapColor = keycapColor, legendColor } = keyboard;
  const palette = useMemo<KeycapLegendPalette>(
    () => ({
      keycaps: { base: keycapColor, modifier: modifierKeycapColor, accent: accentKeycapColor },
      legends: { base: legendColor ?? keycapColor, modifier: legendColor ?? modifierKeycapColor, accent: keycapColor },
    }),
    [keycapColor, modifierKeycapColor, accentKeycapColor, legendColor],
  );
  const keycapMaterials = useKeycapMaterials(palette.keycaps);
  const legends = useKeycapLegends(geometry, KEYCAP_GAP, palette);

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();
    if (now >= nextKeystrokeAtRef.current) {
      const keyIndex = Math.floor(Math.random() * geometry.keys.length);
      pressedAtRef.current[keyIndex] = now;
      nextKeystrokeAtRef.current = now + AVERAGE_SECONDS_BETWEEN_KEYSTROKES * (0.4 + Math.random() * 1.2);
    }

    keyRefs.current.forEach((key, index) => {
      if (!key) return;
      const isPressed = now - (pressedAtRef.current[index] ?? Number.NEGATIVE_INFINITY) < KEY_PRESS_SECONDS;
      key.position.y = isPressed ? KEY_REST_Y - KEY_TRAVEL : KEY_REST_Y;
    });
  });

  return (
    <group>
      <RoundedBox
        args={[geometry.width + CASE_PADDING * 2, CASE_HEIGHT, geometry.depth + CASE_PADDING * 2]}
        radius={0.005}
        position={[0, CASE_HEIGHT / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={keyboard.caseColor} metalness={0.3} roughness={0.45} />
      </RoundedBox>

      {keyboard.backlightColor && (
        <mesh position={[0, CASE_HEIGHT + 0.001, 0]}>
          <boxGeometry args={[geometry.width, 0.002, geometry.depth]} />
          <meshStandardMaterial
            color={keyboard.backlightColor}
            emissive={keyboard.backlightColor}
            emissiveIntensity={BACKLIGHT_INTENSITY}
            toneMapped={false}
          />
        </mesh>
      )}

      {geometry.keys.map((key, index) => {
        const legendTop = legendColor ? legends.topGeometries[index] : undefined;
        return (
          <group
            key={key.id}
            ref={(group) => {
              keyRefs.current[index] = group;
            }}
            position={[key.x, KEY_REST_Y, key.z]}
          >
            <mesh material={keycapMaterials[key.tone]} castShadow>
              <boxGeometry args={[key.width - KEYCAP_GAP, KEYCAP_HEIGHT, METERS_PER_KEY_UNIT - KEYCAP_GAP]} />
            </mesh>
            {legendTop && (
              <mesh geometry={legendTop} material={legends.material} position-y={KEYCAP_HEIGHT / 2 + LEGEND_ABOVE_KEYCAP} />
            )}
          </group>
        );
      })}

      {geometry.knobs.map((knob) => (
        <KeyboardKnob key={knob.id} position={[knob.x, CASE_HEIGHT, knob.z]} />
      ))}
    </group>
  );
}
