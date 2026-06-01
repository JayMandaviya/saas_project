import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import activityRoutes from "./activity.routes";
import notificationRoutes from "./notification.routes";
import fileRoutes from "./file.routes";
import analyticsRoutes from "./analytics.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/activity", activityRoutes);
router.use("/notifications", notificationRoutes);
router.use("/files", fileRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
