import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import * as psService from "@/lib/hackathon/problem-statements"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
    const session = await protect([UserRole.ADMIN, UserRole.ORGANIZER])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get("eventId") || undefined

    try {
        const statements = await psService.getAllProblemStatements(eventId)
        return NextResponse.json(statements)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch problem statements" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await protect([UserRole.ADMIN])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const { is_visible, meta, ...rest } = body

        const userId = session?.user?.id
        if (!userId || userId === "system") {
            return NextResponse.json({ error: "Valid User ID is required" }, { status: 401 })
        }

        const statement = await psService.createProblemStatement({
            ...rest,
            meta: {
                ...(meta || {}),
                is_visible: Boolean(is_visible ?? meta?.is_visible ?? false)
            },
            createdById: userId,
        })
        return NextResponse.json(statement)
    } catch (error) {
        console.error("Create problem statement error:", error)
        return NextResponse.json({ error: "Failed to create problem statement" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const session = await protect([UserRole.ADMIN])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const { id, is_visible, meta, ...updateData } = body

        if (!id) {
            return NextResponse.json({ error: "Problem statement ID is required" }, { status: 400 })
        }

        const userId = session?.user?.id
        if (!userId || userId === "system") {
            return NextResponse.json({ error: "Valid User ID is required" }, { status: 401 })
        }

        console.log("[DEBUG] PUT userId:", userId, "| full session.user:", JSON.stringify(session?.user))

        const statement = await psService.updateProblemStatement(id, {
            ...updateData,
            meta: (meta || is_visible !== undefined) ? {
                ...(meta || {}),
                ...(is_visible !== undefined ? { is_visible: Boolean(is_visible) } : {})
            } : undefined,
            updatedById: userId,
        })
        return NextResponse.json(statement)
    } catch (error) {
        console.error("Update problem statement error:", error)
        return NextResponse.json({ error: "Failed to update problem statement" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const session = await protect([UserRole.ADMIN])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const { id, is_visible } = body

        if (!id) {
            return NextResponse.json({ error: "Problem statement ID is required" }, { status: 400 })
        }

        const userId = session?.user?.id
        if (!userId || userId === "system") {
            return NextResponse.json({ error: "Valid User ID is required" }, { status: 401 })
        }

        const statement = await psService.toggleProblemStatementVisibility(
            id,
            is_visible,
            userId
        )
        return NextResponse.json(statement)
    } catch (error) {
        console.error("Toggle visibility error:", error)
        return NextResponse.json({ error: "Failed to toggle visibility" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const session = await protect([UserRole.ADMIN])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Problem statement ID is required" }, { status: 400 })
        }

        await psService.deleteProblemStatement(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Delete problem statement error:", error)
        return NextResponse.json({ error: "Failed to delete problem statement" }, { status: 500 })
    }
}
