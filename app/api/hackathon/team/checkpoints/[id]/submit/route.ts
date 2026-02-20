import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function POST(
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
        const body = await req.json()
        const { items } = body

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Progress items required" }, { status: 400 })
        }

        // Check if checkpoint exists
        const checkpoint = await prisma.checkpoint.findUnique({
            where: { id }
        })

        if (!checkpoint) {
            return NextResponse.json({ error: "Checkpoint not found" }, { status: 404 })
        }

        // Check if progress already exists
        const existingProgress = await prisma.checkpointProgress.findUnique({
            where: {
                checkpointId_teamId: {
                    checkpointId: id,
                    teamId
                }
            }
        })

        if (existingProgress) {
            // Already approved?
            if (existingProgress.status === 'APPROVED') {
                return NextResponse.json({ error: "Milestone already verified" }, { status: 400 })
            }

            const updated = await prisma.checkpointProgress.update({
                where: { id: existingProgress.id },
                data: {
                    status: 'SUBMITTED',
                    submissionData: {
                        ...(existingProgress.submissionData as any || {}),
                        items
                    }
                }
            })
            return NextResponse.json(updated)
        }

        const created = await prisma.checkpointProgress.create({
            data: {
                checkpointId: id,
                teamId,
                eventId,
                status: 'SUBMITTED',
                submissionData: { items }
            }
        })

        return NextResponse.json(created)
    } catch (error) {
        console.error("Submit checkpoint error:", error)
        return NextResponse.json({ error: "Failed to submit progress" }, { status: 500 })
    }
}
