// A human-style solver used by the generator to reject boards that can only
// be finished by guessing. It applies the deductions a player would make, in
// three tiers, and reports whether they reach the full solution:
//
//   0 basic        — a row, column or colour with one open cell gets the cat;
//                    a colour confined to one row/column clears the rest of
//                    that line (and a line confined to one colour clears the
//                    rest of that colour).
//   1 intermediate — k colours that fit inside k rows (or columns) clear the
//                    rest of those lines (k ≤ 4); a cell is ruled out if a cat
//                    there would leave some row, column or colour with no
//                    open cells.
//   2 one-move     — a cell is ruled out if a cat there leads, by tier 0–1
//                    reasoning, to a contradiction.
//
// Every rule is sound, so a board this solves has exactly one solution.
export type LogicLevel = 0 | 1 | 2;

const OPEN = 0;
const CAT = 1;
const CROSS = 2;

type Board = {
  size: number;
  // Cell indices per unit: rows 0..n-1, columns n..2n-1, regions 2n..3n-1.
  units: number[][];
  // For each cell: [row unit, column unit, region unit].
  cellUnits: number[][];
  neighbors: number[][];
};

function buildBoard(regionMap: number[][], size: number): Board {
  const units: number[][] = Array.from({ length: size * 3 }, () => []);
  const cellUnits: number[][] = [];
  const neighbors: number[][] = [];

  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      const cell = row * size + column;
      const region = 2 * size + regionMap[row][column];
      units[row].push(cell);
      units[size + column].push(cell);
      units[region].push(cell);
      cellUnits.push([row, size + column, region]);

      const around: number[] = [];
      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          const r = row + dr;
          const c = column + dc;
          if ((dr || dc) && r >= 0 && r < size && c >= 0 && c < size) {
            around.push(r * size + c);
          }
        }
      }
      neighbors.push(around);
    }
  }

  return { size, units, cellUnits, neighbors };
}

function placeCat(board: Board, grid: Uint8Array, cell: number): void {
  grid[cell] = CAT;
  for (const unit of board.cellUnits[cell]) {
    for (const other of board.units[unit]) {
      if (grid[other] === OPEN) grid[other] = CROSS;
    }
  }
  for (const other of board.neighbors[cell]) {
    if (grid[other] === OPEN) grid[other] = CROSS;
  }
}

// A unit with no cat and no open cell can never be filled.
function emptiedUnit(board: Board, grid: Uint8Array): number | null {
  for (let unit = 0; unit < board.units.length; unit += 1) {
    if (board.units[unit].every((cell) => grid[cell] === CROSS)) return unit;
  }
  return null;
}

function hasContradiction(board: Board, grid: Uint8Array): boolean {
  return emptiedUnit(board, grid) !== null;
}

function isSolved(board: Board, grid: Uint8Array): boolean {
  let cats = 0;
  for (let cell = 0; cell < grid.length; cell += 1) {
    if (grid[cell] === CAT) cats += 1;
  }
  return cats === board.size;
}

function openCells(board: Board, grid: Uint8Array, unit: number): number[] | null {
  const open: number[] = [];
  for (const cell of board.units[unit]) {
    if (grid[cell] === CAT) return null; // already satisfied
    if (grid[cell] === OPEN) open.push(cell);
  }
  return open;
}

function bitCount(value: number): number {
  let count = 0;
  for (let bits = value; bits; bits &= bits - 1) count += 1;
  return count;
}

// One deduction: the rule used, the cat it places or the cells it rules out,
// and the units (rows/columns/colours) it reasoned about.
export type Deduction = {
  rule: 'single' | 'confined' | 'pigeonhole' | 'blocked' | 'trial';
  cat: number | null;
  crosses: number[];
  units: number[];
  // confined: the unit the open cells fit inside.
  target?: number;
};

function cross(grid: Uint8Array, cells: number[]): number[] {
  for (const cell of cells) grid[cell] = CROSS;
  return cells;
}

