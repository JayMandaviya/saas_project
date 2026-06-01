import { NextFunction, Request, Response } from "express";
import { RoleName } from "../types/prisma";
import { ROLE_HIERARCHY } from "../constants/roles";
import { ApiError } from "../utils/ApiError";

export function authorize(...allowedRoles: RoleName[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized());
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(ApiError.forbidden("Insufficient permissions"));
      return;
    }

    next();
  };
}

export function authorizeMinRole(minRole: RoleName) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized());
      return;
    }

    const userLevel = ROLE_HIERARCHY[req.user.role];
    const requiredLevel = ROLE_HIERARCHY[minRole];

    if (userLevel < requiredLevel) {
      next(ApiError.forbidden("Insufficient permissions"));
      return;
    }

    next();
  };
}
