"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckSquare, Calendar, Bell, User } from "lucide-react"

const NAV_ITEMS = [
    { name: "Home", href: "/team", icon: Home, label: "Home" },
    { name: "Checkpoints", href: "/team/checkpoints", icon: CheckSquare, label: "Checkpoints" },
    { name: "Schedule", href: "/team/schedule", icon: Calendar, label: "Schedule" },
    { name: "General", href: "/team/general", icon: Bell, label: "General" },
    { name: "Team", href: "/team/profile", icon: User, label: "Team" },
]

export function UserSideNav() {
    const pathname = usePathname()

    return (
        <aside
            className="hidden lg:flex flex-col gap-2 w-64 flex-shrink-0 pt-8 pl-6"
            aria-label="Main navigation"
        >
            <nav className="flex flex-col gap-1.5">
                <div className="px-3 mb-2">
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest pl-1">Menu</p>
                </div>
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
                                group relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                                ${isActive
                                    ? "text-[#0F172A]"
                                    : "text-[#64748B] hover:text-[#334155]"
                                }
                            `}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {/* Active background pill */}
                            {isActive && (
                                <div className="absolute inset-0 bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)] border border-slate-100/60 -z-10 kz-animate-scale-in" />
                            )}

                            {/* Hover background for non-active */}
                            {!isActive && (
                                <div className="absolute inset-0 bg-slate-50/0 group-hover:bg-slate-50/80 rounded-xl -z-10 transition-colors duration-300" />
                            )}

                            <div className={`
                                relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105
                            `}>
                                <Icon
                                    className={`w-[18px] h-[18px] transition-colors duration-300 ${isActive ? "text-[#2563EB]" : "text-[#94A3B8] group-hover:text-[#64748B]"}`}
                                    strokeWidth={isActive ? 2 : 1.75}
                                />
                                {isActive && (
                                    <div className="absolute -inset-2 bg-blue-500/10 rounded-full blur-md opacity-50" />
                                )}
                            </div>

                            <span className={`tracking-tight ${isActive ? "font-semibold" : ""}`}>
                                {item.label}
                            </span>

                            {/* Minimal active dot */}
                            {isActive && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Support / Extra link at bottom */}
            <div className="mt-auto pb-8 px-3">
                <a
                    href="#"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] border border-[#E2E8F0]/60 hover:border-blue-200/50 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#64748B] group-hover:text-blue-600 transition-colors">
                        <span className="font-heading font-bold text-xs">?</span>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-[#334155]">Support</p>
                        <p className="text-[10px] text-[#94A3B8]">Get help</p>
                    </div>
                </a>
            </div>
        </aside>
    )
}