// Applies one deduction and returns it; null when no rule at `level` makes progress.
function step(board: Board, grid: Uint8Array, level: LogicLevel): Deduction | null {
  const { size, units, cellUnits } = board;
  const open = units.map((_, unit) => openCells(board, grid, unit));

  // Singles.
  for (let unit = 0; unit < units.length; unit += 1) {
    const cells = open[unit];
    if (cells && cells.length === 1) {
      placeCat(board, grid, cells[0]);
      return { rule: 'single', cat: cells[0], crosses: [], units: [unit] };
    }
  }

  // Confinement: a unit's open cells all inside one other unit.
  for (let unit = 0; unit < units.length; unit += 1) {
    const cells = open[unit];
    if (!cells || cells.length === 0) continue;
    for (let kind = 0; kind < 3; kind += 1) {
      const target: number = cellUnits[cells[0]][kind];
      if (target === unit) continue;
      if (!cells.every((cell) => cellUnits[cell][kind] === target)) continue;
      const ruledOut = units[target].filter(
        (cell) => grid[cell] === OPEN && !cellUnits[cell].includes(unit),
      );
      if (ruledOut.length > 0) {
        return { rule: 'confined', cat: null, crosses: cross(grid, ruledOut), units: [unit], target };
      }
    }
  }
  if (level < 1) return null;

  // A cat here would empty some unit.
  for (let cell = 0; cell < grid.length; cell += 1) {
    if (grid[cell] !== OPEN) continue;
    const trial = grid.slice();
    placeCat(board, trial, cell);
    const emptied = emptiedUnit(board, trial);
    if (emptied !== null) {
      return { rule: 'blocked', cat: null, crosses: cross(grid, [cell]), units: [emptied] };
    }
  }
  // Pigeonhole: k colours whose open cells fit in k rows (or columns),
  // smallest k first (easiest to spot).
  for (let k = 2; k <= 4; k += 1) for (const kind of [0, 1]) {
    const regions: { unit: number; lines: number }[] = [];
    for (let unit = 2 * size; unit < 3 * size; unit += 1) {
      const cells = open[unit];
      if (!cells) continue;
      let lines = 0;
      for (const cell of cells) lines |= 1 << (cellUnits[cell][kind] - kind * size);
      regions.push({ unit, lines });
    }

    const search = (start: number, lines: number, chosen: number[]): Deduction | null => {
      if (chosen.length === k) {
        if (bitCount(lines) !== k) return null;
        const ruledOut: number[] = [];
        for (let cell = 0; cell < grid.length; cell += 1) {
          const line = cellUnits[cell][kind] - kind * size;
          if (grid[cell] === OPEN && lines & (1 << line) && !chosen.includes(cellUnits[cell][2])) {
            ruledOut.push(cell);
          }
        }
        if (ruledOut.length > 0) {
          const lineUnits: number[] = [];
          for (let line = 0; line < size; line += 1) {
            if (lines & (1 << line)) lineUnits.push(kind * size + line);
          }
          return { rule: 'pigeonhole', cat: null, crosses: cross(grid, ruledOut), units: [...chosen, ...lineUnits] };
        }
        return null;
      }
      for (let index = start; index < regions.length; index += 1) {
        const next = lines | regions[index].lines;
        if (bitCount(next) > k) continue;
        const found = search(index + 1, next, [...chosen, regions[index].unit]);
        if (found) return found;
      }
      return null;
    };
    const found = search(0, 0, []);
    if (found) return found;
  }

  if (level < 2) return null;

  // One-move test: a cat here fails under tier 0–1 reasoning.
  for (let cell = 0; cell < grid.length; cell += 1) {
    if (grid[cell] !== OPEN) continue;
    const trial = grid.slice();
    placeCat(board, trial, cell);
    while (!hasContradiction(board, trial) && !isSolved(board, trial) && step(board, trial, 1)) {
      // keep deducing
    }
    if (hasContradiction(board, trial)) {
      return { rule: 'trial', cat: null, crosses: cross(grid, [cell]), units: [] };
    }
  }
  return null;
}

export function isLogicSolvable(
  regionMap: number[][],
  size: number,
  level: LogicLevel,
): boolean {
  const board = buildBoard(regionMap, size);
  const grid = new Uint8Array(size * size);
  while (!hasContradiction(board, grid) && !isSolved(board, grid)) {
    if (!step(board, grid, level)) return false;
  }
  return isSolved(board, grid);
}

export type HintCell = { r: number; c: number };
export type Hint = {
  message: string;
  // What to do on the target cells: place a cat, mark ✕, or clear a wrong ✕.
  action: 'cat' | 'mark' | 'clear';
  // Cells the hint is about (flashing).
  targets: HintCell[];
  // The rows/columns/colours it reasoned about (softly highlighted).
  focus: HintCell[];
};

