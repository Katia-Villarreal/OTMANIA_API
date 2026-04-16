import { Router } from "express";
import { getUsers, getUser, PostUser, PutUser} from "../controllers/users.controllers.js";
const router = Router();

router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.post("/users", PostUser);
router.put("/users/:id", PutUser);

export default router;