import { prisma } from "@/lib/prisma"
import { NotificationType, NotificationCategory } from "@prisma/client"

export async function getAllNotifications(filters: { eventId?: string, teamId?: string, userId?: string }) {
    return await prisma.notification.findMany({
        where: {
            OR: [
                { eventId: filters.eventId },
                { teamId: filters.teamId },
                { userId: filters.userId },
                { teamId: null, userId: null, eventId: filters.eventId } // Broadcast to event
            ]
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function createNotification(data: {
    eventId: string
    teamId?: string
    userId?: string
    category?: NotificationCategory
    type: NotificationType
    title: string
    body?: string
    createdById: string
}) {
    return await prisma.notification.create({
        data
    })
}

export async function markAsRead(id: string) {
    return await prisma.notification.update({
        where: { id },
        data: {
            isRead: true,
            readAt: new Date()
        }
    })
}
