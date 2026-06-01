import { z } from "zod";

const roleEnum = z.enum(["USER", "MANAGER", "ADMIN"]);

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  role: roleEnum.optional(),
  isActive: z.boolean().optional(),
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  role: roleEnum.optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(['createdAt', 'email', 'firstName', 'role']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const userIdParamSchema = z.object({
  id: z.uuid("Invalid user id"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
