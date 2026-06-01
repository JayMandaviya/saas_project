import { prisma } from '../lib/prisma'

export class AnalyticsService {
  async getUserGrowth() {
    const now = new Date()
    const months: Array<{ month: string; year: number; start: Date; end: Date }> = []

    for (let index = 5; index >= 0; index -= 1) {
      const month = new Date(now.getFullYear(), now.getMonth() - index, 1)
      const start = new Date(month.getFullYear(), month.getMonth(), 1)
      const end = new Date(month.getFullYear(), month.getMonth() + 1, 1)
      months.push({
        month: month.toLocaleString('default', { month: 'short' }),
        year: month.getFullYear(),
        start,
        end,
      })
    }

    const users = await prisma.user.findMany({
      where: {
        createdAt: { gte: months[0].start },
      },
      select: {
        createdAt: true,
        isActive: true,
      },
    })

    const userGrowth = months.map((month) => {
      const monthUsers = users.filter(
        (user) => user.createdAt >= month.start && user.createdAt < month.end,
      )
      return {
        label: `${month.month} ${month.year}`,
        users: monthUsers.length,
        active: monthUsers.filter((user) => user.isActive).length,
      }
    })

    return {
      userGrowth,
    }
  }
}

export const analyticsService = new AnalyticsService()
