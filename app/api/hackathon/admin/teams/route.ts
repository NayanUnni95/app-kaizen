import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
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
    } catch (error: any) {
        console.error("Create team error:", error)

        // Handle Prisma unique constraint error
        if (error.code === 'P2002') {
            const targets = error.meta?.target || []
            if (targets.includes('email')) {
                return NextResponse.json({ error: "A team with this email already exists for this event" }, { status: 400 })
            }
            if (targets.includes('username')) {
                return NextResponse.json({ error: "This username is already taken" }, { status: 400 })
            }
        }

        return NextResponse.json({ error: "Failed to create team" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const { id, ...data } = body

        if (!id) {
            return NextResponse.json({ error: "Team ID is required" }, { status: 400 })
        }

        const team = await teamService.updateTeam(id, {
            ...data,
            updatedById: session?.user?.id || "system",
        })
        return NextResponse.json(team)
    } catch (error: any) {
        console.error("Update team error:", error)

        if (error.code === 'P2002') {
            const targets = error.meta?.target || []
            if (targets.includes('email')) {
                return NextResponse.json({ error: "A team with this email already exists for this event" }, { status: 400 })
            }
            if (targets.includes('username')) {
                return NextResponse.json({ error: "This username is already taken" }, { status: 400 })
            }
        }

        return NextResponse.json({ error: "Failed to update team" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const session = await protect([UserRole.ADMIN])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
        return NextResponse.json({ error: "Team ID is required" }, { status: 400 })
    }

    try {
        await teamService.deleteTeam(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Delete team error:", error)
        return NextResponse.json({ error: "Failed to delete team" }, { status: 500 })
    }
}
