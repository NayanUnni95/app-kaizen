import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import * as psService from "@/lib/hackathon/problem-statements"
import { UserRole } from "@prisma/client"

/**
 * PATCH: Toggle is_pb_statement_released in event settings
 */
export async function PATCH(req: NextRequest) {
    const session = await protect([UserRole.ADMIN])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const { eventId, is_pb_statement_released } = body

        if (!eventId) {
            return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
        }

        const event = await psService.toggleEventProblemStatementRelease(
            eventId,
            is_pb_statement_released,
            session?.user?.id || "system"
        )
        return NextResponse.json(event)
    } catch (error) {
        console.error("Toggle event release error:", error)
        return NextResponse.json({ error: "Failed to toggle event release" }, { status: 500 })
    }
}
