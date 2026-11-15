import type { CableSpec } from './cables/cable.type';
import type { AccessorySpec } from './desk-items/accessory.type';
import type { DeskMatSpec } from './desk-items/desk-mat.type';
import type { DeskSpec } from './desk-items/desk.type';
import type { MonitorArmSpec } from './desk-items/monitor-arm.type';
import type { MouseSpec } from './desk-items/mouse.type';
import type { PcTowerSpec } from './desk-items/pc-tower.type';
import type { RoomSpec } from './desk-items/room.type';
import type { KeyboardSpec } from './keyboard/keyboard.type';
import type { LaptopSpec } from './laptop/laptop.type';
import type { MonitorSpec } from './monitor/monitor.type';

export interface DeskSetup {
  readonly room: RoomSpec;
  readonly desk: DeskSpec;
  readonly monitors: readonly MonitorSpec[];
  readonly keyboard: KeyboardSpec;
  readonly mouse: MouseSpec;
  readonly laptop?: LaptopSpec;
  readonly monitorArm?: MonitorArmSpec;
  readonly deskMat?: DeskMatSpec;
  readonly pcTower?: PcTowerSpec;
  readonly accessories: readonly AccessorySpec[];
  readonly cables?: readonly CableSpec[];
}
