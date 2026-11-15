import type { Dimensions } from '@/modules/setup/domain/types/geometry/dimensions.type';
import { createSeededRandom } from '@/shared/utils/random/create-seeded-random';

interface CrackPatternColors {
  readonly background: string;
  readonly crack: string;
}

const PATTERN_SEED = 7;
const CRACK_COUNT = 7;
const MAX_BRANCH_DEPTH = 3;
const SEGMENTS_PER_CRACK = 18;
const BRANCH_PROBABILITY = 0.14;

interface CrackStroke {
  readonly x: number;
  readonly y: number;
  readonly angle: number;
  readonly width: number;
  readonly depth: number;
}

function drawCrack(context: CanvasRenderingContext2D, size: Dimensions, stroke: CrackStroke, random: () => number): void {
  let { x, y, angle } = stroke;
  const segmentLength = size.width / 32;

  context.lineWidth = stroke.width;
  context.beginPath();
  context.moveTo(x, y);

  for (let segment = 0; segment < SEGMENTS_PER_CRACK; segment++) {
    angle += (random() - 0.5) * 0.9;
    x += Math.cos(angle) * segmentLength * (0.5 + random());
    y += Math.sin(angle) * segmentLength * (0.5 + random());
    context.lineTo(x, y);

    const canBranch = stroke.depth < MAX_BRANCH_DEPTH && random() < BRANCH_PROBABILITY;
    if (canBranch) {
      context.stroke();
      const branchAngle = angle + (random() > 0.5 ? 1 : -1) * (0.5 + random() * 0.6);
      drawCrack(context, size, { x, y, angle: branchAngle, width: stroke.width * 0.6, depth: stroke.depth + 1 }, random);
      context.lineWidth = stroke.width;
      context.beginPath();
      context.moveTo(x, y);
    }
  }
  context.stroke();
}

export function paintCrackPattern(context: CanvasRenderingContext2D, size: Dimensions, colors: CrackPatternColors): void {
  const random = createSeededRandom(PATTERN_SEED);

  context.fillStyle = colors.background;
  context.fillRect(0, 0, size.width, size.height);
  context.strokeStyle = colors.crack;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.shadowColor = colors.crack;
  context.shadowBlur = size.width / 160;

  for (let crack = 0; crack < CRACK_COUNT; crack++) {
    drawCrack(
      context,
      size,
      {
        x: random() * size.width,
        y: random() * size.height,
        angle: random() * Math.PI * 2,
        width: size.width / 170 + random() * (size.width / 200),
        depth: 0,
      },
      random,
    );
  }
}
