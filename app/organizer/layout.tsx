import { OrganizerSidebar } from "@/components/hackathon/OrganizerSidebar"
import { protect } from "@/lib/hackathon/auth-helpers"
import { UserRole } from "@prisma/client"

export default async function OrganizerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Shared protection check for all organizer pages
    await protect([UserRole.ORGANIZER, UserRole.ADMIN])

    return (
        <div className="min-h-screen bg-black text-white">
            <OrganizerSidebar />
            <main className="pl-64 min-h-screen">
                <div className="max-w-7xl mx-auto p-10 pb-20">
                    {children}
                </div>
            </main>
        </div>
    )
}
