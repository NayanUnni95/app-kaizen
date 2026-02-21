import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import * as eventService from "@/lib/hackathon/events"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const events = await eventService.getAllEvents()
        return NextResponse.json(events)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await protect([UserRole.ADMIN])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const event = await eventService.createEvent({
            ...body,
            createdById: session?.user?.id || 'system'
        })
        return NextResponse.json(event)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const { id, ...data } = body
        if (!id) return NextResponse.json({ error: "Event ID is required" }, { status: 400 })

        const event = await eventService.updateEvent(id, {
            ...data,
            updatedById: session?.user?.id || 'system'
        })
        return NextResponse.json(event)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
    }
}
