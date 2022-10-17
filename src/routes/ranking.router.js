import { Router } from "express";
import { usersRanking } from "../controllers/ranking.controller.js";

const rankingRouter = Router();

rankingRouter.get('/ranking', usersRanking);

export default rankingRouter;