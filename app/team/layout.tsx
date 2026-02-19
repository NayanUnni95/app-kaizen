import { TeamBottomNav } from "@/components/hackathon/TeamBottomNav"
import { protect } from "@/lib/hackathon/auth-helpers"
import { UserRole } from "@prisma/client"

export default async function TeamLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Shared protection check for all team pages
    await protect([UserRole.TEAM])

    return (
        <div className="min-h-screen bg-black text-white pb-32">
            <main className="max-w-xl mx-auto px-6 py-10">
                {children}
            </main>
            <TeamBottomNav />
        </div>
    )
}
