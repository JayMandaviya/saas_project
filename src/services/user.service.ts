import { Prisma, RoleName } from "../types/prisma";
import { publicUserSelect } from "../constants/userSelect";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import type {
  ListUsersQuery,
  UpdateProfileInput,
  UpdateUserInput,
} from "../validators/user.validator";

export class UserService {
  async listUsers(query: ListUsersQuery) {
    const { page, limit, search, role, isActive, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = { name: role };
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy =
      sortBy === 'role'
        ? { role: { name: sortOrder } }
        : { [sortBy]: sortOrder }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: publicUserSelect,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user;
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    return prisma.user.update({
      where: { id: userId },
      data: input,
      select: publicUserSelect,
    });
  }

  async updateUser(id: string, input: UpdateUserInput, actorId: string) {
    if (id === actorId && input.isActive === false) {
      throw ApiError.badRequest("Cannot deactivate your own account");
    }

    const { role, ...profileFields } = input;

    const data: Prisma.UserUpdateInput = { ...profileFields };

    if (role) {
      data.role = { connect: { name: role as RoleName } };
    }

    try {
      return await prisma.user.update({
        where: { id },
        data,
        select: publicUserSelect,
      });
    } catch {
      throw ApiError.notFound("User not found");
    }
  }

  async deleteUser(id: string, actorId: string) {
    if (id === actorId) {
      throw ApiError.badRequest("Cannot delete your own account");
    }

    try {
      await prisma.user.delete({ where: { id } });
    } catch {
      throw ApiError.notFound("User not found");
    }
  }

  async getDashboardStats() {
    const [totalUsers, activeUsers, newSignups] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          },
        },
      }),
    ])

    return {
      totalUsers,
      activeUsers,
      newSignups,
    }
  }
}

export const userService = new UserService();
