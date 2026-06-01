import { Request, Response } from 'express'
import { notificationService } from '../services/notification.service'
import type { NotificationQuery } from '../services/notification.service'

export class NotificationController {
  async list(req: Request, res: Response): Promise<void> {
    const query = req.validated as NotificationQuery
    const result = await notificationService.listNotifications(req.user!.id, query)

    res.json({
      success: true,
      data: result,
    })
  }
}

export const notificationController = new NotificationController()
