import type { CableEndpoint } from '@/modules/setup/domain/types/cables/cable-endpoint.type';
import type { CableAnchor } from './cable-anchor.type';

export type CableAnchors = Partial<Record<Exclude<CableEndpoint, 'desk-back'>, CableAnchor>>;
