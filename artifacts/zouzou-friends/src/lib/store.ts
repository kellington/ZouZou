import { useCallback, useState } from 'react';
import { getEdmontonDateKey } from './puzzle';
import { normalizeCritter, type Critter } from './critters';

export type ModeStats = {
  played: number;
  solved: number;
  // Sum of seconds over solved games only, for computing averages.
  solvedSeconds: number;
};

type StandardDifficulty = 'easy' | 'medium' | 'hard';

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
  stats: Record<StandardDifficulty, ModeStats>;
  maxDailyStreak: number;
  // Tries at today's daily puzzle (a try starts on its first move). Reset when
  // dailyAttemptsDate isn't today. Honour system: it lives in this cookie only.
  dailyAttempts: number;
  dailyAttemptsDate: string | null;
  // Tries today's daily win took (0 = won before tries were tracked). Reset
  // with dailyAttempts when the date rolls.
  dailyWinAttempts: number;
};

const cookieName = 'zouzou-player';
const cookieLifetimeSeconds = 60 * 60 * 24 * 400;

const DEFAULT_MODE_STATS: ModeStats = { played: 0, solved: 0, solvedSeconds: 0 };

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
  stats: {
    easy: { ...DEFAULT_MODE_STATS },
    medium: { ...DEFAULT_MODE_STATS },
    hard: { ...DEFAULT_MODE_STATS },
  },
  maxDailyStreak: 0,
  dailyAttempts: 0,
  dailyAttemptsDate: null,
  dailyWinAttempts: 0,
};

function coerceFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

// Stats counters and streaks are never negative or fractional; clamp on the
// way in so a garbled/hand-edited cookie can't produce e.g. -3 played games.
function coerceNonNegativeInt(value: unknown, fallback: number): number {
  return Math.max(0, Math.floor(coerceFiniteNumber(value, fallback)));
}

function normalizeModeStats(stats: Partial<ModeStats> | undefined | null): ModeStats {
  return {
    played: coerceNonNegativeInt(stats?.played, 0),
    solved: coerceNonNegativeInt(stats?.solved, 0),
    solvedSeconds: coerceNonNegativeInt(stats?.solvedSeconds, 0),
  };
}

// Older cookies predate `stats` entirely, or may only have some modes. Merge
// defaults per-mode (not just at the top level) so a partial/garbled object
// doesn't crash a consumer doing arithmetic on it.
function normalizeStats(
  stats: Partial<Record<StandardDifficulty, Partial<ModeStats>>> | undefined | null,
): GameStore['stats'] {
  return {
    easy: normalizeModeStats(stats?.easy),
    medium: normalizeModeStats(stats?.medium),
    hard: normalizeModeStats(stats?.hard),
  };
}

// Shared merge used by both loadStore and getSharedStore so cookie hydration
// (defaulting, critter/stats/streak coercion) only happens in one place.
function hydrateStore(stored: Partial<GameStore> | null | undefined): GameStore {
  const source = stored ?? {};
  const coercedDailyStreak = coerceNonNegativeInt(source.dailyStreak, 0);
  const coercedMaxDailyStreak = coerceNonNegativeInt(source.maxDailyStreak, 0);
  return {
    ...DEFAULT_STORE,
    ...source,
    critter: normalizeCritter(source.critter),
    stats: normalizeStats(source.stats),
    // A legacy cookie may carry a live dailyStreak with no maxDailyStreak yet
    // (the field is new): never report a max lower than the current streak.
    maxDailyStreak: Math.max(coercedMaxDailyStreak, coercedDailyStreak),
    dailyAttempts: coerceNonNegativeInt(source.dailyAttempts, 0),
    dailyWinAttempts: coerceNonNegativeInt(source.dailyWinAttempts, 0),
  };
}

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

  if (next.dailyAttemptsDate !== today) {
    next.dailyAttempts = 0;
    next.dailyWinAttempts = 0;
    next.dailyAttemptsDate = today;
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
    const next = normalizeForToday(hydrateStore(stored));
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
    sharedStore = normalizeForToday(hydrateStore(fromCookie));
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

  const recordGameResult = useCallback(
    (difficulty: StandardDifficulty, outcome: 'solved' | 'lost', seconds: number) => {
      const previous = getSharedStore();
      const modeStats = previous.stats[difficulty];
      const nextModeStats: ModeStats = {
        played: modeStats.played + 1,
        solved: outcome === 'solved' ? modeStats.solved + 1 : modeStats.solved,
        solvedSeconds:
          outcome === 'solved'
            ? modeStats.solvedSeconds + Math.max(1, Math.floor(seconds))
            : modeStats.solvedSeconds,
      };
      const next: GameStore = {
        ...previous,
        stats: { ...previous.stats, [difficulty]: nextModeStats },
      };
      writeCookie(next);
      sharedStore = next;
      setStore(next);
    },
    [],
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
        maxDailyStreak: Math.max(previous.maxDailyStreak, dailyStreak),
      };
      writeCookie(next);
      sharedStore = next;
      return next;
    });
  }, []);

  // Counts a new try at today's daily puzzle and returns its number (1 = first try).
  // Once today's daily is won (e.g. in another tab) the count is frozen.
  const startDailyAttempt = useCallback((): number => {
    const previous = getSharedStore();
    if (previous.lastDailyDate === getEdmontonDateKey() && previous.daily !== null) {
      return previous.dailyAttempts;
    }
    const next: GameStore = {
      ...previous,
      dailyAttempts: previous.dailyAttempts + 1,
      dailyAttemptsDate: getEdmontonDateKey(),
    };
    writeCookie(next);
    sharedStore = next;
    setStore(next);
    return next.dailyAttempts;
  }, []);

  // Records the tries today's daily win took and returns it. Uses every try
  // started today (any tab), not just this game's number, so exploring in a
  // second tab and winning in the first still counts both tries.
  const recordDailyWinAttempts = useCallback((tryNumber: number): number => {
    const previous = getSharedStore();
    const attempts = Math.max(1, tryNumber, previous.dailyAttempts);
    const next: GameStore = { ...previous, dailyWinAttempts: attempts };
    writeCookie(next);
    sharedStore = next;
    setStore(next);
    return attempts;
  }, []);

  // No-op once today's daily is won (e.g. in another tab): judged from the
  // cookie at call time, so a stale tab can't wipe a streak earned today.
  const resetStreak = useCallback(() => {
    const previous = getSharedStore();
    if (previous.lastDailyDate === getEdmontonDateKey() && previous.daily !== null) return;
    updateStore({ dailyStreak: 0, lastPlayedDate: null });
  }, [updateStore]);

  return {
    store,
    saveBestTime,
    setPlayerName,
    setCritter,
    recordGameResult,
    recordDailyWin,
    startDailyAttempt,
    recordDailyWinAttempts,
    resetStreak,
  };
}