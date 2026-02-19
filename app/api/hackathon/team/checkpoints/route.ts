import { NextRequest, NextResponse } from "next/server"
import { protect, getTeamId } from "@/lib/hackathon/auth-helpers"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
    const session = await protect([UserRole.TEAM])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const teamId = session?.user && 'teamId' in session.user ? (session.user as any).teamId : null
    const eventId = session?.user && 'eventId' in session.user ? (session.user as any).eventId : null

    if (!teamId || !eventId) {
        return NextResponse.json({ error: "Unauthorized: Missing team context" }, { status: 401 })
    }

    try {
        // Fetch all checkpoints for the event
        const checkpoints = await prisma.checkpoint.findMany({
            where: { eventId },
            orderBy: { order: 'asc' }
        })

        // Fetch team's progress for these checkpoints
        const progress = await prisma.checkpointProgress.findMany({
            where: { teamId, eventId }
        })

        // Merge: Each checkpoint gets a status (defaulting to PENDING)
        const mergedCheckpoints = checkpoints.map((cp: any) => {
            const p = progress.find((pr: any) => pr.checkpointId === cp.id)
            return {
                ...cp,
                status: p?.status || 'PENDING',
                progressId: p?.id || null,
                completedAt: p?.completedAt || null,
                reviewerNotes: p?.reviewerNotes || null
            }
        })

        return NextResponse.json(mergedCheckpoints)
    } catch (error) {
        console.error("Fetch checkpoints error:", error)
        return NextResponse.json({ error: "Failed to fetch milestones" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await protect([UserRole.TEAM])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const teamId = session?.user && 'teamId' in session.user ? (session.user as any).teamId : null
    const eventId = session?.user && 'eventId' in session.user ? (session.user as any).eventId : null

    if (!teamId || !eventId) {
        return NextResponse.json({ error: "Unauthorized: Missing team context" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { checkpointId, submissionData } = body

        if (!checkpointId) return NextResponse.json({ error: "Checkpoint ID required" }, { status: 400 })

        // Check if progress already exists
        const existingProgress = await prisma.checkpointProgress.findUnique({
            where: {
                checkpointId_teamId: { checkpointId, teamId }
            }
        })

        if (existingProgress) {
            const updated = await prisma.checkpointProgress.update({
                where: { id: existingProgress.id },
                data: {
                    status: 'SUBMITTED',
                    submissionData: submissionData || {},
                }
            })
            return NextResponse.json(updated)
        }

        const created = await prisma.checkpointProgress.create({
            data: {
                checkpointId,
                teamId,
                eventId,
                status: 'SUBMITTED',
                submissionData: submissionData || {},
            }
        })

        return NextResponse.json(created)
    } catch (error) {
        console.error("Submit checkpoint error:", error)
        return NextResponse.json({ error: "Failed to submit milestone" }, { status: 500 })
    }
}
