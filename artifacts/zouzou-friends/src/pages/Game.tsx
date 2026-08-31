import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useLocation } from 'wouter';
import { Board, CellState } from '../components/Board';
import { generatePuzzle, getDailySeed, formatTime, Puzzle, CellPos } from '../lib/puzzle';
import { HeartIcon, PawIcon, CatIcon } from '../components/Icons';
import { ActionButton, Modal } from '../components/ui';
import { useBestTimes } from '../lib/store';
import { ArrowLeft, HelpCircle, RotateCcw } from 'lucide-react';

type GameMode = 'easy' | 'normal' | 'hard' | 'daily';

const MODE_CONFIG = {
  easy: { lives: 5, prefill: 1, title: 'Easy' },
  normal: { lives: 3, prefill: 0, title: 'Normal' },
  hard: { lives: 1, prefill: 0, title: 'Hard' },
  daily: { lives: 3, prefill: 0, title: 'Daily Challenge' },
};

function randomSeed() {
  return Math.floor(Math.random() * 0xffffffff);
}

export function Game() {
  const { mode = 'normal' } = useParams<{ mode: string }>();
  const [, setLocation] = useLocation();
  const safeMode = (mode in MODE_CONFIG ? mode : 'normal') as GameMode;
  const config = MODE_CONFIG[safeMode];
  const { saveBestTime } = useBestTimes();

  // Generate puzzle (stable unless remounted or key changes)
  const [puzzleSeed, setPuzzleSeed] = useState(() =>
    safeMode === 'daily' ? getDailySeed() : randomSeed(),
  );

  const puzzle = useMemo(
    () => generatePuzzle(puzzleSeed, config.prefill),
    [puzzleSeed, config.prefill],
  );

  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [lives, setLives] = useState(config.lives);
  const [seconds, setSeconds] = useState(0);
  const [mistakeCell, setMistakeCell] = useState<CellPos | null>(null);
  const [showRules, setShowRules] = useState(false);

  const initGrid = useCallback(() => {
    const g: CellState[][] = Array(6).fill(null).map(() => Array(6).fill('blank'));
    puzzle.prefilled.forEach((c, r) => {
      if (c !== null) g[r][c] = 'cat';
    });
    return g;
  }, [puzzle]);

  const [grid, setGrid] = useState<CellState[][]>(initGrid);

  // Wouter keeps the same route component mounted when only :mode changes.
  // Give each mode a fresh puzzle and reset all round state in that case.
  useEffect(() => {
    setPuzzleSeed(safeMode === 'daily' ? getDailySeed() : randomSeed());
  }, [safeMode]);

  useEffect(() => {
    setGrid(initGrid());
    setLives(config.lives);
    setGameState('playing');
    setSeconds(0);
    setMistakeCell(null);
  }, [puzzle, config.lives, initGrid]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Restart identical puzzle
  const handleRestart = () => {
    setGrid(initGrid());
    setLives(config.lives);
    setGameState('playing');
    setSeconds(0);
    setMistakeCell(null);
  };

  // Generate completely new puzzle
  const handleNewPuzzle = () => {
    if (safeMode === 'daily') {
      handleRestart(); // Daily doesn't get new puzzle, just retry
    } else {
      setPuzzleSeed(randomSeed());
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameState !== 'playing') return;
    if (puzzle.prefilled[r] === c) return;

    const current = grid[r][c];
    let next: CellState = 'blank';
    if (current === 'blank') next = 'note';
    else if (current === 'note') next = 'cat';
    else next = 'blank';

    if (next === 'cat') {
      if (puzzle.solution[r] !== c) {
        // Wrong!
        const newLives = lives - 1;
        setLives(newLives);
        setMistakeCell({ r, c });
        setTimeout(() => setMistakeCell(null), 600);
        
        const newGrid = [...grid];
        newGrid[r] = [...grid[r]];
        newGrid[r][c] = 'note';
        setGrid(newGrid);

        if (newLives <= 0) {
          setGameState('lost');
        }
        return;
      }
    }

    const newGrid = [...grid];
    newGrid[r] = [...grid[r]];
    newGrid[r][c] = next;
    setGrid(newGrid);

    // Check Win
    let catsCount = 0;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (newGrid[i][j] === 'cat') catsCount++;
      }
    }
    if (catsCount === 6) {
      setGameState('won');
      saveBestTime(safeMode, seconds);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col p-4 sm:p-6 max-w-md mx-auto w-full relative">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 text-board">
        <button onClick={() => setLocation('/')} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-xl font-black">{config.title}</h1>
        <button onClick={() => setShowRules(true)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <HelpCircle size={28} />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="flex items-center gap-1 text-board">
          {Array.from({ length: config.lives }).map((_, i) => (
            <HeartIcon 
              key={i} 
              className={`w-6 h-6 ${i < lives ? 'text-[#D6453A]' : 'text-board/20'} transition-colors duration-300`} 
              filled={i < lives} 
            />
          ))}
        </div>
        <div className="text-2xl font-black font-mono text-board bg-white px-4 py-1 rounded-full border-2 border-board shadow-[0_3px_0_0_var(--board)]">
          {formatTime(seconds)}
        </div>
      </div>

      {/* Main Board */}
      <div className="flex-1 flex flex-col justify-center mb-8">
        <Board 
          puzzle={puzzle} 
          grid={grid} 
          mistakeCell={mistakeCell} 
          onCellClick={handleCellClick} 
          isWon={gameState === 'won'}
        />
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-center mb-4">
        <ActionButton variant="board" onClick={handleRestart} className="px-8 bg-white" disabled={gameState !== 'playing'}>
          <RotateCcw size={20} /> Reset Board
        </ActionButton>
      </div>

      {/* Modals */}
      <Modal isOpen={showRules} onClose={() => setShowRules(false)} title="How to Play">
        <ul className="space-y-5 text-left text-base">
          <li className="flex gap-4 items-start">
            <CatIcon className="w-8 h-8 shrink-0 mt-1" /> 
            <span>Place exactly one cat in every <strong>row</strong>, <strong>column</strong>, and <strong>colored region</strong>.</span>
          </li>
          <li className="flex gap-4 items-start">
            <div className="w-8 h-8 border-2 border-dashed border-board rounded-lg shrink-0 flex items-center justify-center text-xl font-black mt-1">!</div> 
            <span>Cats cannot touch each other—<strong>not even diagonally!</strong></span>
          </li>
          <li className="flex gap-4 items-start">
            <PawIcon className="w-8 h-8 shrink-0 opacity-50 mt-1" /> 
            <span>Tap once to place a note (paw print). Tap again to place a cat!</span>
          </li>
        </ul>
        <ActionButton className="w-full mt-8" onClick={() => setShowRules(false)}>Got it!</ActionButton>
      </Modal>

      <Modal isOpen={gameState === 'won'} onClose={() => setLocation('/')} title="Purrfect!">
        <div className="flex justify-center mb-6">
          <CatIcon className="w-20 h-20 text-board animate-bounce" />
        </div>
        <p className="text-xl mb-2">You solved it in</p>
        <p className="text-4xl font-black font-mono mb-8">{formatTime(seconds)}</p>
        
        <div className="space-y-3">
          {safeMode !== 'daily' && (
             <ActionButton className="w-full" onClick={handleNewPuzzle}>Next Puzzle</ActionButton>
          )}
          <ActionButton variant="secondary" className="w-full" onClick={() => setLocation('/')}>Back to Menu</ActionButton>
        </div>
      </Modal>

      <Modal isOpen={gameState === 'lost'} onClose={() => setLocation('/')} title="Oh No!">
        <p className="text-lg mb-8">You ran out of lives.</p>
        <div className="space-y-3">
          <ActionButton className="w-full" onClick={handleRestart}>Try Again</ActionButton>
          <ActionButton variant="ghost" className="w-full" onClick={() => setLocation('/')}>Back to Menu</ActionButton>
        </div>
      </Modal>

    </div>
  );
}
