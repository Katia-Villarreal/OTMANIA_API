import { Router } from "express";
import { getMinigameHistoryUser, getMinigameHistoryUsers} from "../controllers/hminigame.controllers.js";
const router = Router();

router.get("/hminigame", getMinigameHistoryUsers);
router.get("/hminigame/:id", getMinigameHistoryUser);

export default router;