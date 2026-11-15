const SHORT_NAME_MAX_LENGTH = 3;
const MONOGRAM_MAX_LENGTH = 2;

function getInitials(words: readonly string[]): string {
  return words
    .slice(0, MONOGRAM_MAX_LENGTH)
    .map((word) => word[0].toUpperCase())
    .join('');
}

function getCapitals(word: string): string {
  const capitals = word.match(/[A-Z]/g)?.slice(0, MONOGRAM_MAX_LENGTH).join('');
  return capitals || word[0].toUpperCase();
}

export function getSkillMonogram(skill: string): string {
  const name = skill.trim();
  if (name.length <= SHORT_NAME_MAX_LENGTH) return name;

  const words = name.split(/\s+/);
  return words.length > 1 ? getInitials(words) : getCapitals(name);
}
