import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useLocation } from 'wouter';
import { Board, CellState } from '../components/Board';
import {
  generatePuzzle,
  getDailyDifficulty,
  getDailySeed,
  formatTime,
  type PuzzleSize,
  type CellPos,
} from '../lib/puzzle';
import { HeartIcon, PawIcon, CatIcon } from '../components/Icons';
import { ActionButton, Modal } from '../components/ui';
import { useStore } from '../lib/store';
import { ArrowLeft, HelpCircle, RotateCcw, Flame } from 'lucide-react';
import { useSubmitDailyScore, getGetDailyLeaderboardQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { DailyLeaderboard } from '../components/DailyLeaderboard';

type GameMode = 'easy' | 'medium' | 'hard' | 'daily';

const STANDARD_MODE_CONFIG = {
  easy: { lives: 5, prefill: 1, title: 'Easy', size: 6 as PuzzleSize },
  medium: { lives: 4, prefill: 0, title: 'Medium', size: 8 as PuzzleSize },
  hard: { lives: 3, prefill: 0, title: 'Hard', size: 10 as PuzzleSize },
};

function randomSeed() {
  return Math.floor(Math.random() * 0xffffffff);
}

export function Game() {
  const { mode = 'medium' } = useParams<{ mode: string }>();
  const [, setLocation] = useLocation();
  const safeMode = (
    mode === 'daily' || mode in STANDARD_MODE_CONFIG ? mode : 'medium'
  ) as GameMode;
  const dailyDifficulty = getDailyDifficulty();
  const baseConfig =
    safeMode === 'daily'
      ? STANDARD_MODE_CONFIG[dailyDifficulty]
      : STANDARD_MODE_CONFIG[safeMode];
  const config = {
    ...baseConfig,
    title:
      safeMode === 'daily'
        ? `Daily · ${baseConfig.title}`
        : baseConfig.title,
  };
  const { store, saveBestTime, recordDailyWin, resetStreak, setPlayerName } = useStore();
  
  const queryClient = useQueryClient();
  const { mutate: submitScore, isPending: isSubmitting } = useSubmitDailyScore({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetDailyLeaderboardQueryKey() });
      }
    }
  });

  const [puzzleSeed, setPuzzleSeed] = useState(() =>
    safeMode === 'daily' ? getDailySeed() : randomSeed(),
  );

  const puzzle = useMemo(
    () => generatePuzzle(config.size, puzzleSeed, config.prefill),
    [config.size, puzzleSeed, config.prefill],
  );

  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [lives, setLives] = useState(config.lives);
  const [seconds, setSeconds] = useState(0);
  const [mistakeCell, setMistakeCell] = useState<CellPos | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [tempName, setTempName] = useState(store.playerName);

  const initGrid = useCallback(() => {
    const size = puzzle.size || 6;
    const g: CellState[][] = Array(size).fill(null).map(() => Array(size).fill('blank'));
    puzzle.prefilled.forEach((c, r) => {
      if (c !== null && r < size && c < size) g[r][c] = 'cat';
    });
    return g;
  }, [puzzle]);

  const [grid, setGrid] = useState<CellState[][]>(initGrid);

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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const handleRestart = () => {
    setGrid(initGrid());
    setLives(config.lives);
    setGameState('playing');
    setSeconds(0);
    setMistakeCell(null);
  };

  const handleNewPuzzle = () => {
    if (safeMode === 'daily') {
      handleRestart();
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
          if (safeMode === 'daily') {
            resetStreak();
          }
        }
        return;
      }
    }

    const newGrid = [...grid];
    newGrid[r] = [...grid[r]];
    newGrid[r][c] = next;
    setGrid(newGrid);

    let catsCount = 0;
    const size = puzzle.size || 6;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newGrid[i][j] === 'cat') catsCount++;
      }
    }
    
    if (catsCount === size) {
      const completedSeconds = Math.max(1, seconds);
      setGameState('won');
      saveBestTime(safeMode, completedSeconds);
      
      if (safeMode === 'daily') {
        recordDailyWin();
        if (store.playerName) {
          submitScore({
            data: { name: store.playerName, seconds: completedSeconds },
          });
        }
      }
    }
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
      submitScore({
        data: {
          name: tempName.trim(),
          seconds: Math.max(1, seconds),
        },
      });
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col p-4 sm:p-6 max-w-md mx-auto w-full relative">
      <div className="flex items-center justify-between mb-8 text-board">
        <button onClick={() => setLocation('/')} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <ArrowLeft size={28} />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-black">{config.title}</h1>
          {safeMode === 'daily' && store.dailyStreak > 0 && (
            <span className="text-xs font-bold text-[#D97736] flex items-center gap-1">
              <Flame size={12} className="fill-current" /> {store.dailyStreak} Streak
            </span>
          )}
        </div>
        <button onClick={() => setShowRules(true)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <HelpCircle size={28} />
        </button>
      </div>

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

      <div className="flex-1 flex flex-col justify-center mb-8">
        <Board 
          puzzle={puzzle} 
          grid={grid} 
          mistakeCell={mistakeCell} 
          onCellClick={handleCellClick} 
          isWon={gameState === 'won'}
        />
      </div>

      <div className="flex justify-center mb-4">
        <ActionButton variant="board" onClick={handleRestart} className="px-8 bg-white" disabled={gameState !== 'playing'}>
          <RotateCcw size={20} /> Reset Board
        </ActionButton>
      </div>

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
        <div className="flex justify-center mb-4">
          <CatIcon className="w-20 h-20 text-board animate-bounce" />
        </div>
        <p className="text-xl mb-1 text-center">You solved it in</p>
        <p className="text-4xl font-black font-mono mb-6 text-center">{formatTime(seconds)}</p>
        
        {safeMode === 'daily' && (
          <div className="mb-6 space-y-4">
            {!store.playerName ? (
              <div className="bg-board/5 p-4 rounded-xl border border-board/10">
                <p className="text-sm font-bold mb-3 text-center">Save your time to the leaderboard!</p>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={tempName} 
                    onChange={e => setTempName(e.target.value)}
                    maxLength={24}
                    className="flex-1 px-3 py-2 border-2 border-board rounded-lg font-bold text-board outline-none focus:ring-2 focus:ring-[#D97736]"
                    placeholder="Your name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameSubmit();
                    }}
                  />
                  <ActionButton 
                    onClick={handleNameSubmit} 
                    disabled={!tempName.trim() || isSubmitting}
                    className="px-4"
                  >
                    Submit
                  </ActionButton>
                </div>
              </div>
            ) : (
              <DailyLeaderboard />
            )}
          </div>
        )}
        
        <div className="space-y-3">
          {safeMode !== 'daily' && (
             <ActionButton className="w-full" onClick={handleNewPuzzle}>Next Puzzle</ActionButton>
          )}
          <ActionButton variant="secondary" className="w-full" onClick={() => setLocation('/')}>Back to Menu</ActionButton>
        </div>
      </Modal>

      <Modal isOpen={gameState === 'lost'} onClose={() => setLocation('/')} title="Oh No!">
        <div className="text-center">
          <p className="text-lg font-bold mb-2">You ran out of lives.</p>
          {safeMode === 'daily' && (
            <p className="text-sm text-red-500 font-bold mb-6">Your daily streak was reset.</p>
          )}
        </div>
        <div className="space-y-3 mt-6">
          <ActionButton className="w-full" onClick={handleRestart}>Try Again</ActionButton>
          <ActionButton variant="ghost" className="w-full" onClick={() => setLocation('/')}>Back to Menu</ActionButton>
        </div>
      </Modal>
    </div>
  );
}
