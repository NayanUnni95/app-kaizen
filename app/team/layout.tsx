import { auth } from "@/auth"
import { getTeamById } from "@/lib/hackathon/teams"
import { protect } from "@/lib/hackathon/auth-helpers"
import { UserRole } from "@prisma/client"
import { UserTopbar } from "@/components/ui/UserTopbar"
import { UserSideNav } from "@/components/ui/UserSideNav"
import { UserBottomNav } from "@/components/ui/UserBottomNav"
import { SplashOverlay } from "@/components/ui/SplashOverlay"
import { prisma } from "@/lib/prisma"

export default async function TeamLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await protect([UserRole.TEAM])

    const session = await auth()
    const teamId = (session?.user as any)?.teamId
    const team = teamId ? await getTeamById(teamId) : null

    // Count unread notifications
    const unreadCount = teamId
        ? await prisma.notification.count({
            where: { teamId, isRead: false }
        })
        : 0

    const teamName = team?.name ?? "Team"
    const endsAt = team?.event?.endsAt ?? null
    const startsAt = team?.event?.startsAt ?? null

    return (
        <div className="kz-user-layout">
            {/* Splash on every load */}
            <SplashOverlay />

            {/* Persistent top bar */}
            <UserTopbar
                teamName={teamName}
                unreadCount={unreadCount}
                endsAt={endsAt}
                startsAt={startsAt}
            />

            {/* Content area: side nav (desktop) + main + bottom nav (mobile) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 lg:pb-10">
                <div className="flex gap-6 lg:gap-8">
                    {/* Left side rail — desktop only */}
                    <UserSideNav />

                    {/* Main content */}
                    <main
                        className="flex-1 min-w-0"
                        id="main-content"
                        tabIndex={-1}
                    >
                        {children}
                    </main>
                </div>
            </div>

            {/* Bottom nav — mobile only */}
            <UserBottomNav />
        </div>
    )
}
