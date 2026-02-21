import { prisma } from "@/lib/prisma"
import { StatusDashboardClient } from "@/components/ui/StatusDashboardClient"

export default async function StatusPage() {
    const teams = await prisma.team.findMany({
        include: {
            members: {
                where: { isAccepted: true }
            }
        },
        orderBy: { name: 'asc' }
    })

    return <StatusDashboardClient initialTeams={teams} />
}
