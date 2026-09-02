import { Router, type IRouter } from "express";
import {
  GetRecentPlayersResponse,
  RecordPlayerGameBody,
  RecordPlayerGameResponse,
} from "@workspace/api-zod";
import {
  getRecentPlayers,
  recordPlayerGame,
} from "../lib/playerHistory";

const router: IRouter = Router();

router.get("/players/recent", async (req, res): Promise<void> => {
  const players = await getRecentPlayers();
  req.log.debug({ count: players.length }, "Fetched recent players");
  res.json(GetRecentPlayersResponse.parse({ entries: players }));
});

router.post("/players/games", async (req, res): Promise<void> => {
  const parsed = RecordPlayerGameBody.safeParse(req.body);

  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid player game");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const name = parsed.data.name.trim().replace(/\s+/g, " ");
  if (!name) {
    res.status(400).json({ error: "Name is required." });
    return;
  }

  const entry = await recordPlayerGame(
    name,
    parsed.data.game,
    parsed.data.seconds,
  );
  req.log.info(
    { game: entry.game, date: entry.date, seconds: entry.seconds },
    "Recorded player game",
  );
  res.json(RecordPlayerGameResponse.parse(entry));
});

export default router;