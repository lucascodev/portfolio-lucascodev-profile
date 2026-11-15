import type { CableEndpoint } from './cable-endpoint.type';

export interface CableSpec {
  readonly from: CableEndpoint;
  readonly to: CableEndpoint;
  readonly color?: string;
}
