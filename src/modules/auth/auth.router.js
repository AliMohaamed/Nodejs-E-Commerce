import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import { activateAccountSchema, registerSchema } from "./auth.validation.js";
import { register, confirmEmail } from "./auth.controller.js";

const router = Router();

// Register
router.post("/register", isValid(registerSchema), register);

// Activate Mail
router.get(
  "/confirmEmail/:activationCode",
  isValid(activateAccountSchema),
  confirmEmail
);

// Login

// Reset Password

export default router;
