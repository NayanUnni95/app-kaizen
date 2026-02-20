import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import * as checkpointService from "@/lib/hackathon/checkpoints"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get("eventId") || undefined

    try {
        const checkpoints = await checkpointService.getAllCheckpoints(eventId)
        return NextResponse.json(checkpoints)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch checkpoints" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const checkpoint = await checkpointService.createCheckpoint({
            ...body,
            createdById: session?.user?.id || 'system'
        })
        return NextResponse.json(checkpoint)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create checkpoint" }, { status: 500 })
    }
}
export async function PATCH(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const { id, ...data } = body
        if (!id) return NextResponse.json({ error: "Missing checkpoint ID" }, { status: 400 })

        const checkpoint = await checkpointService.updateCheckpoint(id, {
            ...data,
            updatedById: session?.user?.id || 'system'
        })
        return NextResponse.json(checkpoint)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update checkpoint" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "Missing checkpoint ID" }, { status: 400 })

        await checkpointService.deleteCheckpoint(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete checkpoint" }, { status: 500 })
    }
}
