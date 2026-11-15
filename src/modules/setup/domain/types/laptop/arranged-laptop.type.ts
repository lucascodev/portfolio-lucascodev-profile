import type { DisplayPlacement } from '@/modules/setup/domain/types/geometry/display-placement.type';
import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import type { LaptopSpec } from './laptop.type';

export interface ArrangedLaptop {
  readonly spec: LaptopSpec;
  readonly screenSize: Dimensions;
  readonly bodySize: Dimensions;
  readonly placement: DisplayPlacement;
}
