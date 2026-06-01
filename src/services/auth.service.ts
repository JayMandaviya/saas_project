import { RoleName, NotificationType } from "../types/prisma";
import { publicUserSelect } from "../constants/userSelect";
import { prisma } from "../lib/prisma";
import { getRoleIdByName } from "../lib/roles";
import { ApiError } from "../utils/ApiError";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";
import { notificationService } from "./notification.service";
import type { LoginInput, RegisterInput } from "../validators/auth.validator";

interface TokenPair {
  token: string;
  refreshToken: string;
}

export class AuthService {
  private createTokens(payload: { sub: string; email: string; role: RoleName }): TokenPair {
    return {
      token: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  }

  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existing) {
      throw ApiError.conflict("Email already registered");
    }

    const userCount = await prisma.user.count();
    const roleName: RoleName = userCount === 0 ? RoleName.ADMIN : RoleName.USER;
    const roleId = await getRoleIdByName(roleName);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        password: await hashPassword(input.password),
        firstName: input.firstName,
        lastName: input.lastName,
        roleId,
      },
      select: publicUserSelect,
    });

    const tokens = this.createTokens({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });

    await notificationService.createNotification(
      user.id,
      user.email,
      'Welcome to Nexus',
      'Your account has been created successfully. Welcome aboard!',
      NotificationType.ACCOUNT,
    )

    return { user, ...tokens };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: { role: { select: { name: true } } },
    });

    if (!user || !user.isActive) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const valid = await comparePassword(input.password, user.password);

    if (!valid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const tokens = this.createTokens({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });

    const { password: _, role, ...rest } = user;

    return {
      user: { ...rest, role },
      ...tokens,
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: publicUserSelect,
    });

    if (!user || !user.isActive) {
      throw ApiError.unauthorized("User not found or inactive");
    }

    return user;
  }
}

export const authService = new AuthService();
