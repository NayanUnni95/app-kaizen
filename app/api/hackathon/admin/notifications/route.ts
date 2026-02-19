import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import * as notifyService from "@/lib/hackathon/notifications"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get("eventId") || undefined

    try {
        const notifications = await notifyService.getAllNotifications({ eventId })
        return NextResponse.json(notifications)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const notification = await notifyService.createNotification({
            ...body,
            createdById: session?.user?.id || 'system'
        })
        return NextResponse.json(notification)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
    }
}
