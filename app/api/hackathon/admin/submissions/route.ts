import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const submissions = await prisma.checkpointProgress.findMany({
            where: { status: { in: ['SUBMITTED', 'APPROVED', 'REJECTED'] } },
            include: {
                team: { select: { name: true } },
                checkpoint: { select: { title: true } },
                event: { select: { name: true } }
            },
            orderBy: { updatedAt: 'desc' }
        })
        return NextResponse.json(submissions)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const { id, status, reviewerNotes } = body

        if (!id || !status) return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

        const updated = await prisma.checkpointProgress.update({
            where: { id },
            data: {
                status,
                reviewerNotes: reviewerNotes || "",
                updatedById: session?.user?.id || 'system'
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: "Failed to review submission" }, { status: 500 })
    }
}
