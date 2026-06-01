import { Router } from 'express'
import { notificationController } from '../controllers/notification.controller'
import { asyncHandler } from '../middleware/asyncHandler'
import { authenticate } from '../middleware/authenticate'
import { validate } from '../middleware/validate'
import { listNotificationsQuerySchema } from '../validators/notification.validator'

const router = Router()

router.use(authenticate)

router.get(
  '/',
  validate(listNotificationsQuerySchema, 'query'),
  asyncHandler(notificationController.list.bind(notificationController)),
)

export default router
