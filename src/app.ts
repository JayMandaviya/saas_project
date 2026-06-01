import "dotenv/config";
import express, { Express } from "express";
import path from "path";
import fs from "fs";
import { globalRateLimiter } from "./middleware/rateLimiter";
import { applySecurityMiddleware } from "./middleware/security";
import { notFoundHandler } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import apiRoutes from "./routes";
import { env } from "./config/env";

export function createApp(): Express {
  const app = express();

  applySecurityMiddleware(app);
  app.use(globalRateLimiter);

  const uploadDir = path.resolve(env.FILE_UPLOAD_DIR)
  fs.mkdirSync(uploadDir, { recursive: true })
  app.use("/uploads", express.static(uploadDir))

  app.use("/api/v1", apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
