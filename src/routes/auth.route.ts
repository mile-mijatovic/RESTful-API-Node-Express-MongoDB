import Router from "express";
import {
  login,
  logout,
  resetPassword,
  forgotPassword,
  register,
} from "../controllers/auth.controller";
import { requireAuth, validation } from "../middleware";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validation";

const router = Router();

// prettier-ignore
router
  .post("/register", validation(registerSchema), register)
  .post("/login", validation(loginSchema), login)
  .post("/forgot-password", validation(forgotPasswordSchema), forgotPassword)
  .post("/reset-password", validation(resetPasswordSchema), resetPassword)
  .get("/logout", requireAuth, logout);

export default router;
