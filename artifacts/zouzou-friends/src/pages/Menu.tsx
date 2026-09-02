import { useLocation } from 'wouter';
import { CatIcon } from '../components/Icons';
import { ActionButton } from '../components/ui';
import { useStore } from '../lib/store';
import { formatTime, getDailyDifficulty } from '../lib/puzzle';
import { Star, Zap, Coffee, Skull, Edit2, Flame } from 'lucide-react';
import { DailyLeaderboard } from '../components/DailyLeaderboard';
import { RecentPlayers } from '../components/RecentPlayers';
import { useState } from 'react';

export function Menu() {
  const [, setLocation] = useLocation();
  const { store, setPlayerName } = useStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const dailyDifficulty = getDailyDifficulty();

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-[hsl(var(--background))]">
      <div className="w-full max-w-md mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CatIcon className="w-24 h-24 text-board animate-bounce duration-[2000ms]" />
            <div className="absolute -bottom-2 w-16 h-2 bg-black/10 rounded-[100%] mx-auto left-0 right-0 animate-pulse"></div>
          </div>
        </div>

        <h1 className="text-5xl font-black text-board mb-2 tracking-tight">ZouZou</h1>
        <p className="text-xl font-bold text-board/60 mb-6">& Friends</p>

        <div className="flex flex-col items-center mb-6 h-16 justify-center">
          {(store.playerName && !isEditingName) ? (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-board">Hi, {store.playerName}!</span>
                <button onClick={() => setIsEditingName(true)} className="p-1 hover:bg-black/5 rounded-full text-board/50 hover:text-board transition-colors" aria-label="Edit name">
                  <Edit2 size={16} />
                </button>
              </div>
              {store.dailyStreak > 0 && (
                <div className="flex items-center gap-1 text-[#D97736] font-bold text-sm bg-[#D97736]/10 px-3 py-1 rounded-full">
                  <Flame size={16} className="fill-current" /> {store.dailyStreak} Day Streak
                </div>
              )}
            </div>
          ) : (
            <input 
              type="text" 
              placeholder="Enter your name" 
              maxLength={24}
              autoFocus={isEditingName}
              className="px-4 py-2 rounded-full border-2 border-board bg-white font-bold text-center text-board outline-none focus:ring-2 focus:ring-[#D97736] w-48"
              onBlur={(e) => {
                const val = e.target.value.trim();
                if (val) setPlayerName(val);
                setIsEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = e.currentTarget.value.trim();
                  if (val) setPlayerName(val);
                  setIsEditingName(false);
                }
              }}
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center relative">
            <ActionButton 
              variant="secondary" 
              className="w-full text-lg shadow-[0_6px_0_0_#7BA898] active:translate-y-[6px]"
              onClick={() => setLocation('/play/daily')}
            >
              <Star className="w-5 h-5 fill-current" />
              Daily Challenge
            </ActionButton>
            <span className="text-xs font-black uppercase tracking-wider text-board/45 mt-2">
              Today: {dailyDifficulty} board
            </span>
            {store.daily !== null && (
              <span className="text-sm font-bold text-board/50 mt-2">
                Today's Best: {formatTime(store.daily)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 mt-4">
            <div className="flex flex-col">
              <ActionButton 
                variant="primary" 
                onClick={() => setLocation('/play/easy')}
                className="w-full"
              >
                <Coffee className="w-5 h-5" />
                Easy Mode
              </ActionButton>
              {store.easy !== null && (
                <span className="text-xs font-bold text-board/50 mt-1 text-center">Best: {formatTime(store.easy)}</span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <ActionButton 
                variant="board" 
                onClick={() => setLocation('/play/medium')}
                className="w-full bg-white"
              >
                <Zap className="w-5 h-5 fill-current" />
                Medium Mode
              </ActionButton>
              {store.medium !== null && (
                <span className="text-xs font-bold text-board/50 mt-1 text-center">Best: {formatTime(store.medium)}</span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <ActionButton 
                variant="danger" 
                onClick={() => setLocation('/play/hard')}
                className="w-full"
              >
                <Skull className="w-5 h-5" />
                Hard Mode
              </ActionButton>
              {store.hard !== null && (
                <span className="text-xs font-bold text-board/50 mt-1 text-center">Best: {formatTime(store.hard)}</span>
              )}
            </div>
          </div>

          <div className="mt-8">
            <DailyLeaderboard />
          </div>
          <div className="mt-4">
            <RecentPlayers />
          </div>
        </div>
      </div>
    </div>
  );
}
