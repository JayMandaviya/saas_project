import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, RoleName } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const SYSTEM_ROLES: {
  name: RoleName;
  displayName: string;
  description: string;
  level: number;
}[] = [
  {
    name: RoleName.USER,
    displayName: "User",
    description: "Standard dashboard access",
    level: 1,
  },
  {
    name: RoleName.MANAGER,
    displayName: "Manager",
    description: "Team and user management",
    level: 2,
  },
  {
    name: RoleName.ADMIN,
    displayName: "Administrator",
    description: "Full system access",
    level: 3,
  },
];

async function main(): Promise<void> {
  for (const role of SYSTEM_ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {
        displayName: role.displayName,
        description: role.description,
        level: role.level,
      },
      create: {
        name: role.name,
        displayName: role.displayName,
        description: role.description,
        level: role.level,
        isSystem: true,
      },
    });
  }

  console.log("Seeded system roles:", SYSTEM_ROLES.map((r) => r.name).join(", "));
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
