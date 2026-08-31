import { useCallback, useState } from 'react';
import { getEdmontonDateKey } from './puzzle';

type GameStore = {
  easy: number | null;
  medium: number | null;
  hard: number | null;
  daily: number | null;
  lastDailyDate: string | null;
  playerName: string;
  dailyStreak: number;
  lastPlayedDate: string | null;
};

const cookieName = 'zouzou-player';
const cookieLifetimeSeconds = 60 * 60 * 24 * 400;

const DEFAULT_STORE: GameStore = {
  easy: null,
  medium: null,
  hard: null,
  daily: null,
  lastDailyDate: null,
  playerName: '',
  dailyStreak: 0,
  lastPlayedDate: null,
};

function yesterdayEdmontonDateKey(): string {
  return getEdmontonDateKey(new Date(Date.now() - 86_400_000));
}

function readCookie(): Partial<GameStore> | null {
  const prefix = `${cookieName}=`;
  const value = document.cookie
    .split('; ')
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);

  if (!value) return null;
  return JSON.parse(decodeURIComponent(value)) as Partial<GameStore>;
}

function writeCookie(store: GameStore): void {
  document.cookie = `${cookieName}=${encodeURIComponent(
    JSON.stringify(store),
  )}; Max-Age=${cookieLifetimeSeconds}; Path=/; SameSite=Lax`;
}

function readLegacyStore(): Partial<GameStore> | null {
  for (const key of ['zouzou-store', 'zouzou-best-times']) {
    const item = window.localStorage.getItem(key);
    if (!item) continue;

    const parsed = JSON.parse(item) as Partial<GameStore> & {
      normal?: number | null;
    };

    if (parsed.normal !== undefined && parsed.medium === undefined) {
      parsed.medium = parsed.normal;
    }

    return parsed;
  }

  return null;
}

function loadStore(): GameStore {
  try {
    const stored = readCookie() ?? readLegacyStore() ?? {};
    const today = getEdmontonDateKey();
    const yesterday = yesterdayEdmontonDateKey();
    const next: GameStore = { ...DEFAULT_STORE, ...stored };

    if (next.lastDailyDate !== today) {
      next.daily = null;
    }

    if (
      next.dailyStreak > 0 &&
      next.lastPlayedDate !== today &&
      next.lastPlayedDate !== yesterday
    ) {
      next.dailyStreak = 0;
    }

    writeCookie(next);
    return next;
  } catch (error) {
    console.warn('Unable to read local game preferences', error);
    return DEFAULT_STORE;
  }
}

export function useStore() {
  const [store, setStore] = useState<GameStore>(loadStore);

  const updateStore = useCallback((updates: Partial<GameStore>) => {
    setStore((previous) => {
      const next = { ...previous, ...updates };
      writeCookie(next);
      return next;
    });
  }, []);

  const saveBestTime = useCallback(
    (mode: 'easy' | 'medium' | 'hard' | 'daily', time: number) => {
      setStore((previous) => {
        const currentBest = previous[mode];
        if (currentBest !== null && time >= currentBest) return previous;

        const next = { ...previous, [mode]: time };
        if (mode === 'daily') {
          next.lastDailyDate = getEdmontonDateKey();
        }
        writeCookie(next);
        return next;
      });
    },
    [],
  );

  const setPlayerName = useCallback(
    (name: string) => {
      updateStore({ playerName: name.trim().replace(/\s+/g, ' ') });
    },
    [updateStore],
  );

  const recordDailyWin = useCallback(() => {
    const today = getEdmontonDateKey();
    const yesterday = yesterdayEdmontonDateKey();

    setStore((previous) => {
      if (previous.lastPlayedDate === today) return previous;

      const dailyStreak =
        previous.lastPlayedDate === yesterday
          ? previous.dailyStreak + 1
          : 1;
      const next = {
        ...previous,
        dailyStreak,
        lastPlayedDate: today,
      };
      writeCookie(next);
      return next;
    });
  }, []);

  const resetStreak = useCallback(() => {
    updateStore({ dailyStreak: 0, lastPlayedDate: null });
  }, [updateStore]);

  return {
    store,
    saveBestTime,
    setPlayerName,
    recordDailyWin,
    resetStreak,
  };
}