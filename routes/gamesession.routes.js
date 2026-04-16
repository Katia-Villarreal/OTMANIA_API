import { Router } from "express";
import { getGameSessionUser, getGameSessionUsers  } from "../controllers/gamesession.controllers.js";
const router = Router();

router.get("/gamesession", getGameSessionUsers);
router.get("/gamesession/:id", getGameSessionUser);

export default router;