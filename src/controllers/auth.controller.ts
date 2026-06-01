import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { ApiError } from "../utils/ApiError";
import {
  clearRefreshCookie,
  setRefreshCookie,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import type { LoginInput, RegisterInput } from "../validators/auth.validator";

function getRefreshTokenFromCookie(req: Request): string | undefined {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return undefined;
  }

  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .reduce<string | undefined>((value, cookie) => {
      const [name, ...rawValue] = cookie.split("=");
      if (name === "refreshToken") {
        return decodeURIComponent(rawValue.join("="));
      }
      return value;
    }, undefined);
}

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const input = req.validated as RegisterInput;
    const result = await authService.register(input);

    setRefreshCookie(res, result.refreshToken);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: result.user,
        token: result.token,
      },
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const input = req.validated as LoginInput;
    const result = await authService.login(input);

    setRefreshCookie(res, result.refreshToken);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        token: result.token,
      },
    });
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = getRefreshTokenFromCookie(req);

    if (!refreshToken) {
      throw ApiError.unauthorized("Refresh token missing");
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await authService.getMe(payload.sub);
    const freshPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };
    const token = signAccessToken(freshPayload);
    const newRefreshToken = signRefreshToken(freshPayload);

    setRefreshCookie(res, newRefreshToken);

    res.json({
      success: true,
      message: "Token refreshed",
      data: {
        user,
        token,
      },
    });
  }

  async logout(_req: Request, res: Response): Promise<void> {
    clearRefreshCookie(res);

    res.json({
      success: true,
      message: "Logged out successfully",
      data: null,
    });
  }

  async getMe(req: Request, res: Response): Promise<void> {
    const user = await authService.getMe(req.user!.id);

    res.json({
      success: true,
      data: { user },
    });
  }
}

export const authController = new AuthController();
