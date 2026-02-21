import { NextRequest, NextResponse } from "next/server"
import { protect } from "@/lib/hackathon/auth-helpers"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
    const session = await protect([UserRole.TEAM])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const teamId = session?.user && 'teamId' in session.user ? (session.user as any).teamId : null
    const eventId = session?.user && 'eventId' in session.user ? (session.user as any).eventId : null

    if (!teamId) return NextResponse.json({ error: "No team context" }, { status: 400 })

    try {
        const submission = await prisma.submission.findFirst({
            where: { teamId },
            orderBy: { version: 'desc' }
        })

        const event = await prisma.event.findUnique({ where: { id: eventId } })
        const settings = event?.settings as any || {}
        const isSubmissionEnabled = settings.is_submission_enabled ?? false
        const resubmissionAllowed = settings.resubmission_allowed ?? true

        return NextResponse.json({
            ...submission,
            isSubmissionEnabled,
            resubmissionAllowed
        })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch submission" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await protect([UserRole.TEAM])
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const teamId = session?.user && 'teamId' in session.user ? (session.user as any).teamId : null
    const eventId = session?.user && 'eventId' in session.user ? (session.user as any).eventId : null

    if (!teamId || !eventId) return NextResponse.json({ error: "Missing context" }, { status: 400 })

    try {
        const body = await req.json()
        const { title, description, repoUrl, demoUrl } = body

        if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 })

        // Check if event allows submissions
        const event = await prisma.event.findUnique({ where: { id: eventId } })
        const settings = event?.settings as any || {}
        const isSubmissionEnabled = settings.is_submission_enabled ?? false
        const resubmissionAllowed = settings.resubmission_allowed ?? true

        if (!isSubmissionEnabled) {
            return NextResponse.json({ error: "Submissions are currently locked by the organizers." }, { status: 403 })
        }

        // Check for existing
        const existing = await prisma.submission.findFirst({
            where: { teamId },
            orderBy: { version: 'desc' }
        })

        if (existing && !resubmissionAllowed) {
            return NextResponse.json({ error: "Resubmission is not allowed for this event." }, { status: 403 })
        }

        // Update team meta
        const team = await prisma.team.findUnique({ where: { id: teamId } })
        await prisma.team.update({
            where: { id: teamId },
            data: {
                meta: {
                    ...(team?.meta as any || {}),
                    hasSubmittedProject: true,
                    projectSubmittedAt: new Date()
                }
            }
        })

        if (existing) {
            const updated = await prisma.submission.update({
                where: { id: existing.id },
                data: {
                    title,
                    description,
                    repoUrl,
                    demoUrl,
                    version: { increment: 1 },
                    submittedAt: new Date(),
                    // updatedById: session.user.id
                }
            })
            return NextResponse.json(updated)
        }
        const created = await prisma.submission.create({
            data: {
                title,
                description,
                repoUrl,
                demoUrl,
                teamId,
                eventId,
                status: 'SUBMITTED',
                submittedAt: new Date(),
                // createdById: session.user.id,
                // updatedById: session.user.id
            }
        })

        return NextResponse.json(created)
    } catch (error) {
        console.error("Submission error:", error)
        return NextResponse.json({ error: "Failed to process submission" }, { status: 500 })
    }
}
