import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import * as psService from "@/lib/hackathon/problem-statements"
import { UserRole } from "@prisma/client"

/**
 * GET: Fetch released & visible problem statements for the team's event
 */
export async function GET(req: NextRequest) {
    const session = await protect([UserRole.TEAM])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const eventId = (session.user as any)?.eventId
        if (!eventId) {
            return NextResponse.json({ error: "No event assigned" }, { status: 400 })
        }

        const statements = await psService.getReleasedProblemStatementsForEvent(eventId)
        return NextResponse.json(statements)
    } catch (error) {
        console.error("Fetch team problem statements error:", error)
        return NextResponse.json({ error: "Failed to fetch problem statements" }, { status: 500 })
    }
}
