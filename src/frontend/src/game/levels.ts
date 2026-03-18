import { ALL_ITEM_TYPES } from "./items";

export interface Level {
  id: number;
  difficulty: "easy" | "medium" | "hard";
  shelves: string[][];
  timeLimit: number;
  numShelves: number;
  isBoss?: boolean;
}

const SHELF_CAPACITY = 3;

function seededRandom(seed: number): () => number {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0x100000000;
  };
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function distribute(
  items: string[],
  numShelves: number,
  rng: () => number,
): string[][] {
  const shelves: string[][] = Array.from({ length: numShelves }, () => []);
  for (const item of items) {
    const candidates: number[] = [];
    const fallbacks: number[] = [];
    for (let i = 0; i < numShelves; i++) {
      if (shelves[i].length >= SHELF_CAPACITY) continue;
      const sameCount = shelves[i].filter((x) => x === item).length;
      if (sameCount < 2) candidates.push(i);
      else fallbacks.push(i);
    }
    const pool = candidates.length > 0 ? candidates : fallbacks;
    if (pool.length === 0) continue;
    const chosen = pool[Math.floor(rng() * pool.length)];
    shelves[chosen].push(item);
  }
  return shelves;
}

function getDifficultyConfig(levelId: number): {
  difficulty: "easy" | "medium" | "hard";
  numShelves: number;
  numTypes: number;
  timeLimit: number;
  isBoss: boolean;
} {
  if (levelId % 10 === 0) {
    return {
      difficulty: "hard",
      numShelves: 10,
      numTypes: 8,
      timeLimit: 150,
      isBoss: true,
    };
  }
  if (levelId <= 10)
    return {
      difficulty: "easy",
      numShelves: 5,
      numTypes: 3,
      timeLimit: 90,
      isBoss: false,
    };
  if (levelId <= 25)
    return {
      difficulty: "easy",
      numShelves: 6,
      numTypes: 4,
      timeLimit: 90,
      isBoss: false,
    };
  if (levelId <= 50)
    return {
      difficulty: "medium",
      numShelves: 7,
      numTypes: 5,
      timeLimit: 120,
      isBoss: false,
    };
  if (levelId <= 75)
    return {
      difficulty: "medium",
      numShelves: 8,
      numTypes: 6,
      timeLimit: 150,
      isBoss: false,
    };
  return {
    difficulty: "hard",
    numShelves: 9,
    numTypes: 7,
    timeLimit: 240,
    isBoss: false,
  };
}

function buildLevel(levelId: number, seed: number): Level {
  const { difficulty, numShelves, numTypes, timeLimit, isBoss } =
    getDifficultyConfig(levelId);
  const rng = seededRandom(seed);
  const types = seededShuffle([...ALL_ITEM_TYPES], rng).slice(0, numTypes);
  // Each type gets exactly 3 items (fills one shelf when matched)
  const items = seededShuffle(
    types.flatMap((t) => [t, t, t]),
    rng,
  );
  const shelves = distribute(items, numShelves, rng);
  return { id: levelId, difficulty, shelves, timeLimit, numShelves, isBoss };
}

export const LEVELS: Level[] = Array.from({ length: 100 }, (_, i) =>
  buildLevel(i + 1, (i + 1) * 97531 + 12345),
);

export function getLevel(levelId: number): Level {
  if (levelId >= 1 && levelId <= 100) return LEVELS[levelId - 1];
  return buildLevel(levelId, levelId * 99991 + 7);
}
