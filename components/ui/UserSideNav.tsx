"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import {
    LayoutDashboard,
    Layers,
    ListChecks,
    History,
    Users,
    ChevronRight,
    Star,
    LifeBuoy
} from "lucide-react"

const NAV_ITEMS = [
    { label: "Dashboard", href: "/team", icon: LayoutDashboard, tag: "Live" },
    { label: "Overview", href: "/team/general", icon: Layers },
    { label: "Milestones", href: "/team/checkpoints", icon: ListChecks, badge: "3" },
    { label: "Schedule", href: "/team/schedule", icon: History },
    { label: "Profile", href: "/team/profile", icon: Users },
]

export function UserSideNav() {
    const pathname = usePathname()

    return (
        <aside
            className="hidden lg:flex flex-col gap-10 w-72 flex-shrink-0 pt-12 pl-6 pr-4 border-r border-white/5 bg-transparent"
            aria-label="Main navigation"
        >
            {/* Nav Group */}
            <nav className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-4 mb-6">
                    <p className="text-[10px] font-extrabold text-slate-600 uppercase tracking-[0.25em]">System Hub</p>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                    </div>
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
                                group relative flex items-center justify-between gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500
                                ${isActive
                                    ? "bg-indigo-600/10 text-white border-indigo-500/30 ring-1 ring-indigo-500/20"
                                    : "text-slate-500 hover:text-white hover:bg-white/5 border border-transparent"
                                }
                            `}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`
                                    relative w-5 h-5 flex items-center justify-center transition-all duration-500
                                    ${isActive ? "text-indigo-400" : "text-slate-600 group-hover:text-indigo-400"}
                                `}>
                                    <Icon
                                        className="w-full h-full"
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 blur-xl rounded-full transition-all" />
                                    )}
                                </div>

                                <span className={`text-[13px] tracking-tight ${isActive ? "font-bold" : "font-semibold"}`}>
                                    {item.label}
                                </span>
                            </div>

                            {/* Supplementary Metadata */}
                            <div className="flex items-center gap-2">
                                {item.tag && (
                                    <div className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${isActive ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-500 border border-white/5"}`}>
                                        {item.tag}
                                    </div>
                                )}
                                {item.badge && !isActive && (
                                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-extrabold border-2 border-[#0B0E14]">
                                        {item.badge}
                                    </div>
                                )}
                                <ChevronRight className={`w-3 h-3 transition-all duration-500 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                            </div>

                            {/* Premium border highlight for active */}
                            {isActive && (
                                <div className="absolute inset-[1px] border border-white/10 rounded-[15px] pointer-events-none" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Premium Meta Block */}
            <div className="mt-auto pb-12">
                <div className="kz-card-rich p-5 group cursor-pointer overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <LifeBuoy className="w-4.5 h-4.5 group-hover:rotate-45 transition-transform duration-700" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black text-white uppercase tracking-widest">Support</span>
                                <span className="text-[10px] text-slate-500 font-bold">Priority Line</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mb-4">
                            Connect with event directors for technical clearance or squad adjustments.
                        </p>
                        <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">Get Aid</span>
                            <div className="flex -space-x-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-4 h-4 rounded-full border border-[#0B0E14] bg-slate-900" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
