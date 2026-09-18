import { CellPos, Puzzle } from '../lib/puzzle';
import { CritterIcon, CritterMarkIcon } from './Icons';
import { CRITTER_NOUN, type Critter } from '../lib/critters';
import { Lock } from 'lucide-react';
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';

export type CellState = 'blank' | 'note' | 'cat';

interface BoardProps {
  puzzle: Puzzle;
  grid: CellState[][];
  mistakeCell: CellPos | null;
  onCellClick: (r: number, c: number) => void;
  onCellDoubleClick: (r: number, c: number) => void;
  onCellPaint: (r: number, c: number, state: 'blank' | 'note') => void;
  isWon?: boolean;
  critter: Critter;
}

export function Board({
  puzzle,
  grid,
  mistakeCell,
  onCellClick,
  onCellDoubleClick,
  onCellPaint,
  isWon,
  critter,
}: BoardProps) {
  const noun = CRITTER_NOUN[critter];
  const size = puzzle.size || 6;
  const pendingTaps = useRef(new Map<string, number>());
  const suppressNextClick = useRef(false);
  const dragGesture = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startCell: CellPos;
    mode: 'paint' | 'erase';
    active: boolean;
    visited: Set<string>;
  } | null>(null);

  useEffect(() => {
    return () => {
      for (const timer of pendingTaps.current.values()) {
        window.clearTimeout(timer);
      }
      pendingTaps.current.clear();
    };
  }, []);

  const handleCellTap = (r: number, c: number) => {
    if (suppressNextClick.current) {
      suppressNextClick.current = false;
      return;
    }

    const key = `${r}-${c}`;
    const pendingTap = pendingTaps.current.get(key);

    if (pendingTap !== undefined) {
      window.clearTimeout(pendingTap);
      pendingTaps.current.delete(key);
      onCellDoubleClick(r, c);
      return;
    }

    const timer = window.setTimeout(() => {
      pendingTaps.current.delete(key);
      onCellClick(r, c);
    }, 240);
    pendingTaps.current.set(key, timer);
  };

  const getCellFromPoint = (clientX: number, clientY: number): CellPos | null => {
    const element = document
      .elementFromPoint(clientX, clientY)
      ?.closest<HTMLElement>('[data-cell-row][data-cell-column]');
    if (!element) return null;

    const r = Number(element.dataset.cellRow);
    const c = Number(element.dataset.cellColumn);
    return Number.isInteger(r) && Number.isInteger(c) ? { r, c } : null;
  };

  const paintCell = (cell: CellPos) => {
    const gesture = dragGesture.current;
    if (!gesture || isWon || puzzle.prefilled[cell.r] === cell.c) return;

    const key = `${cell.r}-${cell.c}`;
    if (gesture.visited.has(key)) return;
    gesture.visited.add(key);

    const current = grid[cell.r]?.[cell.c];
    if (gesture.mode === 'paint' && current === 'blank') {
      onCellPaint(cell.r, cell.c, 'note');
    } else if (gesture.mode === 'erase' && current === 'note') {
      onCellPaint(cell.r, cell.c, 'blank');
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || isWon) return;
    suppressNextClick.current = false;
    const startCell = getCellFromPoint(event.clientX, event.clientY);
    if (!startCell || puzzle.prefilled[startCell.r] === startCell.c) return;

    dragGesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startCell,
      mode: grid[startCell.r]?.[startCell.c] === 'note' ? 'erase' : 'paint',
      active: false,
      visited: new Set(),
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = dragGesture.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    if (!gesture.active) {
      const distance = Math.hypot(
        event.clientX - gesture.startX,
        event.clientY - gesture.startY,
      );
      if (distance < 8) return;

      gesture.active = true;
      suppressNextClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      paintCell(gesture.startCell);
    }

    event.preventDefault();
    const cell = getCellFromPoint(event.clientX, event.clientY);
    if (cell) paintCell(cell);
  };

  const finishPointerGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = dragGesture.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragGesture.current = null;

    if (gesture.active) {
      window.setTimeout(() => {
        suppressNextClick.current = false;
      }, 0);
    }
  };
  
  const getBorders = (r: number, c: number) => {
    return 'border border-board';
  };

  const getRegionClass = (reg: number) => {
    return `region-${reg % 10}`;
  };

  const completedRegions = new Set<number>();
  const remainingCellsByRegion = new Map<number, number>();
  grid.forEach((row, r) => {
    row.forEach((state, c) => {
      const region = puzzle.regionMap[r]?.[c] ?? 0;
      if (state === 'cat') {
        completedRegions.add(region);
      } else if (state === 'blank') {
        remainingCellsByRegion.set(
          region,
          (remainingCellsByRegion.get(region) ?? 0) + 1,
        );
      }
    });
  });

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <div
        className="w-full aspect-square border-[4px] border-board rounded-2xl overflow-hidden touch-none shadow-xl bg-white grid"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${size}, minmax(0, 1fr))` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerGesture}
        onPointerCancel={finishPointerGesture}
      >
        {Array.from({ length: size }).map((_, r) =>
          Array.from({ length: size }).map((_, c) => {
            const isMistake = mistakeCell?.r === r && mistakeCell?.c === c;
            const isPrefilled = puzzle.prefilled[r] === c;
            const state = grid[r]?.[c] || 'blank';
            const reg = puzzle.regionMap[r]?.[c] ?? 0;

            return (
              <button
                key={`${r}-${c}`}
                data-cell-row={r}
                data-cell-column={c}
                onClick={() => handleCellTap(r, c)}
                type="button"
                aria-label={`Row ${r + 1}, column ${c + 1}${isPrefilled ? `, locked ${noun.singular}` : state === 'cat' ? `, ${noun.singular} placed` : state === 'note' ? ', marked unavailable' : ''}`}
                disabled={isPrefilled || isWon}
                className={`
                  relative flex items-center justify-center cursor-pointer select-none transition-colors duration-200
                  ${getBorders(r, c)}
                  ${getRegionClass(reg)}
                  ${isMistake ? 'animate-shakeX !bg-red-400' : ''}
                  ${isPrefilled ? 'opacity-90 cursor-default' : 'hover:brightness-95 active:brightness-90'}
                `}
              >
                {state === 'cat' && (
                  <CritterIcon
                    critter={critter}
                    className={`w-[70%] h-[70%] text-board drop-shadow-sm ${isWon ? 'animate-bounce' : 'animate-bounceIn'}`}
                    style={isWon ? { animationDelay: `${(r + c) * 0.1}s` } : {}}
                  />
                )}
                {state === 'note' && (
                  <CritterMarkIcon critter={critter} className="w-[40%] h-[40%] text-board opacity-25 animate-zoomIn" />
                )}

                {isPrefilled && (
                  <div className="absolute top-1 right-1 opacity-20">
                    <Lock size={10} className="text-board" />
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      <div className="mt-4 px-1" aria-label={`${size - completedRegions.size} colors left`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-board/55">Colors left</span>
          <span className="text-xs font-black text-board/55">{size - completedRegions.size}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: size }).map((_, region) => {
            const isComplete = completedRegions.has(region);
            const remainingCells = remainingCellsByRegion.get(region) ?? 0;
            return (
              <div
                key={region}
                className={`relative flex items-center gap-1.5 rounded-full border border-board/10 bg-white/70 px-2 py-1 transition-opacity ${isComplete ? 'opacity-45' : ''}`}
                title={
                  isComplete
                    ? 'Color complete'
                    : `${remainingCells} possible ${remainingCells === 1 ? 'square' : 'squares'} remaining`
                }
              >
                <span className={`h-3 w-3 rounded-full region-${region}`} />
                <span className={`text-[11px] font-black text-board/70 ${isComplete ? 'line-through' : ''}`}>
                  {isComplete ? '×' : remainingCells}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
