import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

/**
 * GET: Fetch all checkpoints for a team's event with their specific progress
 * PUT: Update status or notes for a team's checkpoint progress
 */

export async function GET(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get("teamId")

    if (!teamId) {
        return NextResponse.json({ error: "Team ID is required" }, { status: 400 })
    }

    try {
        // Find the team to get their eventId
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            select: { eventId: true }
        })

        if (!team) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 })
        }

        // Fetch all checkpoints for this event
        const checkpoints = await prisma.checkpoint.findMany({
            where: { eventId: team.eventId },
            orderBy: { order: 'asc' }
        })

        // Fetch team's progress for these checkpoints
        const progress = await prisma.checkpointProgress.findMany({
            where: { teamId, eventId: team.eventId }
        })

        // Merge checkpoints with progress
        const merged = checkpoints.map(cp => {
            const p = progress.find(pr => pr.checkpointId === cp.id)
            return {
                ...cp,
                teamProgress: p ? {
                    id: p.id,
                    status: p.status,
                    submissionData: p.submissionData,
                    reviewerNotes: p.reviewerNotes,
                    updatedAt: p.updatedAt,
                    completedAt: p.completedAt
                } : null
            }
        })

        return NextResponse.json(merged)
    } catch (error) {
        console.error("Fetch team checkpoints error:", error)
        return NextResponse.json({ error: "Failed to fetch checkpoints" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const { teamId, checkpointId, status, reviewerNotes } = body

        if (!teamId || !checkpointId) {
            return NextResponse.json({ error: "Team ID and Checkpoint ID are required" }, { status: 400 })
        }

        // Get eventId for the team
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            select: { eventId: true }
        })

        if (!team) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 })
        }

        // Find or create progress record
        const existingProgress = await prisma.checkpointProgress.findUnique({
            where: {
                checkpointId_teamId: { checkpointId, teamId }
            }
        })

        if (existingProgress) {
            const updated = await prisma.checkpointProgress.update({
                where: { id: existingProgress.id },
                data: {
                    status,
                    reviewerNotes,
                    updatedById: (session.user as any).id,
                    completedAt: status === 'APPROVED' ? new Date() : existingProgress.completedAt
                }
            })
            return NextResponse.json(updated)
        } else {
            const created = await prisma.checkpointProgress.create({
                data: {
                    teamId,
                    checkpointId,
                    eventId: team.eventId,
                    status: status || 'PENDING',
                    reviewerNotes,
                    createdById: (session.user as any).id,
                    updatedById: (session.user as any).id,
                    completedAt: status === 'APPROVED' ? new Date() : null
                }
            })
            return NextResponse.json(created)
        }
    } catch (error) {
        console.error("Update team checkpoint error:", error)
        return NextResponse.json({ error: "Failed to update checkpoint progress" }, { status: 500 })
    }
}
