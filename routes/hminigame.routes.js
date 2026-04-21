import { Router } from "express";
import { getMinigameHistoryUser, getMinigameHistoryUsers, createMinigameHistory} from "../controllers/hminigame.controllers.js";
const router = Router();

router.get("/hminigame", getMinigameHistoryUsers);
router.get("/hminigame/:id", getMinigameHistoryUser);
router.post("/hminigame", createMinigameHistory);

export default router;