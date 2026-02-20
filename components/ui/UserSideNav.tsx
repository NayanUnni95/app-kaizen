"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckSquare, Calendar, Bell, User } from "lucide-react"

const NAV_ITEMS = [
    { name: "Home", href: "/team", icon: Home, label: "Home" },
    { name: "Checkpoints", href: "/team/checkpoints", icon: CheckSquare, label: "Checkpoints" },
    { name: "Schedule", href: "/team/schedule", icon: Calendar, label: "Schedule" },
    { name: "Alerts", href: "/team/notifications", icon: Bell, label: "Alerts" },
    { name: "Team", href: "/team/profile", icon: User, label: "Team" },
]

export function UserSideNav() {
    const pathname = usePathname()

    return (
        <aside
            className="hidden lg:flex flex-col gap-1 w-56 flex-shrink-0 pt-4"
            aria-label="Main navigation"
        >
            <nav className="flex flex-col gap-1">
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
                                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                                ${isActive
                                    ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-sm"
                                    : "text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
                                }
                            `}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <div className={`
                                w-8 h-8 rounded-lg flex items-center justify-center transition-all
                                ${isActive ? "bg-white shadow-[0_1px_2px_rgba(37,99,235,0.1)] border border-blue-100" : "bg-transparent group-hover:bg-white group-hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)]"}
                            `}>
                                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-[#2563EB]" : "text-[#94A3B8] group-hover:text-[#64748B]"}`} />
                            </div>
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
