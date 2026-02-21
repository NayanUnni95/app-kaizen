import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const projectSubmissions = await prisma.submission.findMany({
            include: {
                team: { select: { name: true } },
                event: { select: { name: true } }
            },
            orderBy: { submittedAt: 'desc' }
        })
        return NextResponse.json(projectSubmissions)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch project submissions" }, { status: 500 })
    }
}
