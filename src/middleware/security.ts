import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "../config/env";
import { httpLogStream } from "../lib/logger";

export function applySecurityMiddleware(app: Express): void {
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((o) => o.trim()),
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  if (env.NODE_ENV !== "test") {
    app.use(
      morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
        stream: httpLogStream,
      })
    );
  }
}
