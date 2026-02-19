import { prisma } from "@/lib/prisma"

export async function getAllCheckpoints(eventId?: string) {
    return await prisma.checkpoint.findMany({
        where: eventId ? { eventId } : {},
        orderBy: [{ eventId: 'asc' }, { order: 'asc' }],
        include: { event: { select: { name: true } } }
    })
}

export async function createCheckpoint(data: {
    eventId: string
    title: string
    description?: string
    order?: number
    dueAt?: Date
    isRequired?: boolean
    createdById: string
}) {
    return await prisma.checkpoint.create({
        data: {
            ...data,
            updatedById: data.createdById
        }
    })
}

export async function updateCheckpoint(id: string, data: any) {
    return await prisma.checkpoint.update({
        where: { id },
        data
    })
}

export async function deleteCheckpoint(id: string) {
    return await prisma.checkpoint.delete({
        where: { id }
    })
}

export async function getTeamProgress(teamId: string, eventId: string) {
    return await prisma.checkpointProgress.findMany({
        where: { teamId, eventId },
        include: { checkpoint: true }
    })
}

export async function updateProgress(id: string, data: { status: any, reviewerNotes?: string, updatedById: string }) {
    return await prisma.checkpointProgress.update({
        where: { id },
        data
    })
}
