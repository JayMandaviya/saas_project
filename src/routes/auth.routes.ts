import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { authenticate } from "../middleware/authenticate";
import { authRateLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  asyncHandler(authController.register.bind(authController))
);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  asyncHandler(authController.login.bind(authController))
);

router.post(
  "/refresh",
  authRateLimiter,
  asyncHandler(authController.refresh.bind(authController))
);

router.post(
  "/logout",
  authRateLimiter,
  asyncHandler(authController.logout.bind(authController))
);

router.get(
  "/me",
  authenticate,
  asyncHandler(authController.getMe.bind(authController))
);

export default router;
