"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckSquare, Calendar, Bell, User, Layout, Globe } from "lucide-react"

const NAV_ITEMS = [
    { name: "Home", href: "/team", icon: Home, label: "Home" },
    { name: "Discover", href: "/team/discover", icon: Globe, label: "Units" },
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
                                    relative flex flex-col items-center justify-center w-[52px] h-[52px] rounded-2xl transition-all duration-500
                                    ${isActive
                                        ? "bg-indigo-600/[0.08] dark:bg-indigo-500/[0.12] text-indigo-600 dark:text-indigo-400 shadow-inner border border-indigo-500/10"
                                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                                    }
                                `}
                                aria-current={isActive ? "page" : undefined}
                            >
                                <Icon className={`transition-transform duration-300 ${isActive ? "w-5.5 h-5.5 scale-110" : "w-5 h-5 opacity-60"}`} strokeWidth={isActive ? 2.5 : 2} />

                                {isActive && (
                                    <div className="absolute -bottom-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
