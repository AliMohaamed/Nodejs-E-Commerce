import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  activateAccountSchema,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import {
  register,
  activateMail,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  refreshToken,
} from "./auth.controller.js";

const router = Router();

// Register
router.post("/register", isValid(registerSchema), register);

// Activate Mail
router.get(
  "/confirmEmail/:activationCode",
  isValid(activateAccountSchema),
  activateMail
);

// Login
router.post("/login", isValid(loginSchema), login);

// Refresh Token
router.post("/refresh-token", refreshToken); 

// Reset Password
router.post("/forgotPassword", isValid(forgotPasswordSchema), forgotPassword);
router.post("/verifyOtp", isValid(verifyOtpSchema), verifyOtp);
router.post("/resetPassword", isValid(resetPasswordSchema), resetPassword);

export default router;
