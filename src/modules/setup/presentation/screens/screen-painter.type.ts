import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';

export type ScreenPainter = (context: CanvasRenderingContext2D, size: Dimensions, elapsedSeconds: number) => void;
