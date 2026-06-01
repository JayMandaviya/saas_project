import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { verifyAccessToken } from "../utils/jwt";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Missing or invalid authorization header");
    }

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        isActive: true,
        role: { select: { name: true } },
      },
    });

    if (!user || !user.isActive) {
      throw ApiError.unauthorized("User not found or inactive");
    }

    if (user.role.name !== payload.role) {
      throw ApiError.unauthorized("Token role mismatch");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role.name,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}
