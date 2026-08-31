export type CellPos = { r: number; c: number };

export type Puzzle = {
  regionMap: number[][]; // 6x6
  solution: number[]; // row index -> col index
  prefilled: (number | null)[]; // row index -> col index or null
};

// Store valid 6x6 cat placements (1 per row/col, no touching including diagonally)
const VALID_CONFIGS: number[][] = [];

function initConfigs() {
  if (VALID_CONFIGS.length > 0) return;
  function search(r: number, cols: number[]) {
    if (r === 6) {
      VALID_CONFIGS.push([...cols]);
      return;
    }
    for (let c = 0; c < 6; c++) {
      let ok = true;
      for (let i = 0; i < r; i++) {
        // Check same column or diagonal touch
        if (
          cols[i] === c ||
          (Math.abs(cols[i] - c) <= 1 && Math.abs(i - r) <= 1)
        ) {
          ok = false;
          break;
        }
      }
      if (ok) search(r + 1, [...cols, c]);
    }
  }
  search(0, []);
}

function createPuzzleObj(
  map: number[][],
  config: number[],
  prefillCount: number,
  random: () => number
): Puzzle {
  let prefilled = Array(6).fill(null);
  if (prefillCount > 0) {
    let indices = [0, 1, 2, 3, 4, 5];
    for (let i = 0; i < prefillCount; i++) {
      let idx = Math.floor(random() * indices.length);
      let row = indices.splice(idx, 1)[0];
      prefilled[row] = config[row];
    }
  }
  return { regionMap: map, solution: config, prefilled };
}

export function generatePuzzle(seed?: number, prefillCount: number = 0): Puzzle {
  initConfigs();
  
  let random = Math.random;
  if (seed !== undefined) {
    // Mulberry32 PRNG for deterministic daily puzzles
    let a = seed;
    random = () => {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  let maxAttempts = 2000;
  let bestFallback: Puzzle | null = null;

  while (maxAttempts-- > 0) {
    // 1. Pick a random valid config
    const config = VALID_CONFIGS[Math.floor(random() * VALID_CONFIGS.length)];

    // 2. Generate contiguous regions
    let map = Array.from({ length: 6 }, () => Array(6).fill(-1));
    for (let i = 0; i < 6; i++) map[i][config[i]] = i;

    let emptyCells = 30;
    let stuck = false;
    
    while (emptyCells > 0) {
      let candidates: { r: number; c: number; adj: number[] }[] = [];
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          if (map[r][c] === -1) {
            let adj = new Set<number>();
            if (r > 0 && map[r - 1][c] !== -1) adj.add(map[r - 1][c]);
            if (r < 5 && map[r + 1][c] !== -1) adj.add(map[r + 1][c]);
            if (c > 0 && map[r][c - 1] !== -1) adj.add(map[r][c - 1]);
            if (c < 5 && map[r][c + 1] !== -1) adj.add(map[r][c + 1]);
            if (adj.size > 0) candidates.push({ r, c, adj: Array.from(adj) });
          }
        }
      }
      if (candidates.length === 0) {
        stuck = true;
        break;
      }
      let cand = candidates[Math.floor(random() * candidates.length)];
      let reg = cand.adj[Math.floor(random() * cand.adj.length)];
      map[cand.r][cand.c] = reg;
      emptyCells--;
    }

    if (stuck) continue;

    // 3. Verify unique solution
    let solutions = 0;
    for (let i = 0; i < VALID_CONFIGS.length; i++) {
      let cnf = VALID_CONFIGS[i];
      let regionHasStar = [false, false, false, false, false, false];
      for (let r = 0; r < 6; r++) {
        regionHasStar[map[r][cnf[r]]] = true;
      }
      if (regionHasStar.every((x) => x)) {
        solutions++;
      }
    }

    if (solutions === 1) {
      return createPuzzleObj(map, config, prefillCount, random);
    }
    if (solutions > 0 && !bestFallback) {
      bestFallback = createPuzzleObj(map, config, prefillCount, random);
    }
  }

  // Fallback if we somehow didn't find a unique one
  return bestFallback!;
}

export function getDailySeed(): number {
  const d = new Date();
  // UTC makes the daily puzzle identical for players in every timezone.
  const str = `${d.getUTCFullYear()}${(d.getUTCMonth() + 1).toString().padStart(2, '0')}${d.getUTCDate().toString().padStart(2, '0')}`;
  return parseInt(str, 10);
}

export function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
