"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckSquare, Calendar, Bell, User, Layout } from "lucide-react"

const NAV_ITEMS = [
    { name: "Home", href: "/team", icon: Home, label: "Home" },
    { name: "Checkpoints", href: "/team/checkpoints", icon: CheckSquare, label: "Tasks" },
    { name: "Schedule", href: "/team/schedule", icon: Calendar, label: "Schedule" },
    { name: "General", href: "/team/general", icon: Layout, label: "Meta" },
    { name: "Team", href: "/team/profile", icon: User, label: "Team" },
]

export function UserBottomNav() {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-md lg:hidden">
            <nav
                className="bg-[var(--kz-glass-bg)] backdrop-blur-md border border-[var(--kz-glass-border)] rounded-full py-2 px-3 shadow-xl shadow-black/5"
                aria-label="Mobile navigation"
            >
                <div className="flex items-center justify-between gap-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = item.href === "/team"
                            ? pathname === "/team"
                            : pathname.startsWith(item.href)
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                                    ${isActive
                                        ? "bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                    }
                                `}
                                aria-current={isActive ? "page" : undefined}
                            >
                                <Icon className="w-5 h-5" strokeWidth={1.5} />

                                {isActive && (
                                    <div className="absolute -bottom-1.5 w-1 h-1 bg-slate-900 dark:bg-white rounded-full" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
