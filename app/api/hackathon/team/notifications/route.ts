import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import * as notifyService from "@/lib/hackathon/notifications"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
    const session = await protect([UserRole.TEAM])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const teamId = (session.user as any).teamId
    const eventId = (session.user as any).eventId

    try {
        const notifications = await notifyService.getAllNotifications({ teamId, eventId })
        return NextResponse.json(notifications)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const session = await protect([UserRole.TEAM])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const { id } = body
        await notifyService.markAsRead(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 })
    }
}
