import { auth } from "@/auth"
import { getTeamBySession } from "@/lib/hackathon/teams"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import TeamDashboardClient from "@/components/ui/TeamDashboardClient"
import { NotificationType } from "@prisma/client"

export default async function TeamDashboardPage() {
    const session = await auth()
    if (!session?.user) redirect("/hackathon-login")

    const team = await getTeamBySession(session.user)
    if (!team) redirect("/team/join")

    const announcements = await prisma.notification.findMany({
        where: {
            eventId: team.eventId,
            teamId: null,
            // @ts-ignore - category exists but prisma client might be out of sync
            category: 'ANNOUNCEMENT',
        } as any,
        orderBy: { createdAt: 'desc' },
        take: 5,
    })

    const allTeams = await prisma.team.count({
        where: { eventId: team.eventId },
    })

    return (
        <TeamDashboardClient
            team={team}
            allTeams={allTeams}
            announcements={announcements}
        />
    )
}
