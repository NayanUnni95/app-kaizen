import { NextRequest, NextResponse } from "next/server"
import { protect, isAdmin } from "@/lib/hackathon/auth-helpers"
import * as teamService from "@/lib/hackathon/teams"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get("eventId") || undefined

    try {
        const teams = await teamService.getAllTeams(eventId)
        return NextResponse.json(teams)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const team = await teamService.createTeam({
            ...body,
            createdById: session?.user?.id || 'system'
        })
        return NextResponse.json(team)
    } catch (error) {
        console.error("Create team error:", error)
        return NextResponse.json({ error: "Failed to create team" }, { status: 500 })
    }
}
