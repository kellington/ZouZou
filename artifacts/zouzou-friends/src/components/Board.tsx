import { CellPos, Puzzle } from '../lib/puzzle';
import { CatIcon, PawIcon } from './Icons';
import { Lock } from 'lucide-react';

export type CellState = 'blank' | 'note' | 'cat';

interface BoardProps {
  puzzle: Puzzle;
  grid: CellState[][];
  mistakeCell: CellPos | null;
  onCellClick: (r: number, c: number) => void;
  isWon?: boolean;
}

export function Board({ puzzle, grid, mistakeCell, onCellClick, isWon }: BoardProps) {
  const getBorders = (r: number, c: number) => {
    const reg = puzzle.regionMap[r][c];
    const t = r === 0 || puzzle.regionMap[r - 1][c] !== reg;
    const b = r === 5 || puzzle.regionMap[r + 1][c] !== reg;
    const l = c === 0 || puzzle.regionMap[r][c - 1] !== reg;
    const ri = c === 5 || puzzle.regionMap[r][c + 1] !== reg;
    return `${t ? 'border-t-[3px]' : 'border-t border-t-black/5'} ${b ? 'border-b-[3px]' : 'border-b border-b-black/5'} ${l ? 'border-l-[3px]' : 'border-l border-l-black/5'} ${ri ? 'border-r-[3px]' : 'border-r border-r-black/5'} border-board`;
  };

  return (
    <div className="grid grid-cols-6 grid-rows-6 w-full max-w-[400px] aspect-square mx-auto border-[4px] border-board rounded-2xl overflow-hidden touch-manipulation shadow-xl bg-white">
      {puzzle.regionMap.map((row, r) =>
        row.map((reg, c) => {
          const isMistake = mistakeCell?.r === r && mistakeCell?.c === c;
          const isPrefilled = puzzle.prefilled[r] === c;
          const state = grid[r][c];

          return (
            <button
              key={`${r}-${c}`}
              onClick={() => onCellClick(r, c)}
              type="button"
              aria-label={`Row ${r + 1}, column ${c + 1}${isPrefilled ? ', locked cat' : state === 'cat' ? ', cat placed' : state === 'note' ? ', marked unavailable' : ''}`}
              disabled={isPrefilled || isWon}
              className={`
                relative flex items-center justify-center cursor-pointer select-none transition-colors duration-200
                ${getBorders(r, c)}
                region-${reg}
                ${isMistake ? 'animate-shakeX bg-red-400!' : ''}
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
