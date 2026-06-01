import type { Response } from "express";
import jwt from "jsonwebtoken";
import { RoleName } from "../types/prisma";
import { env } from "../config/env";

export interface JwtPayload {
  sub: string;
  email: string;
  role: RoleName;
}

export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return verifyToken(token);
}

export function verifyRefreshToken(token: string): JwtPayload {
  return verifyToken(token);
}

function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === "string" || !decoded.sub) {
    throw new Error("Invalid token payload");
  }

  return {
    sub: decoded.sub,
    email: decoded.email as string,
    role: decoded.role as RoleName,
  };
}

export function setRefreshCookie(res: Response, token: string): void {
  const secure = env.NODE_ENV === "production";
  const maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function clearRefreshCookie(res: Response): void {
  const secure = env.NODE_ENV === "production";

  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
  });
}

export function parseRefreshTokenCookie(cookieHeader?: string): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .reduce<string | undefined>((value, cookie) => {
      const [name, ...rawValue] = cookie.split("=");
      if (name === REFRESH_TOKEN_COOKIE_NAME) {
        return decodeURIComponent(rawValue.join("="));
      }
      return value;
    }, undefined);
}
