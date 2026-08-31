import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type DailyScore = {
  name: string;
  seconds: number;
};

type LeaderboardStore = {
  dates: Record<string, DailyScore[]>;
};

const dataDirectory = path.resolve(process.cwd(), "data");
const dataPath = path.join(dataDirectory, "daily-leaderboard.json");
const temporaryDataPath = path.join(dataDirectory, "daily-leaderboard.tmp.json");
const maximumEntries = 10;
const maximumStoredDays = 31;

let writeQueue: Promise<void> = Promise.resolve();

export function getUtcDateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

async function readStore(): Promise<LeaderboardStore> {
  try {
    const contents = await readFile(dataPath, "utf8");
    const parsed = JSON.parse(contents) as LeaderboardStore;

    if (!parsed.dates || typeof parsed.dates !== "object") {
      return { dates: {} };
    }

    return parsed;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return { dates: {} };
    }
    throw error;
  }
}

async function writeStore(store: LeaderboardStore): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(temporaryDataPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await rename(temporaryDataPath, dataPath);
}

function trimOldDates(store: LeaderboardStore): void {
  const retainedDates = Object.keys(store.dates)
    .sort()
    .slice(-maximumStoredDays);
  const retained = new Set(retainedDates);

  for (const date of Object.keys(store.dates)) {
    if (!retained.has(date)) {
      delete store.dates[date];
    }
  }
}

export async function getDailyLeaderboard(): Promise<{
  date: string;
  entries: DailyScore[];
}> {
  await writeQueue;
  const date = getUtcDateKey();
  const store = await readStore();

  return {
    date,
    entries: store.dates[date] ?? [],
  };
}

export async function submitDailyScore(
  name: string,
  seconds: number,
): Promise<{ date: string; entries: DailyScore[] }> {
  let result: { date: string; entries: DailyScore[] } | undefined;

  writeQueue = writeQueue.then(async () => {
    const date = getUtcDateKey();
    const store = await readStore();
    const entries = store.dates[date] ?? [];
    const normalizedName = name.toLocaleLowerCase();
    const existingIndex = entries.findIndex(
      (entry) => entry.name.toLocaleLowerCase() === normalizedName,
    );

    if (existingIndex === -1) {
      entries.push({ name, seconds });
    } else if (seconds < entries[existingIndex].seconds) {
      entries[existingIndex] = { name, seconds };
    }

    store.dates[date] = entries
      .sort((left, right) => left.seconds - right.seconds)
      .slice(0, maximumEntries);
    trimOldDates(store);
    await writeStore(store);

    result = {
      date,
      entries: store.dates[date],
    };
  });

  await writeQueue;

  if (!result) {
    throw new Error("Daily leaderboard update did not complete");
  }

  return result;
}