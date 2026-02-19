import { AdminSidebar } from "@/components/hackathon/AdminSidebar"
import { protect } from "@/lib/hackathon/auth-helpers"
import { UserRole } from "@prisma/client"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Shared protection check for all admin pages
    await protect([UserRole.ADMIN])

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminSidebar />
            <main className="pl-64 min-h-screen">
                <div className="max-w-7xl mx-auto p-10 pb-20">
                    {children}
                </div>
            </main>
        </div>
    )
}
