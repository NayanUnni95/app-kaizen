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
            <div className="max-w-[1600px] mx-auto px-8 lg:px-12 pt-24 pb-24 lg:pb-10">
                <div className="flex gap-12 lg:gap-16">
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

                <footer className="py-8 text-center space-y-2">
                    <p className="text-zinc-600 text-sm">© 2026 Sathwa, College of Engineering Muttathara.</p>
                    <p className="text-zinc-500 text-[10px] font-bold capitalize tracking-widest">
                        Platform developed by <a href="https://github.com/NayanUnni95" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors underline decoration-zinc-700 underline-offset-4">Nayan</a> and <a href="https://www.linkedin.com/in/clifincletus" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors underline decoration-zinc-700 underline-offset-4">Clifin</a>
                    </p>
                </footer>
            </div>

            {/* Bottom nav — mobile only */}
            <UserBottomNav />
        </div>
    )
}
