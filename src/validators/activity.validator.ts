import { z } from 'zod'
import { ActivityAction } from '../types/prisma'

export const listActivityQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  action: z.nativeEnum(ActivityAction).optional(),
  sortBy: z.enum(['createdAt', 'action']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type ListActivityQuery = z.infer<typeof listActivityQuerySchema>
