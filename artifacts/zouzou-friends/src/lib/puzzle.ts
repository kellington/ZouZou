export type CellPos = { r: number; c: number };
export type Difficulty = 'easy' | 'medium' | 'hard';
export type PuzzleSize = 6 | 8 | 10;

export type Puzzle = {
  regionMap: number[][];
  solution: number[];
  prefilled: (number | null)[];
  size: PuzzleSize;
};

type RandomSource = () => number;

function createSeededRandom(seed: number): RandomSource {
  let state = seed >>> 0;

  return () => {
    let value = (state += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(values: T[], random: RandomSource): T[] {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[other]] = [
      shuffled[other],
      shuffled[index],
    ];
  }

  return shuffled;
}

function createSolution(size: PuzzleSize, random: RandomSource): number[] {
  const columns: number[] = [];
  const usedColumns = new Set<number>();

  function search(row: number): boolean {
    if (row === size) return true;

    const candidates = shuffle(
      Array.from({ length: size }, (_, column) => column),
      random,
    );

    for (const column of candidates) {
      const touchesPrevious =
        row > 0 && Math.abs(columns[row - 1] - column) <= 1;

      if (usedColumns.has(column) || touchesPrevious) continue;

      columns.push(column);
      usedColumns.add(column);

      if (search(row + 1)) return true;

      columns.pop();
      usedColumns.delete(column);
    }

    return false;
  }

  if (!search(0)) {
    throw new Error(`Unable to create a valid ${size}x${size} solution`);
  }

  return columns;
}

function countSolutions(
  regionMap: number[][],
  size: PuzzleSize,
  limit = 2,
): number {
  let count = 0;
  const usedColumns = Array<boolean>(size).fill(false);
  const usedRegions = Array<boolean>(size).fill(false);

  function search(row: number, previousColumn: number | null): void {
    if (count >= limit) return;

    if (row === size) {
      count += 1;
      return;
    }

    for (let column = 0; column < size; column += 1) {
      const region = regionMap[row][column];
      const touchesPrevious =
        previousColumn !== null &&
        Math.abs(previousColumn - column) <= 1;

      if (
        usedColumns[column] ||
        usedRegions[region] ||
        touchesPrevious
      ) {
        continue;
      }

      usedColumns[column] = true;
      usedRegions[region] = true;
      search(row + 1, column);
      usedColumns[column] = false;
      usedRegions[region] = false;
    }
  }

  search(0, null);
  return count;
}

function isRegionConnected(
  regionMap: number[][],
  region: number,
  size: PuzzleSize,
): boolean {
  const cells: CellPos[] = [];

  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      if (regionMap[row][column] === region) {
        cells.push({ r: row, c: column });
      }
    }
  }

  if (cells.length === 0) return false;

  const pending = [cells[0]];
  const visited = new Set([`${cells[0].r}:${cells[0].c}`]);

  for (let index = 0; index < pending.length; index += 1) {
    const cell = pending[index];
    const neighbors = [
      { r: cell.r - 1, c: cell.c },
      { r: cell.r + 1, c: cell.c },
      { r: cell.r, c: cell.c - 1 },
      { r: cell.r, c: cell.c + 1 },
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.r < 0 ||
        neighbor.r >= size ||
        neighbor.c < 0 ||
        neighbor.c >= size ||
        regionMap[neighbor.r][neighbor.c] !== region
      ) {
        continue;
      }

      const key = `${neighbor.r}:${neighbor.c}`;
      if (!visited.has(key)) {
        visited.add(key);
        pending.push(neighbor);
      }
    }
  }

  return visited.size === cells.length;
}

