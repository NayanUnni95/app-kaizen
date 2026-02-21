import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import { UserRole } from "@prisma/client"
import { prisma } from "@/lib/prisma"

/**
 * GET: Fetch released & visible problem statements for the team's event.
 * Returns { isReleased, statements } so the frontend can decide what to show.
 * - isReleased  = event-level flag  (settings.is_pb_statement_released)
 * - statements  = only those where meta.is_visible === true
 */
export async function GET(req: NextRequest) {
    const session = await protect([UserRole.TEAM])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const eventId = (session.user as any)?.eventId
        if (!eventId) {
            return NextResponse.json({ error: "No event assigned" }, { status: 400 })
        }

        // Fetch the event to check the event-level release flag
        const event = await prisma.event.findUnique({ where: { id: eventId } })
        if (!event) {
            return NextResponse.json({ isReleased: false, statements: [] })
        }

        const settings = (event.settings as any) || {}
        const isReleased = settings.is_pb_statement_released === true

        // If the event hasn't released problem statements, return early
        if (!isReleased) {
            return NextResponse.json({ isReleased: false, statements: [] })
        }

        // Fetch all problem statements for this event
        const allStatements = await prisma.problemStatement.findMany({
            where: { eventId },
            orderBy: { createdAt: "asc" },
        })

        // Filter to only those that are individually marked visible
        const visibleStatements = allStatements.filter((s: any) => {
            const meta = (s.meta as any) || {}
            return meta.is_visible === true
        })

        return NextResponse.json({ isReleased: true, statements: visibleStatements })
    } catch (error) {
        console.error("Fetch team problem statements error:", error)
        return NextResponse.json({ error: "Failed to fetch problem statements" }, { status: 500 })
    }
}
