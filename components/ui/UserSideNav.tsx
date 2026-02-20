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
    Terminal,
    Globe
} from "lucide-react"

const NAV_ITEMS = [
    { label: "Dashboard", href: "/team", icon: LayoutDashboard, tag: "Live" },
    { label: "Discover", href: "/team/discover", icon: Globe },
    { label: "Overview", href: "/team/general", icon: Layers },
    { label: "Milestones", href: "/team/checkpoints", icon: ListChecks, badge: "3" },
    { label: "Schedule", href: "/team/schedule", icon: History },
    { label: "Profile", href: "/team/profile", icon: Users },
]

export function UserSideNav() {
    const pathname = usePathname()

    return (
        <aside
            className="hidden lg:flex flex-col gap-8 w-56 flex-shrink-0 pt-10 pl-0 pr-8 border-r border-black/5 dark:border-white/5 bg-transparent"
            aria-label="Main navigation"
        >
            {/* Workspace Header - Human SaaS Pattern */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] cursor-pointer transition-all duration-300 group shadow-sm shadow-black/5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                        <Terminal className="w-4.5 h-4.5" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[12px] font-bold text-slate-900 dark:text-white leading-none tracking-tight">Kaizen ‘26</span>
                        <span className="text-[9px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-1">Hackathon</span>
                    </div>
                    <ChevronRight className="w-3 h-3 ml-auto text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white rotate-90 transition-colors" />
                </div>

                <div className="flex items-center justify-between px-3">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Menu</p>
                    <button className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                        <Search className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                </div>
            </div>

            <nav className="flex flex-col gap-1 px-1">
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
                                group relative flex items-center justify-between gap-4 px-3 py-2 rounded-lg transition-all duration-500
                                ${isActive
                                    ? "bg-indigo-600/5 dark:bg-indigo-500/[0.08] text-indigo-600 dark:text-indigo-400"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                                }
                            `}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {/* Active Glint & Marker */}
                            {isActive && (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.05] to-transparent opacity-50 rounded-lg" />
                                    <div className="absolute left-0 w-[2px] h-3 bg-indigo-600 dark:bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.4)]" />
                                </>
                            )}

                            <div className="flex items-center gap-3.5 relative z-10">
                                <Icon
                                    className={`w-[17px] h-[17px] transition-all duration-300 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400/80 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span className={`text-[13px] tracking-tight leading-none ${isActive ? "font-black" : "font-bold text-slate-500/90 dark:text-slate-500/90"}`}>
                                    {item.label}
                                </span>
                            </div>

                            {/* Supplementary Metadata */}
                            <div className="flex items-center gap-2 relative z-10">
                                {item.tag && (
                                    <div className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${isActive ? "bg-indigo-600/10 text-indigo-600" : "bg-black/[0.04] dark:bg-white/[0.04] text-slate-500"}`}>
                                        {item.tag}
                                    </div>
                                )}
                                {item.badge && !isActive && (
                                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[8px] font-black shadow-lg shadow-indigo-600/20">
                                        {item.badge}
                                    </div>
                                )}
                                <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-[8.5px] font-black text-slate-400 dark:text-slate-600 transition-all duration-300 ${isActive ? "opacity-30 group-hover:opacity-100" : "opacity-0 group-hover:opacity-60"}`}>
                                    <Command className="w-2 h-2" strokeWidth={3} />
                                    <span>{item.label[0]}</span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* Official Branding Block — Ultra Minimal */}
            <div className="mt-auto pb-10 pt-8 border-t border-black/5 dark:border-white/5">
                <div className="flex flex-col gap-1.5 px-3">
                    <span className="font-heading font-black text-2xl text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                        KAIZEN
                    </span>
                    <div className="flex flex-col gap-0.5 opacity-60">
                        <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] leading-none">
                            System Node 4.0
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
                            Tech Competition Framework
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
