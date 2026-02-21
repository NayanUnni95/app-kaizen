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
            where: {
                eventId,
                isVisible: true
            },
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
                reviewerNotes: p?.reviewerNotes || null,
                // Ensure teamProgress is active so the UI allows access
                teamProgress: {
                    status: p?.status || 'PENDING',
                    submissionData: p?.submissionData || null,
                    reviewerNotes: p?.reviewerNotes || null,
                }
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

// PATCH: Add or remove items in checkpoint progress (for the new lockable panel UI)
export async function PATCH(req: NextRequest) {
    const session = await protect([UserRole.TEAM])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const teamId = session?.user && 'teamId' in session.user ? (session.user as any).teamId : null
    const eventId = session?.user && 'eventId' in session.user ? (session.user as any).eventId : null

    if (!teamId || !eventId) {
        return NextResponse.json({ error: "Unauthorized: Missing team context" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { checkpointId, action, item, itemIndex } = body

        if (!checkpointId || !action) {
            return NextResponse.json({ error: "checkpointId and action required" }, { status: 400 })
        }

        // Get or create progress record (stays PENDING until submit)
        const progress = await prisma.checkpointProgress.findUnique({
            where: { checkpointId_teamId: { checkpointId, teamId } }
        })

        const currentItems: any[] = (progress?.submissionData as any)?.items ?? []

        let newItems: any[]
        if (action === "ADD_ITEM") {
            if (!item?.text?.trim()) return NextResponse.json({ error: "Item text required" }, { status: 400 })
            newItems = [...currentItems, item]
        } else if (action === "REMOVE_ITEM") {
            if (typeof itemIndex !== "number") return NextResponse.json({ error: "itemIndex required" }, { status: 400 })
            newItems = currentItems.filter((_: any, i: number) => i !== itemIndex)
        } else {
            return NextResponse.json({ error: "Unknown action" }, { status: 400 })
        }

        const newSubmissionData = { ...(progress?.submissionData as any ?? {}), items: newItems }

        if (progress) {
            const updated = await prisma.checkpointProgress.update({
                where: { id: progress.id },
                data: { submissionData: newSubmissionData }
            })
            return NextResponse.json(updated)
        } else {
            const created = await prisma.checkpointProgress.create({
                data: {
                    checkpointId,
                    teamId,
                    eventId,
                    status: 'PENDING',
                    submissionData: newSubmissionData,
                }
            })
            return NextResponse.json(created)
        }
    } catch (error) {
        console.error("Patch checkpoint error:", error)
        return NextResponse.json({ error: "Failed to update checkpoint items" }, { status: 500 })
    }
}
