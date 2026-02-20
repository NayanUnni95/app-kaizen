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
    LifeBuoy,
    Command,
    Search,
    Plus,
    Terminal
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
            className="hidden lg:flex flex-col gap-10 w-52 flex-shrink-0 pt-12 pl-0 pr-6 border-r border-black/5 dark:border-white/5 bg-transparent"
            aria-label="Main navigation"
        >
            {/* Workspace Header - Human SaaS Pattern */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/[0.08] dark:hover:bg-white/[0.08] cursor-pointer transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <Terminal className="w-4.5 h-4.5" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[12px] font-bold text-slate-900 dark:text-white leading-none">Kaizen ‘26</span>
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Hackathon</span>
                    </div>
                    <ChevronRight className="w-3 h-3 ml-auto text-slate-500 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white rotate-90" />
                </div>

                <div className="flex items-center justify-between px-3">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Navigation</p>
                    <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <Search className="w-3 h-3" strokeWidth={2.5} />
                    </button>
                </div>
            </div>

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
                                group relative flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg transition-all duration-300
                                ${isActive
                                    ? "bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                                }
                            `}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {/* Active Marker - Vertical SaaS pattern */}
                            {isActive && (
                                <div className="absolute left-[-12px] top-2 bottom-2 w-[3px] bg-indigo-500 rounded-r-full" />
                            )}

                            <div className="flex items-center gap-3">
                                <div className={`
                                    relative w-4.5 h-4.5 flex items-center justify-center transition-all duration-300
                                    ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"}
                                `}>
                                    <Icon
                                        className="w-full h-full"
                                        strokeWidth={1.5}
                                    />
                                </div>

                                <span className={`text-[13px] tracking-tight ${isActive ? "font-semibold" : "font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"}`}>
                                    {item.label}
                                </span>
                            </div>

                            {/* Supplementary Metadata */}
                            <div className="flex items-center gap-2">
                                {item.tag && (
                                    <div className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${isActive ? "bg-indigo-600 text-white" : "bg-black/5 dark:bg-white/5 text-slate-500 border border-black/5 dark:border-white/5"}`}>
                                        {item.tag}
                                    </div>
                                )}
                                {item.badge && !isActive && (
                                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-extrabold border-2 border-white dark:border-[#0B0E14]">
                                        {item.badge}
                                    </div>
                                )}
                                <ChevronRight className={`w-3 h-3 transition-all duration-500 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                            </div>

                            {/* Command Hint - Linear Pattern */}
                            {isActive && (
                                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[9px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Command className="w-2 h-2" />
                                    <span>G</span>
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Official Branding Block — Refined */}
            <div className="mt-auto pb-8 pt-8 border-t border-black/5 dark:border-white/5">
                <div className="flex flex-col gap-1 px-1">
                    <span className="font-heading font-semibold text-xl text-slate-900 dark:text-white tracking-widest uppercase leading-none">
                        KAIZEN
                    </span>
                    <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
                        part of SATHWA 26
                    </span>
                    <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5 leading-relaxed">
                        College of Engineering,<br />Muttathara
                    </span>
                </div>
            </div>
        </aside>
    )
}
