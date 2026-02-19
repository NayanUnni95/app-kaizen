import { FloatingNav } from "@/components/hackathon/FloatingNav"
import { protect } from "@/lib/hackathon/auth-helpers"
import { UserRole } from "@prisma/client"

export default async function TeamLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await protect([UserRole.TEAM])

    return (
        <div className="min-h-screen bg-black text-white">
            <FloatingNav role="TEAM" />
            <main className="max-w-2xl mx-auto px-6 py-10 pb-32">
                {children}
            </main>
        </div>
    )
}
