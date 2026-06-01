import { NextFunction, Request, Response } from "express";
import { Prisma } from "../types/prisma";
import { ZodError } from "zod";
import { env } from "../config/env";
import { logger } from "../lib/logger";
import { ApiError } from "../utils/ApiError";

interface ErrorResponse {
  success: false;
  message: string;
  details?: unknown;
  stack?: string;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = "Internal server error";
  let details: unknown;
  let isOperational = false;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
    isOperational = err.isOperational;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    details = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    isOperational = true;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "A record with this value already exists";
      isOperational = true;
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Record not found";
      isOperational = true;
    }
  }

  if (!isOperational || statusCode >= 500) {
    logger.error(err.message, { stack: err.stack, statusCode });
  } else {
    logger.warn(message, { statusCode, details });
  }

  const body: ErrorResponse = {
    success: false,
    message,
  };

  if (details) {
    body.details = details;
  }

  if (env.NODE_ENV === "development" && err.stack) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
}
