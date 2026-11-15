import type { TypingRhythm } from './typing-rhythm.type';

export function calculateTypedCharacters(elapsedSeconds: number, totalCharacters: number, rhythm: TypingRhythm): number {
  if (totalCharacters === 0) return 0;

  const cycleSeconds = totalCharacters / rhythm.charactersPerSecond + rhythm.holdSeconds;
  const cycleElapsedSeconds = elapsedSeconds % cycleSeconds;
  return Math.min(totalCharacters, Math.floor(cycleElapsedSeconds * rhythm.charactersPerSecond));
}
