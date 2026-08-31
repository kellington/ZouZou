import { useState, useEffect } from 'react';

type BestTimes = {
  easy: number | null;
  normal: number | null;
  hard: number | null;
  daily: number | null;
  lastDailyDate: string | null;
};

const DEFAULT_TIMES: BestTimes = {
  easy: null,
  normal: null,
  hard: null,
  daily: null,
  lastDailyDate: null,
};

export function useBestTimes() {
  const [bestTimes, setBestTimes] = useState<BestTimes>(() => {
    try {
      const item = window.localStorage.getItem('zouzou-best-times');
      if (item) {
        const parsed = JSON.parse(item);
        // Reset daily best if it's a new day
        const today = new Date().toISOString().slice(0, 10);
        if (parsed.lastDailyDate !== today) {
          parsed.daily = null;
          parsed.lastDailyDate = today;
          window.localStorage.setItem('zouzou-best-times', JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (error) {
      console.warn('Error reading localStorage', error);
    }
    return DEFAULT_TIMES;
  });

  const saveBestTime = (mode: keyof Omit<BestTimes, 'lastDailyDate'>, time: number) => {
    setBestTimes((prev) => {
      const currentBest = prev[mode];
      if (currentBest === null || time < currentBest) {
        const next = { ...prev, [mode]: time };
        if (mode === 'daily') {
          next.lastDailyDate = new Date().toISOString().slice(0, 10);
        }
        try {
          window.localStorage.setItem('zouzou-best-times', JSON.stringify(next));
        } catch (e) {
          // ignore
        }
        return next;
      }
      return prev;
    });
  };

  return { bestTimes, saveBestTime };
}
