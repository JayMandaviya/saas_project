import { RoleName } from "../types/prisma";

export const ROLE_HIERARCHY: Record<RoleName, number> = {
  USER: 1,
  MANAGER: 2,
  ADMIN: 3,
};

export const ALL_ROLE_NAMES = Object.keys(ROLE_HIERARCHY) as RoleName[];
