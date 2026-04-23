import { Router } from "express";
import { sendResetCode, verifyResetCode, resetPassword } from "../controllers/reset.password.controllers.js";

const router = Router();

router.post("/request-reset", sendResetCode);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export default router;