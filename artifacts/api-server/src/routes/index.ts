import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dailyRouter from "./daily";
import playersRouter from "./players";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dailyRouter);
router.use(playersRouter);

export default router;
