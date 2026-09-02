import ReplitDatabase from "@replit/database";
import { getEdmontonDateKey } from "./dailyLeaderboard";

export type GameMode = "daily" | "easy" | "medium" | "hard";

export type PlayerGameEntry = {
  date: string;
  game: GameMode;
  seconds: number;
};

export type StoredPlayerHistory = {
  name: string;
  entries: PlayerGameEntry[];
};

export type RecentPlayer = PlayerGameEntry & {
  name: string;
};

const database = new ReplitDatabase();
const playerKeyPrefix = "zouzou:player:";

let writeQueue: Promise<void> = Promise.resolve();

function isGameMode(value: unknown): value is GameMode {
  return (
    value === "daily" ||
    value === "easy" ||
    value === "medium" ||
    value === "hard"
  );
}

function isPlayerGameEntry(value: unknown): value is PlayerGameEntry {
  if (!value || typeof value !== "object") return false;

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.date === "string" &&
    isGameMode(entry.game) &&
    typeof entry.seconds === "number" &&
    Number.isInteger(entry.seconds) &&
    entry.seconds >= 1
  );
}

function isStoredPlayerHistory(
  value: unknown,
): value is StoredPlayerHistory {
  if (!value || typeof value !== "object") return false;

  const history = value as Record<string, unknown>;
  return (
    typeof history.name === "string" &&
    history.name.length > 0 &&
    Array.isArray(history.entries) &&
    history.entries.every(isPlayerGameEntry)
  );
}

function normalizePlayerName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

function playerKey(name: string): string {
  return `${playerKeyPrefix}${encodeURIComponent(name.toLocaleLowerCase())}`;
}

async function readPlayerHistory(
  key: string,
): Promise<StoredPlayerHistory | null> {
  const result = await database.get(key);

  if (!result.ok) {
    if (result.error.statusCode === 404) {
      return null;
    }

    throw new Error(
      `Unable to read player history (${result.error.statusCode ?? "unknown status"}): ${result.error.message || "no error details"}`,
    );
  }

  if (result.value === null || result.value === undefined) {
    return null;
  }

  if (!isStoredPlayerHistory(result.value)) {
    throw new Error(`Replit Database key "${key}" contains invalid player history`);
  }

  return result.value;
}

async function writePlayerHistory(
  key: string,
  history: StoredPlayerHistory,
): Promise<void> {
  const result = await database.set(key, history);

  if (!result.ok) {
    throw new Error(
      `Unable to write player history (${result.error.statusCode ?? "unknown status"}): ${result.error.message || "no error details"}`,
    );
  }
}

export async function recordPlayerGame(
  name: string,
  game: GameMode,
  seconds: number,
): Promise<PlayerGameEntry> {
  const operation = writeQueue.then(async () => {
    const normalizedName = normalizePlayerName(name);
    const key = playerKey(normalizedName);
    const history = (await readPlayerHistory(key)) ?? {
      name: normalizedName,
      entries: [],
    };
    const entry: PlayerGameEntry = {
      date: getEdmontonDateKey(),
      game,
      seconds,
    };

    history.name = normalizedName;
    history.entries.push(entry);
    await writePlayerHistory(key, history);
    return entry;
  });

  writeQueue = operation.then(
    () => undefined,
    () => undefined,
  );

  return operation;
}

export async function getRecentPlayers(): Promise<RecentPlayer[]> {
  const keysResult = await database.list(playerKeyPrefix);

  if (!keysResult.ok) {
    throw new Error(
      `Unable to list player history (${keysResult.error.statusCode ?? "unknown status"}): ${keysResult.error.message || "no error details"}`,
    );
  }

  const histories = await Promise.all(
    keysResult.value.map((key) => readPlayerHistory(key)),
  );

  return histories
    .filter((history): history is StoredPlayerHistory => history !== null)
    .flatMap((history) => {
      const entry = history.entries[history.entries.length - 1];
      return entry ? [{ name: history.name, ...entry }] : [];
    })
    .sort((left, right) => right.date.localeCompare(left.date));
}