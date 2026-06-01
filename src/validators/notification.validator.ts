import { z } from 'zod'
import { NotificationStatus, NotificationType } from '../types/prisma'

export const listNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.nativeEnum(NotificationStatus).optional(),
  type: z.nativeEnum(NotificationType).optional(),
})

export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>
