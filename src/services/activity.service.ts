import { ActivityAction, Prisma } from '../types/prisma'
import { prisma } from '../lib/prisma'
import { ApiError } from '../utils/ApiError'

export interface ActivityQuery {
  page: number
  limit: number
  search?: string
  action?: ActivityAction
  userId?: string
  sortBy?: 'createdAt' | 'action'
  sortOrder?: 'asc' | 'desc'
}

export class ActivityService {
  async logActivity(payload: {
    userId?: string
    action: ActivityAction
    entityType: string
    entityId?: string
    description?: string
    metadata?: Record<string, unknown>
    ipAddress?: string
    userAgent?: string
  }) {
    return prisma.activityLog.create({
      data: {
        userId: payload.userId,
        action: payload.action,
        entityType: payload.entityType,
        entityId: payload.entityId,
        description: payload.description,
        metadata: payload.metadata,
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
      },
    })
  }

  async listActivityLogs(query: ActivityQuery) {
    const { page, limit, search, action, userId, sortBy = 'createdAt', sortOrder = 'desc' } = query
    const skip = (page - 1) * limit

    const where: Prisma.ActivityLogWhereInput = {}

    if (userId) {
      where.userId = userId
    }

    if (action) {
      where.action = action
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { entityType: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const [activity, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ])

    return {
      activity,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}

export const activityService = new ActivityService()
