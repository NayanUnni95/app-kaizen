import { prisma } from "@/lib/prisma"

export async function getAllProblemStatements(eventId?: string) {
    return await prisma.problemStatement.findMany({
        where: eventId ? { eventId } : {},
        include: {
            event: { select: { id: true, name: true, settings: true } },
        },
        orderBy: { createdAt: "desc" },
    })
}

export async function getProblemStatementById(id: string) {
    return await prisma.problemStatement.findUnique({
        where: { id },
        include: {
            event: { select: { id: true, name: true, settings: true } },
        },
    })
}

export async function getProblemStatementsByEvent(eventId: string) {
    return await prisma.problemStatement.findMany({
        where: { eventId },
        include: {
            event: { select: { id: true, name: true, settings: true } },
        },
        orderBy: { createdAt: "asc" },
    })
}

export async function createProblemStatement(data: {
    eventId: string
    title: string
    description?: string
    assetUrl?: string
    meta?: any
    createdById: string
}) {
    return await prisma.problemStatement.create({
        data: {
            eventId: data.eventId,
            title: data.title,
            description: data.description,
            assetUrl: data.assetUrl,
            meta: data.meta || { is_visible: false },
            createdById: data.createdById,
            updatedById: data.createdById,
        },
    })
}

export async function updateProblemStatement(
    id: string,
    data: {
        title?: string
        description?: string
        assetUrl?: string
        meta?: any
        updatedById: string
    }
) {
    const updateData: any = { updatedById: data.updatedById }
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.assetUrl !== undefined) updateData.assetUrl = data.assetUrl
    if (data.meta !== undefined) updateData.meta = data.meta

    return await prisma.problemStatement.update({
        where: { id },
        data: updateData,
    })
}

export async function deleteProblemStatement(id: string) {
    return await prisma.problemStatement.delete({
        where: { id },
    })
}

export async function toggleProblemStatementVisibility(
    id: string,
    isVisible: boolean,
    updatedById: string
) {
    const existing = await prisma.problemStatement.findUnique({ where: { id } })
    if (!existing) throw new Error("Problem statement not found")

    const currentMeta = (existing.meta as any) || {}
    return await prisma.problemStatement.update({
        where: { id },
        data: {
            meta: { ...currentMeta, is_visible: isVisible },
            updatedById,
        },
    })
}

/**
 * Toggle the is_pb_statement_released flag in the event's settings JSON
 */
export async function toggleEventProblemStatementRelease(
    eventId: string,
    isReleased: boolean,
    updatedById: string
) {
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) throw new Error("Event not found")

    const currentSettings = (event.settings as any) || {}
    return await prisma.event.update({
        where: { id: eventId },
        data: {
            settings: { ...currentSettings, is_pb_statement_released: isReleased },
            updatedById,
        },
    })
}

/**
 * Get released problem statements for a team (only visible ones from released events)
 */
export async function getReleasedProblemStatementsForEvent(eventId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) return []

    const settings = (event.settings as any) || {}
    if (!settings.is_pb_statement_released) return []

    const statements = await prisma.problemStatement.findMany({
        where: { eventId },
        orderBy: { createdAt: "asc" },
    })

    // Filter only visible statements
    return statements.filter((s: any) => {
        const meta = (s.meta as any) || {}
        return meta.is_visible === true
    })
}
