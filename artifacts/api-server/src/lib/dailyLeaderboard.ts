import ReplitDatabase from "@replit/database";

export type DailyScore = {
  name: string;
  seconds: number;
};

export type DailyLeaderboard = {
  date: string;
  entries: DailyScore[];
};

const database = new ReplitDatabase();
const leaderboardKey = "zouzou:daily-leaderboard";
const maximumEntries = 10;

let writeQueue: Promise<void> = Promise.resolve();

export function getEdmontonDateKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function isDailyScore(value: unknown): value is DailyScore {
  if (!value || typeof value !== "object") return false;

  const score = value as Record<string, unknown>;
  return (
    typeof score.name === "string" &&
    typeof score.seconds === "number" &&
    Number.isInteger(score.seconds) &&
    score.seconds >= 1
  );
}

function isDailyLeaderboard(value: unknown): value is DailyLeaderboard {
  if (!value || typeof value !== "object") return false;

  const leaderboard = value as Record<string, unknown>;
  return (
    typeof leaderboard.date === "string" &&
    Array.isArray(leaderboard.entries) &&
    leaderboard.entries.every(isDailyScore)
  );
}

async function readStoredLeaderboard(): Promise<DailyLeaderboard | null> {
  const result = await database.get(leaderboardKey);

  if (!result.ok) {
    if (result.error.statusCode === 404) {
      return null;
    }

    throw new Error(
      `Unable to read Replit Database leaderboard (${result.error.statusCode ?? "unknown status"}): ${result.error.message || "no error details"}`,
    );
  }

  if (result.value === null || result.value === undefined) {
    return null;
  }

  if (!isDailyLeaderboard(result.value)) {
    throw new Error(
      `Replit Database key "${leaderboardKey}" contains invalid leaderboard data`,
    );
  }

  return result.value;
}

async function readCurrentLeaderboard(
  date: string,
): Promise<DailyLeaderboard> {
  const stored = await readStoredLeaderboard();

  if (!stored || stored.date !== date) {
    return { date, entries: [] };
  }

  return {
    date,
    entries: stored.entries
      .filter(isDailyScore)
      .sort((left, right) => left.seconds - right.seconds)
      .slice(0, maximumEntries),
  };
}

async function writeLeaderboard(value: DailyLeaderboard): Promise<void> {
  const result = await database.set(leaderboardKey, value);

  if (!result.ok) {
    throw new Error(
      `Unable to write Replit Database leaderboard: ${result.error.message}`,
    );
  }
}

export async function getDailyLeaderboard(): Promise<DailyLeaderboard> {
  await writeQueue;
  return readCurrentLeaderboard(getEdmontonDateKey());
}

export async function submitDailyScore(
  name: string,
  seconds: number,
): Promise<DailyLeaderboard> {
  const operation = writeQueue.then(async () => {
    const date = getEdmontonDateKey();
    const leaderboard = await readCurrentLeaderboard(date);
    const normalizedName = name.toLocaleLowerCase();
    const existingIndex = leaderboard.entries.findIndex(
      (entry) => entry.name.toLocaleLowerCase() === normalizedName,
    );

    if (existingIndex === -1) {
      leaderboard.entries.push({ name, seconds });
    } else if (seconds < leaderboard.entries[existingIndex].seconds) {
      leaderboard.entries[existingIndex] = { name, seconds };
    }

    leaderboard.entries = leaderboard.entries
      .sort((left, right) => left.seconds - right.seconds)
      .slice(0, maximumEntries);

    await writeLeaderboard(leaderboard);
    return leaderboard;
  });

  writeQueue = operation.then(
    () => undefined,
    () => undefined,
  );

  return operation;
}