import { useCallback, useState } from 'react';
import { getEdmontonDateKey } from './puzzle';
import { normalizeCritter, type Critter } from './critters';

type GameStore = {
  easy: number | null;
  medium: number | null;
  hard: number | null;
  daily: number | null;
  lastDailyDate: string | null;
  playerName: string;
  dailyStreak: number;
  lastPlayedDate: string | null;
  critter: Critter;
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
  critter: 'cat',
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

// Clears yesterday's daily result and a stale streak once the Edmonton date
// has rolled over. Pulled out of loadStore so getSharedStore can re-apply it
// on every read (a tab left open across midnight needs this re-run, not just
// the very first load of the page).
function normalizeForToday(store: GameStore): GameStore {
  const today = getEdmontonDateKey();
  const yesterday = yesterdayEdmontonDateKey();
  const next: GameStore = { ...store };

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

  return next;
}

function loadStore(): GameStore {
  try {
    const stored = readCookie() ?? readLegacyStore() ?? {};
    const next = normalizeForToday({
      ...DEFAULT_STORE,
      ...stored,
      critter: normalizeCritter(stored.critter),
    });
    writeCookie(next);
    return next;
  } catch (error) {
    console.warn('Unable to read local game preferences', error);
    return DEFAULT_STORE;
  }
}

// Shared in memory across every `useStore()` consumer for the life of the
// page, so a value set on one screen (Menu) is visible to the next screen
// that mounts (Game) within the same SPA session even if the cookie write
// silently failed (e.g. Safari "Block All Cookies").
//
// The cookie is the cross-tab source of truth whenever it's readable: another
// tab may have written a newer value (a win, a name change, a critter pick),
// so every read re-parses the cookie and re-normalizes it for today, rather
// than trusting a cached in-memory copy that could be from yesterday or from
// before another tab's write. Memory (`sharedStore`) is only the fallback for
// the cookies-blocked case — and even then it's re-normalized on every read,
// so a blocked-cookies tab still rolls over at midnight.
let sharedStore: GameStore | null = null;

function getSharedStore(): GameStore {
  let fromCookie: Partial<GameStore> | null = null;
  try {
    fromCookie = readCookie();
  } catch {
    fromCookie = null;
  }

  if (fromCookie) {
    sharedStore = normalizeForToday({
      ...DEFAULT_STORE,
      ...fromCookie,
      critter: normalizeCritter(fromCookie.critter),
    });
    try {
      writeCookie(sharedStore);
    } catch {
      // Cookie write blocked; sharedStore still reflects the freshly-read cookie in memory.
    }
  } else {
    sharedStore = sharedStore === null ? loadStore() : normalizeForToday(sharedStore);
  }

  return sharedStore;
}

// Test-only escape hatch so a test can simulate a fresh page load (a new
// `sharedStore`) without actually reloading the module. Not used by app code.
export function __resetSharedStoreForTests(): void {
  sharedStore = null;
}

export function useStore() {
  const [store, setStore] = useState<GameStore>(getSharedStore);

  const updateStore = useCallback((updates: Partial<GameStore>) => {
    setStore(() => {
      const next = { ...getSharedStore(), ...updates };
      writeCookie(next);
      sharedStore = next;
      return next;
    });
  }, []);

  const saveBestTime = useCallback(
    (mode: 'easy' | 'medium' | 'hard' | 'daily', time: number) => {
      setStore(() => {
        const previous = getSharedStore();
        const currentBest = previous[mode];
        const isNewBest =
          currentBest === null || time < currentBest;
        if (mode !== 'daily' && !isNewBest) return previous;

        const next = isNewBest
          ? { ...previous, [mode]: time }
          : { ...previous };
        if (mode === 'daily') {
          next.lastDailyDate = getEdmontonDateKey();
        }
        writeCookie(next);
        sharedStore = next;
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

  const setCritter = useCallback(
    (critter: Critter) => {
      updateStore({ critter: normalizeCritter(critter) });
    },
    [updateStore],
  );

  const recordDailyWin = useCallback(() => {
    const today = getEdmontonDateKey();
    const yesterday = yesterdayEdmontonDateKey();

    setStore(() => {
      const previous = getSharedStore();
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
      sharedStore = next;
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
    setCritter,
    recordDailyWin,
    resetStreak,
  };
}