import { FloatingNav } from "@/components/hackathon/FloatingNav"
import { protect } from "@/lib/hackathon/auth-helpers"
import { UserRole } from "@prisma/client"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await protect([UserRole.ADMIN])

    return (
        <div className="min-h-screen bg-black text-white">
            <FloatingNav role="ADMIN" />
            <main className="min-h-screen">
                <div className="max-w-7xl mx-auto p-10 pb-32">
                    {children}
                </div>
            </main>
        </div>
    )
}
