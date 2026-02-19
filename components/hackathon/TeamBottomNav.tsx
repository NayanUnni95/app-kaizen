"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    User,
    Bell,
    Loader2
} from "lucide-react"
import { useEffect, useState } from "react"

const navItems = [
    { name: "Home", href: "/team", icon: LayoutDashboard },
    { name: "Checkpoints", href: "/team/checkpoints", icon: CheckSquare },
    { name: "Schedule", href: "/team/schedule", icon: Calendar },
    { name: "Notifications", href: "/team/notifications", icon: Bell },
    { name: "Profile", href: "/team/profile", icon: User },
]

export function TeamBottomNav() {
    const pathname = usePathname()
    const [isPending, setIsPending] = useState(false)
    const [pendingPath, setPendingPath] = useState<string | null>(null)

    useEffect(() => {
        setIsPending(false)
        setPendingPath(null)
    }, [pathname])

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none md:max-w-md md:mx-auto">
            <nav className="flex items-center justify-around p-2 bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto">
                {navItems.map((item) => {
                    const isActive = item.href === "/team"
                        ? pathname === "/team"
                        : pathname.startsWith(item.href)

                    const isLoading = isPending && pendingPath === item.href

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => {
                                if (pathname !== item.href) {
                                    setIsPending(true)
                                    setPendingPath(item.href)
                                }
                            }}
                            className={`
                                relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300
                                ${isActive
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105"
                                    : "text-zinc-500 hover:text-white"}
                            `}
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                            )}
                            {/* <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.name}</span> */}
                            {isActive && (
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                            )}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
