import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import * as teamService from "@/lib/hackathon/teams"
import { UserRole } from "@prisma/client"

/**
 * GET: Fetch members for a team
 * POST: Add a member to a team
 * PUT: Update a member
 * DELETE: Remove a member
 */

export async function GET(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get("teamId")

    if (!teamId) {
        return NextResponse.json({ error: "Team ID is required" }, { status: 400 })
    }

    try {
        const members = await teamService.getTeamMembers(teamId)
        return NextResponse.json(members)
    } catch (error) {
        console.error("Fetch members error:", error)
        return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const { teamId, name, role } = body

        if (!teamId || !name) {
            return NextResponse.json({ error: "Team ID and name are required" }, { status: 400 })
        }

        const member = await teamService.addTeamMember(teamId, {
            name,
            role,
            createdById: session?.user?.id || "system",
        })
        return NextResponse.json(member)
    } catch (error) {
        console.error("Add member error:", error)
        return NextResponse.json({ error: "Failed to add member" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const { id, name, role, isAccepted, meta } = body

        if (!id) {
            return NextResponse.json({ error: "Member ID is required" }, { status: 400 })
        }

        const member = await teamService.updateTeamMember(id, {
            name,
            role,
            isAccepted,
            meta,
            updatedById: session?.user?.id || "system",
        })
        return NextResponse.json(member)
    } catch (error) {
        console.error("Update member error:", error)
        return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const session = await protect([UserRole.ADMIN])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
        return NextResponse.json({ error: "Member ID is required" }, { status: 400 })
    }

    try {
        await teamService.deleteTeamMember(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Delete member error:", error)
        return NextResponse.json({ error: "Failed to delete member" }, { status: 500 })
    }
}
