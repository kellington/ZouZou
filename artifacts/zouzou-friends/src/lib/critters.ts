export type Critter = 'cat' | 'dog' | 'dino' | 'monkey';

export const CRITTERS: readonly Critter[] = ['cat', 'dog', 'dino', 'monkey'];

// Picker label (visible + aria) and the capitalized, sentence-initial plural
// noun (e.g. "Cats cannot touch each other...") share the same text.
export const CRITTER_LABEL: Record<Critter, string> = {
  cat: 'Cats',
  dog: 'Dogs',
  dino: 'Dinosaurs',
  monkey: 'Monkeys',
};

export const CRITTER_NOUN: Record<Critter, { singular: string; plural: string }> = {
  cat: { singular: 'cat', plural: 'cats' },
  dog: { singular: 'dog', plural: 'dogs' },
  dino: { singular: 'dinosaur', plural: 'dinosaurs' },
  monkey: { singular: 'monkey', plural: 'monkeys' },
};

// Win-modal title, per creature.
export const CRITTER_WIN_TITLE: Record<Critter, string> = {
  cat: 'Purrfect!',
  dog: 'Pawsome!',
  dino: 'Roarsome!',
  monkey: 'Bananas!',
};

export function isCritter(value: unknown): value is Critter {
  return typeof value === 'string' && (CRITTERS as string[]).includes(value);
}

// A missing or unknown stored value means cat, so existing players see no change.
export function normalizeCritter(value: unknown): Critter {
  return isCritter(value) ? value : 'cat';
}
