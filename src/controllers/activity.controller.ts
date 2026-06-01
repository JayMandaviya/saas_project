import { Request, Response } from 'express'
import { activityService } from '../services/activity.service'
import type { ActivityQuery } from '../services/activity.service'

export class ActivityController {
  async list(req: Request, res: Response): Promise<void> {
    const query = req.validated as ActivityQuery
    const result = await activityService.listActivityLogs(query)

    res.json({
      success: true,
      data: result,
    })
  }
}

export const activityController = new ActivityController()
