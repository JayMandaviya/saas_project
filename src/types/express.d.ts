import { RoleName } from "./prisma";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      role: RoleName;
    }

    interface Request {
      user?: UserPayload;
      validated?: unknown;
    }
  }
}

export {};
