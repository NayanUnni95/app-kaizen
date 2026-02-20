"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckSquare, Calendar, Bell, User } from "lucide-react"

const NAV_ITEMS = [
    { name: "Home", href: "/team", icon: Home, label: "Home" },
    { name: "Checkpoints", href: "/team/checkpoints", icon: CheckSquare, label: "Tasks" },
    { name: "Schedule", href: "/team/schedule", icon: Calendar, label: "Schedule" },
    { name: "Alerts", href: "/team/notifications", icon: Bell, label: "Alerts" },
    { name: "Team", href: "/team/profile", icon: User, label: "Team" },
]

export function UserBottomNav() {
    const pathname = usePathname()

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 backdrop-blur-md border-t border-[#E6E9EE]"
            aria-label="Mobile navigation"
        >
            <div className="flex items-center justify-around h-16 px-2">
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
                                flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-0
                                ${isActive
                                    ? "text-[#2563EB]"
                                    : "text-[#94A3B8] hover:text-[#64748B]"
                                }
                            `}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <div className={`
                                p-1.5 rounded-lg transition-all
                                ${isActive ? "bg-[#EFF6FF]" : ""}
                            `}>
                                <Icon className={`w-5 h-5 ${isActive ? "text-[#2563EB]" : ""}`} />
                            </div>
                            <span className="text-[10px] font-semibold">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
