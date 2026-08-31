import { CellPos, Puzzle } from '../lib/puzzle';
import { CatIcon, PawIcon } from './Icons';
import { Lock } from 'lucide-react';
import { useEffect, useRef } from 'react';

export type CellState = 'blank' | 'note' | 'cat';

interface BoardProps {
  puzzle: Puzzle;
  grid: CellState[][];
  mistakeCell: CellPos | null;
  onCellClick: (r: number, c: number) => void;
  onCellDoubleClick: (r: number, c: number) => void;
  isWon?: boolean;
}

export function Board({
  puzzle,
  grid,
  mistakeCell,
  onCellClick,
  onCellDoubleClick,
  isWon,
}: BoardProps) {
  const size = puzzle.size || 6;
  const pendingTaps = useRef(new Map<string, number>());

  useEffect(() => {
    return () => {
      for (const timer of pendingTaps.current.values()) {
        window.clearTimeout(timer);
      }
      pendingTaps.current.clear();
    };
  }, []);

  const handleCellTap = (r: number, c: number) => {
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
  
  const getBorders = (r: number, c: number) => {
    const reg = puzzle.regionMap[r]?.[c] ?? 0;
    const t = r === 0 || puzzle.regionMap[r - 1]?.[c] !== reg;
    const b = r === size - 1 || puzzle.regionMap[r + 1]?.[c] !== reg;
    const l = c === 0 || puzzle.regionMap[r]?.[c - 1] !== reg;
    const ri = c === size - 1 || puzzle.regionMap[r]?.[c + 1] !== reg;
    return `${t ? 'border-t-[3px]' : 'border-t border-t-black/5'} ${b ? 'border-b-[3px]' : 'border-b border-b-black/5'} ${l ? 'border-l-[3px]' : 'border-l border-l-black/5'} ${ri ? 'border-r-[3px]' : 'border-r border-r-black/5'} border-board`;
  };

  const getRegionClass = (reg: number) => {
    return `region-${reg % 10}`;
  };

  return (
    <div 
      className="w-full max-w-[400px] aspect-square mx-auto border-[4px] border-board rounded-2xl overflow-hidden touch-manipulation shadow-xl bg-white grid"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${size}, minmax(0, 1fr))` }}
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
              onClick={() => handleCellTap(r, c)}
              type="button"
              aria-label={`Row ${r + 1}, column ${c + 1}${isPrefilled ? ', locked cat' : state === 'cat' ? ', cat placed' : state === 'note' ? ', marked unavailable' : ''}`}
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
                <CatIcon 
                  className={`w-[70%] h-[70%] text-board drop-shadow-sm ${isWon ? 'animate-bounce' : 'animate-bounceIn'}`} 
                  style={isWon ? { animationDelay: `${(r + c) * 0.1}s` } : {}}
                />
              )}
              {state === 'note' && (
                <PawIcon className="w-[40%] h-[40%] text-board opacity-25 animate-zoomIn" />
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
  );
}
