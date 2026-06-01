import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { ApiError } from "../utils/ApiError";

type RequestSource = "body" | "query" | "params";

declare module "express" {
  interface Request {
    validated?: unknown;
  }
}

export function validate(schema: ZodType, source: RequestSource = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      next(ApiError.badRequest("Validation failed", details));
      return;
    }

    req.validated = result.data;
    next();
  };
}
