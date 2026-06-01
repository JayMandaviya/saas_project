import { env } from "./config/env";
import { createApp } from "./app";
import { connectDatabase, disconnectDatabase } from "./lib/prisma";
import { logger } from "./lib/logger";

const app = createApp();

async function start(): Promise<void> {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((error) => {
  logger.error("Failed to start server", { error });
  process.exit(1);
});
