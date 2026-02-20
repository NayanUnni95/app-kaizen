import { prisma } from "@/lib/prisma"
import { TeamRole, UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

export async function getAllTeams(eventId?: string) {
    return await prisma.team.findMany({
        where: eventId ? { eventId } : {},
        include: {
            _count: { select: { members: true } },
            members: true
        },
        orderBy: { createdAt: "desc" }
    })
}

export async function getTeamById(id: string) {
    return await prisma.team.findUnique({
        where: { id },
        include: {
            members: true,
            event: {
                include: { checkpoints: true }
            },
            submissions: true,
            progress: {
                include: { checkpoint: true }
            }
        }
    })
}

export async function getTeamByEmail(email: string) {
    return await prisma.team.findFirst({
        where: { email },
        include: {
            members: true,
            event: {
                include: { checkpoints: true }
            },
            submissions: true,
            progress: {
                include: { checkpoint: true }
            }
        }
    })
}

export async function getTeamBySession(user: any) {
    if (user?.teamId) {
        return await getTeamById(user.teamId)
    }
    if (user?.email) {
        return await getTeamByEmail(user.email)
    }
    return null
}

export async function createTeam(data: {
    name: string
    username: string
    password: string
    email?: string
    eventId: string
    createdById: string
}) {
    const passwordHash = await bcrypt.hash(data.password, 10)

    return await prisma.team.create({
        data: {
            name: data.name,
            username: data.username,
            passwordHash,
            email: data.email,
            eventId: data.eventId,
            createdById: data.createdById,
            updatedById: data.createdById,
        }
    })
}

export async function updateTeam(id: string, data: any) {
    if (data.password) {
        data.passwordHash = await bcrypt.hash(data.password, 10)
        delete data.password
    }

    return await prisma.team.update({
        where: { id },
        data
    })
}

export async function deleteTeam(id: string) {
    return await prisma.team.delete({
        where: { id }
    })
}

export async function addTeamMember(teamId: string, data: { name: string, role?: TeamRole, createdById: string }) {
    return await prisma.teamMember.create({
        data: {
            teamId,
            name: data.name,
            role: data.role || TeamRole.MEMBER,
            createdById: data.createdById,
            updatedById: data.createdById
        }
    })
}