function createRegionMap(
  solution: number[],
  size: PuzzleSize,
  random: RandomSource,
): number[][] {
  const backgroundRegion = size - 1;
  const regionMap = Array.from({ length: size }, () =>
    Array<number>(size).fill(backgroundRegion),
  );
  const regionSizes = Array<number>(size).fill(1);

  for (let row = 0; row < backgroundRegion; row += 1) {
    regionMap[row][solution[row]] = row;
  }
  regionSizes[backgroundRegion] = size * size - backgroundRegion;

  const protectedBackgroundCell = {
    r: backgroundRegion,
    c: solution[backgroundRegion],
  };
  const maximumMoves = size * size;
  let moves = 0;

  while (moves < maximumMoves) {
    let moved = false;
    const regions = shuffle(
      Array.from({ length: backgroundRegion }, (_, region) => region),
      random,
    ).sort((left, right) => regionSizes[left] - regionSizes[right]);

    for (const region of regions) {
      const candidates = new Map<string, CellPos>();

      for (let row = 0; row < size; row += 1) {
        for (let column = 0; column < size; column += 1) {
          if (regionMap[row][column] !== region) continue;

          const neighbors = [
            { r: row - 1, c: column },
            { r: row + 1, c: column },
            { r: row, c: column - 1 },
            { r: row, c: column + 1 },
          ];

          for (const neighbor of neighbors) {
            if (
              neighbor.r < 0 ||
              neighbor.r >= size ||
              neighbor.c < 0 ||
              neighbor.c >= size ||
              regionMap[neighbor.r][neighbor.c] !== backgroundRegion ||
              (neighbor.r === protectedBackgroundCell.r &&
                neighbor.c === protectedBackgroundCell.c)
            ) {
              continue;
            }

            candidates.set(`${neighbor.r}:${neighbor.c}`, neighbor);
          }
        }
      }

      for (const candidate of shuffle([...candidates.values()], random)) {
        regionMap[candidate.r][candidate.c] = region;

        const remainsConnected = isRegionConnected(
          regionMap,
          backgroundRegion,
          size,
        );
        const remainsUnique =
          remainsConnected && countSolutions(regionMap, size) === 1;

        if (remainsUnique) {
          regionSizes[region] += 1;
          regionSizes[backgroundRegion] -= 1;
          moves += 1;
          moved = true;
          break;
        }

        regionMap[candidate.r][candidate.c] = backgroundRegion;
      }

      if (moved) break;
    }

    if (!moved) break;
  }

  return regionMap;
}

function createPrefilledCells(
  solution: number[],
  size: PuzzleSize,
  prefillCount: number,
  random: RandomSource,
): (number | null)[] {
  const prefilled = Array<number | null>(size).fill(null);
  const rows = shuffle(
    Array.from({ length: size }, (_, row) => row),
    random,
  );

  for (
    let index = 0;
    index < Math.min(prefillCount, size);
    index += 1
  ) {
    const row = rows[index];
    prefilled[row] = solution[row];
  }

  return prefilled;
}

export function generatePuzzle(
  size: PuzzleSize,
  seed?: number,
  prefillCount = 0,
): Puzzle {
  const random =
    seed === undefined ? Math.random : createSeededRandom(seed);
  const solution = createSolution(size, random);
  const regionMap = createRegionMap(solution, size, random);

  return {
    size,
    solution,
    regionMap,
    prefilled: createPrefilledCells(
      solution,
      size,
      prefillCount,
      random,
    ),
  };
}

export function getEdmontonDateKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Edmonton',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export function getDailySeed(date = new Date()): number {
  return Number.parseInt(getEdmontonDateKey(date).replaceAll('-', ''), 10);
}

export function getDailyDifficulty(seed = getDailySeed()): Difficulty {
  const options: Difficulty[] = ['easy', 'medium', 'hard'];
  const random = createSeededRandom(seed ^ 0x5a17c9e3);
  return options[Math.floor(random() * options.length)];
}

export function formatDailyDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  })
    .format(new Date(Date.UTC(year, month - 1, day)))
    .replace(' ', '-');
}

export function formatTime(seconds: number): string {
  const wholeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(wholeSeconds / 60);
  const remainder = wholeSeconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}