// The next step from the player's board: first any ✕ on a cat's square, then
// the first deduction the solver finds (cats already placed count, with the
// cells they rule out, even if unmarked). Falls back to revealing a cat.
export function getHint(
  regionMap: number[][],
  solution: number[],
  marks: ('blank' | 'note' | 'cat')[][],
  level: LogicLevel,
  noun: string,
): Hint | null {
  const size = solution.length;
  const at = (cell: number): HintCell => ({ r: Math.floor(cell / size), c: cell % size });

  for (let r = 0; r < size; r += 1) {
    if (marks[r][solution[r]] === 'note') {
      return {
        message: `This square is marked ✕, but it's where a ${noun} goes. Clear it.`,
        action: 'clear',
        targets: [{ r, c: solution[r] }],
        focus: [],
      };
    }
  }

  const board = buildBoard(regionMap, size);
  const grid = new Uint8Array(size * size);
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (marks[r][c] === 'note' && grid[r * size + c] === OPEN) grid[r * size + c] = CROSS;
      if (marks[r][c] === 'cat') placeCat(board, grid, r * size + c);
    }
  }
  if (isSolved(board, grid)) return null;

  const deduction = step(board, grid, level);
  const focusOf = (unitList: number[]) =>
    [...new Set(unitList.flatMap((unit) => board.units[unit]))].map(at);

  if (!deduction) {
    const r = solution.findIndex((c, row) => marks[row][c] !== 'cat');
    return {
      message: `No simple step from here — a ${noun} goes on this square.`,
      action: 'cat',
      targets: [{ r, c: solution[r] }],
      focus: [],
    };
  }

  const targets = deduction.cat !== null ? [at(deduction.cat)] : deduction.crosses.map(at);
  const action = deduction.cat !== null ? ('cat' as const) : ('mark' as const);
  const [unit] = deduction.units;
  const name = (u: number) => unitName(u, size);
  const Name = (u: number) => capitalise(name(u));
  switch (deduction.rule) {
    case 'single':
      return {
        message: `${Name(unit)} has only one open square left — place a ${noun} on the flashing square.`,
        action,
        targets,
        focus: focusOf(deduction.units),
      };
    case 'confined': {
      const target = deduction.target!;
      return {
        message: `${Name(unit)}'s open squares are all in ${name(target)}, so ${name(target)}'s ${noun} has to be in ${name(unit)}. Mark the rest of ${name(target)} (flashing).`,
        action,
        targets,
        focus: focusOf([unit]),
      };
    }
    case 'pigeonhole': {
      const colours = deduction.units.filter((u) => u >= 2 * size);
      const lines = deduction.units.filter((u) => u < 2 * size);
      const lineWord = lines[0] < size ? 'rows' : 'columns';
      const lineList = listNumbers(lines.map((u) => (u % size) + 1));
      const count = colours.length;
      return {
        message: `${capitalise(listWords(colours.map(name)))} only have open squares in ${lineWord} ${lineList}. Each colour needs a ${noun}, and those ${count} ${lineWord} only hold ${count} ${noun}s — so they all go to these colours. Mark everything else in ${lineWord} ${lineList} (flashing).`,
        action,
        targets,
        focus: focusOf(colours),
      };
    }
    case 'blocked':
      return {
        message: `A ${noun} on the flashing square would rule out every open square left in ${name(unit)} (they share its row, column or colour, or touch it). ${Name(unit)} would have nowhere to go — mark it.`,
        action,
        targets,
        focus: focusOf(deduction.units),
      };
    case 'trial':
      return {
        message: `A ${noun} on the flashing square leads to a dead end — mark it.`,
        action,
        targets,
        focus: [],
      };
  }
}

// Region colours by index, matching --region-N in index.css.
const COLOUR_NAMES = ['yellow', 'teal', 'blue', 'purple', 'pink', 'red', 'orange', 'green', 'grey', 'brown'];

function unitName(unit: number, size: number): string {
  if (unit < size) return `row ${unit + 1}`;
  if (unit < 2 * size) return `column ${unit - size + 1}`;
  return COLOUR_NAMES[(unit - 2 * size) % 10];
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function listWords(words: string[]): string {
  return words.length < 2 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
}

// "4–7" for a run, otherwise "2, 5 and 6".
function listNumbers(numbers: number[]): string {
  const sorted = [...numbers].sort((a, b) => a - b);
  const isRun = sorted.every((n, i) => i === 0 || n === sorted[i - 1] + 1);
  return isRun && sorted.length > 2 ? `${sorted[0]}–${sorted[sorted.length - 1]}` : listWords(sorted.map(String));
}
