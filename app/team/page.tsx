// app/team/page.tsx
import { auth } from "@/auth"
import { getTeamBySession } from "@/lib/hackathon/teams"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import TeamDashboardClient from "@/components/ui/TeamDashboardClient"

export default async function TeamDashboardPage() {
    const session = await auth()
    // If not signed in, send to explicit signin page
    if (!session?.user) redirect("/hackathon-login")

    const team = await getTeamBySession(session.user)
    // If signed in but no team, send to team-join/create flow
    if (!team) redirect("/team/join")

    // Fetch announcements (using Notification model)
    const announcements = await prisma.notification.findMany({
        where: {
            eventId: team.eventId,
            teamId: null,
            category: 'ANNOUNCEMENT'
        } as any, // Global announcements
        orderBy: { createdAt: 'desc' },
        take: 5
    })

    // Quick stats from event
    const allTeams = await prisma.team.count({ where: { eventId: team.eventId } })

    return (
        <TeamDashboardClient
            team={team}
            allTeams={allTeams}
            announcements={announcements}
        />
    )
}
