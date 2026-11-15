import type { AccessorySpec } from '@/modules/setup/domain/types/desk-items/accessory.type';
import type { ScenePosition } from '@/modules/setup/domain/types/geometry/scene-position.type';
import { DrawingTablet } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/drawing-tablet/drawing-tablet';
import { Gamepad } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/gamepad/gamepad';
import { HardDrives } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/hard-drives/hard-drives';
import { Headphones } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/headphones/headphones';
import { Lamp } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/lamp/lamp';
import { Microphone } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/microphone/microphone';
import { Mug } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/mug/mug';
import { PhoneDock } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/phone-dock/phone-dock';
import { PhoneStand } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/phone-stand/phone-stand';
import { PhotoFrame } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/photo-frame/photo-frame';
import { PowerStrip } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/power-strip/power-strip';
import { Plant } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/plant/plant';
import { RgbRemote } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/rgb-remote/rgb-remote';
import { Speaker } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/speaker/speaker';
import { transformToPlacement } from '@/modules/setup/presentation/geometry/transform-to-placement';
import { ToyCar } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/toy-car/toy-car';
import { Tumbler } from '@/modules/setup/presentation/components/desk-setup-scene/components/accessories/tumbler/tumbler';

type MicrophoneAccessory = Extract<AccessorySpec, { kind: 'microphone' }>;

function resolveBoomClamp(microphone: MicrophoneAccessory): ScenePosition | undefined {
  if (microphone.mount?.kind !== 'boom-arm') return undefined;
  const placement = {
    x: microphone.position.x,
    z: microphone.position.z,
    rotationY: ((microphone.rotationDegrees ?? 0) * Math.PI) / 180,
  };
  const { clamp, heightMeters } = microphone.mount;
  return transformToPlacement(placement, { x: clamp.x, y: -heightMeters, z: clamp.z });
}

interface AccessoryModelProps {
  readonly accessory: AccessorySpec;
}

export function AccessoryModel({ accessory }: AccessoryModelProps) {
  switch (accessory.kind) {
    case 'lamp':
      return <Lamp lightColor={accessory.lightColor} armDirection={accessory.position.x > 0 ? -1 : 1} />;
    case 'plant':
      return <Plant />;
    case 'mug':
      return <Mug color={accessory.color} />;
    case 'tumbler':
      return <Tumbler color={accessory.color} />;
    case 'headphones':
      return <Headphones color={accessory.color} />;
    case 'speaker':
      return <Speaker color={accessory.color} />;
    case 'microphone':
      return <Microphone color={accessory.color} ringColor={accessory.ringColor} boomClamp={resolveBoomClamp(accessory)} />;
    case 'drawing-tablet':
      return <DrawingTablet color={accessory.color} penColor={accessory.penColor} />;
    case 'phone-stand':
      return <PhoneStand color={accessory.color} phone={accessory.phone} />;
    case 'photo-frame':
      return <PhotoFrame frameColor={accessory.frameColor} />;
    case 'power-strip':
      return <PowerStrip color={accessory.color} />;
    case 'phone-dock':
      return <PhoneDock color={accessory.color} phone={accessory.phone} />;
    case 'gamepad':
      return <Gamepad color={accessory.color} />;
    case 'hard-drives':
      return <HardDrives count={accessory.count} />;
    case 'toy-car':
      return <ToyCar color={accessory.color} />;
    case 'rgb-remote':
      return <RgbRemote color={accessory.color} />;
  }
}
