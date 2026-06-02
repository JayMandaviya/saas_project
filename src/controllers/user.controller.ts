import { Request, Response } from "express";
import { userService } from "../services/user.service";
import type {
  ListUsersQuery,
  UpdateProfileInput,
  UpdateUserInput,
} from "../validators/user.validator";

export class UserController {
  async listUsers(req: Request, res: Response): Promise<void> {
    const query = req.validated as ListUsersQuery;
    const result = await userService.listUsers(query);

    res.json({
      success: true,
      data: result,
    });
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const { id } = req.validated as { id: string };
    const user = await userService.getUserById(id);

    res.json({
      success: true,
      data: { user },
    });
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const input = req.validated as UpdateProfileInput;
    const user = await userService.updateProfile(req.user!.id, input);

    res.json({
      success: true,
      message: "Profile updated",
      data: { user },
    });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.validated as { id: string };
    const input = req.validated as UpdateUserInput;
    const user = await userService.updateUser(id, input, req.user!.id);

    res.json({
      success: true,
      message: "User updated",
      data: { user },
    });
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.validated as { id: string };
    await userService.deleteUser(id, req.user!.id);

    res.json({
      success: true,
      message: "User deleted",
    });
  }

  async getDashboardStats(_req: Request, res: Response): Promise<void> {
    const stats = await userService.getDashboardStats();

    res.json({
      success: true,
      data: stats,
    });
  }
}

export const userController = new UserController();
