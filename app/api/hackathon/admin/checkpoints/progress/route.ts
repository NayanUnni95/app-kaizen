import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

/**
 * GET: Fetch all progress data for all teams and all checkpoints
 * Useful for a global progress overview/matrix
 */

export async function GET(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get("eventId") || undefined

    try {
        // Fetch all checkpoints (optionally filtered by event)
        const checkpoints = await prisma.checkpoint.findMany({
            where: eventId ? { eventId } : {},
            orderBy: [{ eventId: 'asc' }, { order: 'asc' }],
            select: {
                id: true,
                title: true,
                order: true,
                eventId: true,
                event: { select: { name: true } }
            }
        })

        // Fetch all teams (optionally filtered by event)
        const teams = await prisma.team.findMany({
            where: eventId ? { eventId } : {},
            select: {
                id: true,
                name: true,
                eventId: true
            }
        })

        // Fetch all progress records
        const progress = await prisma.checkpointProgress.findMany({
            where: eventId ? { eventId } : {}
        })

        // Format data into a matrix/convenient structure
        const data = teams.map(team => {
            const teamEventCheckpoints = checkpoints.filter(cp => cp.eventId === team.eventId)
            const teamProgress = teamEventCheckpoints.map(cp => {
                const p = progress.find(pr => pr.teamId === team.id && pr.checkpointId === cp.id)
                return {
                    checkpointId: cp.id,
                    checkpointTitle: cp.title,
                    order: cp.order,
                    status: p?.status || 'PENDING',
                    progressId: p?.id || null,
                    completedAt: p?.completedAt || null
                }
            })

            return {
                teamId: team.id,
                teamName: team.name,
                progress: teamProgress
            }
        })

        return NextResponse.json({
            checkpoints, // Metadata about milestones
            teamsProgress: data
        })
    } catch (error) {
        console.error("Fetch all progress error:", error)
        return NextResponse.json({ error: "Failed to fetch progress overview" }, { status: 500 })
    }
}
