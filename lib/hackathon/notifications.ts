import { prisma } from "@/lib/prisma"
import { NotificationType, NotificationCategory } from "@prisma/client"

export async function getAllNotifications(filters: { eventId?: string, teamId?: string, userId?: string, isAdmin?: boolean }) {
    // If it's an admin view, we don't apply the participant-specific OR filter
    if (filters.isAdmin) {
        return await prisma.notification.findMany({
            where: {
                ...(filters.eventId && filters.eventId !== 'all' ? { eventId: filters.eventId } : {})
            },
            orderBy: { createdAt: 'desc' }
        })
    }

    // Participant view: (Event + Team) OR (Event + User) OR (Event + Global)
    // This prevents teams from seeing other teams' private notifications in the same event
    const orConditions: any[] = []
    if (filters.teamId) orConditions.push({ teamId: filters.teamId })
    if (filters.userId) orConditions.push({ userId: filters.userId })
    orConditions.push({ teamId: null, userId: null }) // Broadcast notifications

    const where: any = { OR: orConditions }

    // Crucial: Only filter by eventId if it's truthy and NOT the string 'null'
    if (filters.eventId && filters.eventId !== 'null' && filters.eventId !== 'undefined') {
        where.eventId = filters.eventId
    }

    return await prisma.notification.findMany({
        where,
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
    meta?: any
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

export async function updateNotification(id: string, data: {
    eventId?: string
    teamId?: string
    userId?: string
    category?: NotificationCategory
    type?: NotificationType
    title?: string
    body?: string
    meta?: any
}) {
    return await prisma.notification.update({
        where: { id },
        data
    })
}

export async function deleteNotification(id: string) {
    return await prisma.notification.delete({
        where: { id }
    })
}
