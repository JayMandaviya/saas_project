import { RoleName } from "../types/prisma";
import { prisma } from "./prisma";
import { ApiError } from "../utils/ApiError";

export async function getRoleIdByName(name: RoleName): Promise<string> {
  const role = await prisma.role.findUnique({
    where: { name },
    select: { id: true },
  });

  if (!role) {
    throw ApiError.internal(
      `System role "${name}" is missing. Run: npx prisma db seed`
    );
  }

  return role.id;
}
