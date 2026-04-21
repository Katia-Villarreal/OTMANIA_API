import { Router } from "express";
import { getGameSessionUser, getGameSessionUsers, createGameSession } from "../controllers/gamesession.controllers.js";
const router = Router();

router.get("/gamesession", getGameSessionUsers);
router.get("/gamesession/:id", getGameSessionUser);
router.post("/creategamesession", createGameSession);

export default router;