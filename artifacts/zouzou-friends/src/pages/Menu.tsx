import { useLocation } from 'wouter';
import { CatIcon } from '../components/Icons';
import { ActionButton } from '../components/ui';
import { useBestTimes } from '../lib/store';
import { formatTime } from '../lib/puzzle';
import { Star, Zap, Coffee, Skull } from 'lucide-react';

export function Menu() {
  const [, setLocation] = useLocation();
  const { bestTimes } = useBestTimes();

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
        <p className="text-xl font-bold text-board/60 mb-10">& Friends</p>

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
            {bestTimes.daily !== null && (
              <span className="text-sm font-bold text-board/50 mt-2">
                Today's Best: {formatTime(bestTimes.daily)}
              </span>
            )}
          </div>

          <div className="h-4"></div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-col">
              <ActionButton 
                variant="primary" 
                onClick={() => setLocation('/play/easy')}
                className="w-full"
              >
                <Coffee className="w-5 h-5" />
                Easy Mode
              </ActionButton>
              {bestTimes.easy !== null && (
                <span className="text-xs font-bold text-board/50 mt-1 text-center">Best: {formatTime(bestTimes.easy)}</span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <ActionButton 
                variant="board" 
                onClick={() => setLocation('/play/normal')}
                className="w-full bg-white"
              >
                <Zap className="w-5 h-5 fill-current" />
                Normal Mode
              </ActionButton>
              {bestTimes.normal !== null && (
                <span className="text-xs font-bold text-board/50 mt-1 text-center">Best: {formatTime(bestTimes.normal)}</span>
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
              {bestTimes.hard !== null && (
                <span className="text-xs font-bold text-board/50 mt-1 text-center">Best: {formatTime(bestTimes.hard)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
