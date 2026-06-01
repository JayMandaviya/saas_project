import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { authenticate } from "../middleware/authenticate";
import { authorize, authorizeMinRole } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import {
  listUsersQuerySchema,
  updateProfileSchema,
  updateUserSchema,
  userIdParamSchema,
} from "../validators/user.validator";

const router = Router();

router.use(authenticate);

router.patch(
  "/me",
  validate(updateProfileSchema),
  asyncHandler(userController.updateProfile.bind(userController))
);

router.get(
  "/",
  authorizeMinRole("MANAGER"),
  validate(listUsersQuerySchema, "query"),
  asyncHandler(userController.listUsers.bind(userController))
);

router.get(
  "/stats",
  asyncHandler(userController.getDashboardStats.bind(userController))
);

router.get(
  "/:id",
  authorizeMinRole("MANAGER"),
  validate(userIdParamSchema, "params"),
  asyncHandler(userController.getUser.bind(userController))
);

router.patch(
  "/:id",
  authorize("ADMIN"),
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema),
  asyncHandler(userController.updateUser.bind(userController))
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  validate(userIdParamSchema, "params"),
  asyncHandler(userController.deleteUser.bind(userController))
);

export default router;
