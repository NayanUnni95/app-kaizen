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
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden kz-glass-surface border-t border-white/5 pb-safe"
            aria-label="Mobile navigation"
        >
            <div className="flex items-center justify-around h-16 px-4">
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
                                relative flex flex-col items-center gap-1 min-w-[64px] transition-all
                                ${isActive
                                    ? "text-indigo-400"
                                    : "text-slate-500"
                                }
                            `}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <div className="p-1 transition-transform group-active:scale-90">
                                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>

                            {isActive && (
                                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
