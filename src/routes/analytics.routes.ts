import { Router } from 'express'
import { analyticsController } from '../controllers/analytics.controller'
import { asyncHandler } from '../middleware/asyncHandler'
import { authenticate } from '../middleware/authenticate'

const router = Router()

router.use(authenticate)

router.get('/user-growth', asyncHandler(analyticsController.getUserGrowth.bind(analyticsController)))

export default router
