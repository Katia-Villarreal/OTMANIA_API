import { Router } from "express";
import * as authController from "../controllers/auth.controllers.js";

const router = Router();

router.post("/send-code", authController.sendCode);
router.post("/verify-code", authController.verifyCode);

export default router;