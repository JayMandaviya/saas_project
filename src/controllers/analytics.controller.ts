import { Request, Response } from 'express'
import { analyticsService } from '../services/analytics.service'

export class AnalyticsController {
  async getUserGrowth(req: Request, res: Response): Promise<void> {
    const result = await analyticsService.getUserGrowth()

    res.json({
      success: true,
      data: result,
    })
  }
}

export const analyticsController = new AnalyticsController()
