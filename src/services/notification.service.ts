import { NotificationStatus, NotificationType } from '../types/prisma'
import { prisma } from '../lib/prisma'
import { sendEmail } from '../utils/email'

export interface NotificationQuery {
  page: number
  limit: number
  search?: string
  status?: NotificationStatus
  type?: NotificationType
}

export class NotificationService {
  async listNotifications(userId: string, query: NotificationQuery) {
    const { page, limit, search, status, type } = query
    const skip = (page - 1) * limit

    const where: Parameters<typeof prisma.notification.findMany>[0]['where'] = {
      userId,
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ])

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async createNotification(
    userId: string,
    recipientEmail: string,
    title: string,
    message: string,
    type: NotificationType,
  ) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    })

    if (recipientEmail) {
      await sendEmail({
        to: recipientEmail,
        subject: title,
        text: message,
      }).catch(() => {
        /* swallow email errors */
      })
    }

    return notification
  }
}

export const notificationService = new NotificationService()
