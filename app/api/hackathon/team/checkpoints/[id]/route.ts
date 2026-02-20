import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await protect([UserRole.TEAM])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const teamId = session?.user && 'teamId' in session.user ? (session.user as any).teamId : null
    const eventId = session?.user && 'eventId' in session.user ? (session.user as any).eventId : null

    if (!teamId || !eventId) {
        return NextResponse.json({ error: "Unauthorized: Missing team context" }, { status: 401 })
    }

    try {
        const checkpoint = await prisma.checkpoint.findUnique({
            where: { id },
            include: {
                event: true
            }
        })

        if (!checkpoint || (!checkpoint.isVisible)) {
            return NextResponse.json({ error: "Checkpoint not found" }, { status: 404 })
        }

        // Fetch team's progress for this checkpoint
        const progress = await prisma.checkpointProgress.findUnique({
            where: {
                checkpointId_teamId: {
                    checkpointId: id,
                    teamId
                }
            }
        })

        const response = {
            ...checkpoint,
            teamProgress: progress ? {
                status: progress.status,
                items: (progress.submissionData as any)?.items || [],
                reviewerNotes: progress.reviewerNotes,
                updatedAt: progress.updatedAt
            } : null
        }

        return NextResponse.json(response)
    } catch (error) {
        console.error("Fetch checkpoint detail error:", error)
        return NextResponse.json({ error: "Failed to fetch milestone details" }, { status: 500 })
    }
}
