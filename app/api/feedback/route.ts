import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, description } = body

        if (!email || !description) {
            return NextResponse.json({ error: "Email and description are required" }, { status: 400 })
        }

        await prisma.appFeedback.create({
            data: { email, description }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Feedback error:", error)
        return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
    }
}

export async function GET() {
    try {
        const feedbackList = await prisma.appFeedback.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(feedbackList)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
    }
}
