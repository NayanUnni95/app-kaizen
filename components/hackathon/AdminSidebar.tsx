"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Calendar,
    CheckSquare,
    Upload,
    Bell,
    LogOut,
    ChevronRight,
    Settings
} from "lucide-react"
import { signOut } from "next-auth/react"

const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Teams", href: "/admin/teams", icon: Users },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Checkpoints", href: "/admin/checkpoints", icon: CheckSquare },
    { name: "Submissions", href: "/admin/submissions", icon: Upload },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 h-screen bg-zinc-950 border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-8 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black italic shadow-lg shadow-blue-500/20">
                    K
                </div>
                <span className="font-bold tracking-tight text-white">Admin Panel</span>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-zinc-500 hover:text-white hover:bg-white/5"}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-semibold">{item.name}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 mt-auto space-y-2">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm font-semibold"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
