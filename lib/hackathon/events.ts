import { prisma } from "@/lib/prisma"

export async function getAllEvents() {
    return await prisma.event.findMany({
        orderBy: { startsAt: 'desc' }
    })
}

export async function getEventById(id: string) {
    return await prisma.event.findUnique({
        where: { id },
        include: {
            checkpoints: { orderBy: { order: 'asc' } },
            teams: { include: { _count: { select: { members: true } } } }
        }
    })
}

export async function createEvent(data: {
    name: string
    description?: string
    startsAt?: Date
    endsAt?: Date
    registrationDeadline?: Date
    createdById: string
}) {
    return await prisma.event.create({
        data: {
            ...data,
            updatedById: data.createdById
        }
    })
}

export async function updateEvent(id: string, data: any) {
    return await prisma.event.update({
        where: { id },
        data
    })
}

export async function deleteEvent(id: string) {
    return await prisma.event.delete({
        where: { id }
    })
}
