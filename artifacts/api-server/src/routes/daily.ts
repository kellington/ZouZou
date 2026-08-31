import { Router, type IRouter } from "express";
import {
  GetDailyLeaderboardResponse,
  SubmitDailyScoreBody,
  SubmitDailyScoreResponse,
} from "@workspace/api-zod";
import {
  getDailyLeaderboard,
  submitDailyScore,
} from "../lib/dailyLeaderboard";

const router: IRouter = Router();

router.get("/daily/leaderboard", async (req, res): Promise<void> => {
  const leaderboard = await getDailyLeaderboard();
  req.log.debug({ date: leaderboard.date }, "Fetched daily leaderboard");
  res.json(GetDailyLeaderboardResponse.parse(leaderboard));
});

router.post("/daily/leaderboard", async (req, res): Promise<void> => {
  const parsed = SubmitDailyScoreBody.safeParse(req.body);

  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid daily score");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const name = parsed.data.name.trim().replace(/\s+/g, " ");
  const seconds = parsed.data.seconds;

  if (!name || !Number.isInteger(seconds)) {
    res.status(400).json({
      error: "Name is required and seconds must be a whole number.",
    });
    return;
  }

  const leaderboard = await submitDailyScore(name, seconds);
  req.log.info(
    { date: leaderboard.date, seconds },
    "Recorded daily score",
  );
  res.json(SubmitDailyScoreResponse.parse(leaderboard));
});

export default router;