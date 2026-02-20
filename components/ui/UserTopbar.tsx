"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
    Home,
    CheckSquare,
    Calendar,
    Bell,
    User,
    ChevronDown,
    LogOut,
    Menu,
    X,
    Clock
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { Avatar } from "@/components/ui/Avatar"
import { CountdownTimer } from "@/components/ui/CountdownTimer"
import { NotificationsModal } from "@/components/ui/NotificationsModal"

interface UserTopbarProps {
    teamName: string
    unreadCount?: number
    endsAt?: Date | null
    startsAt?: Date | null
}

const NAV_ITEMS = [
    { name: "Home", href: "/team", icon: Home },
    { name: "Checkpoints", href: "/team/checkpoints", icon: CheckSquare },
    { name: "Schedule", href: "/team/schedule", icon: Calendar },
    { name: "General", href: "/team/general", icon: Bell },
    { name: "Team", href: "/team/profile", icon: User },
]

export function UserTopbar({ teamName, unreadCount = 0, endsAt, startsAt }: UserTopbarProps) {
    const pathname = usePathname()
    const [profileOpen, setProfileOpen] = useState(false)
    const [timerOpen, setTimerOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const profileRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<HTMLDivElement>(null)

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
            if (timerRef.current && !timerRef.current.contains(e.target as Node)) setTimerOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const currentPage = NAV_ITEMS.find(item =>
        item.href === "/team" ? pathname === "/team" : pathname.startsWith(item.href)
    )

    return (
        <header
            className="fixed top-4 left-4 right-4 z-50 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm transition-all duration-300"
            style={{
                boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(0,0,0,0.02)",
                maxWidth: "1400px",
                margin: "0 auto"
            }}
        >
            <div className="px-5 h-14 flex items-center justify-between gap-4">
                {/* Left: Logo */}
                <Link href="/team" className="flex items-center gap-3 min-w-0 flex-shrink-0 group">
                    <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src="/assets/kaizen-asset.png"
                            alt="Kaizen"
                            width={36}
                            height={36}
                            unoptimized
                            priority
                            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-heading font-bold text-sm text-[#0F172A] leading-none tracking-tight">
                            Kaizen
                        </span>
                        <span className="text-[10px] text-[#64748B] font-medium tracking-wide opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            Dashboard
                        </span>
                    </div>
                </Link>

                {/* Center: Page title (desktop) - Optional, can be removed for cleaner look or kept as breadcrumb */}
                <div className="hidden md:flex items-center px-4 py-1.5 rounded-full bg-slate-50/50 border border-slate-100/50">
                    <span className="text-xs font-semibold text-[#475569] tracking-tight">
                        {currentPage?.name ?? "Overview"}
                    </span>
                </div>

                {/* Right: Timer chip + notifications + profile */}
                <div className="flex items-center gap-3">
                    {/* Compact timer chip - Precision Instrument Look */}
                    {endsAt && (
                        <div ref={timerRef} className="relative">
                            <button
                                onClick={() => setTimerOpen(!timerOpen)}
                                className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 group"
                                aria-label="Hackathon timer"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                                <div className="font-mono text-xs font-semibold text-[#334155] group-hover:text-[#0F172A] transition-colors">
                                    <CountdownTimer startsAt={startsAt} endsAt={endsAt} />
                                </div>
                            </button>

                            {/* Timer dropdown */}
                            {timerOpen && (
                                <div className="absolute top-12 right-0 w-80 kz-card-premium p-5 kz-animate-scale-in origin-top-right z-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Time Remaining</p>
                                        <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                                    </div>
                                    <CountdownTimer startsAt={startsAt} endsAt={endsAt} />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

                    {/* Bell */}
                    <button
                        onClick={() => setNotificationsOpen(true)}
                        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors group"
                        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                    >
                        <Bell
                            className="w-[18px] h-[18px] text-[#64748B] group-hover:text-[#0F172A] transition-colors"
                            strokeWidth={2}
                        />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#F43F5E] rounded-full border-2 border-white shadow-sm scale-110" />
                        )}
                    </button>

                    <NotificationsModal
                        isOpen={notificationsOpen}
                        onClose={() => setNotificationsOpen(false)}
                    />

                    {/* Profile dropdown */}
                    <div ref={profileRef} className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                            aria-haspopup="true"
                            aria-expanded={profileOpen}
                        >
                            <Avatar name={teamName} size="sm" className="w-7 h-7 ring-2 ring-white shadow-sm" />
                            <ChevronDown
                                className={`w-3 h-3 text-[#94A3B8] hidden sm:block transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`}
                                strokeWidth={2.5}
                            />
                        </button>

                        {profileOpen && (
                            <div className="absolute top-12 right-0 w-56 kz-card-premium p-1.5 kz-animate-scale-in origin-top-right z-50">
                                <div className="px-3 py-2.5 mb-1 bg-slate-50/50 rounded-xl border border-slate-100/50">
                                    <p className="font-heading font-semibold text-sm text-[#0F172A] truncate">{teamName}</p>
                                    <p className="text-[10px] font-medium text-[#64748B] uppercase tracking-wide mt-0.5">Team Member</p>
                                </div>
                                <div className="space-y-0.5">
                                    <Link
                                        href="/team/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F1F5F9] text-sm text-[#334155] font-medium transition-colors"
                                    >
                                        <User className="w-4 h-4 text-[#94A3B8]" strokeWidth={1.75} />
                                        Team Profile
                                    </Link>
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-50 text-sm text-[#E11D48] font-medium transition-colors group"
                                    >
                                        <LogOut className="w-4 h-4 text-[#FDA4AF] group-hover:text-[#F43F5E] transition-colors" strokeWidth={1.75} />
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
