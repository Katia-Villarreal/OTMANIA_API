import { Router } from "express";
import { getUsers, getUser, PostUser, PutUser, getFullProfile} from "../controllers/users.controllers.js";
const router = Router();

router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.post("/users", PostUser);
router.get("/users/profile/:id", getFullProfile);
router.put("/users/:id", PutUser);

export default router;