import path from "path";
import winston from "winston";
import { env } from "../config/env";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const devFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack ?? message}`;
});

const transports: winston.transport[] = [
  new winston.transports.Console({
    format:
      env.NODE_ENV === "production"
        ? combine(timestamp(), errors({ stack: true }), json())
        : combine(colorize(), timestamp(), errors({ stack: true }), devFormat),
  }),
];

if (env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
    new winston.transports.File({
      filename: path.join("logs", "combined.log"),
      format: combine(timestamp(), errors({ stack: true }), json()),
    })
  );
}

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  defaultMeta: { service: "saas-admin-api" },
  transports,
  exitOnError: false,
});

export const httpLogStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
