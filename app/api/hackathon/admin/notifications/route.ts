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
export async function PATCH(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const { id, ...data } = body
        if (!id) return NextResponse.json({ error: "Missing notification ID" }, { status: 400 })

        const notification = await notifyService.updateNotification(id, data)
        return NextResponse.json(notification)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "Missing notification ID" }, { status: 400 })

        await notifyService.deleteNotification(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 })
    }
}
