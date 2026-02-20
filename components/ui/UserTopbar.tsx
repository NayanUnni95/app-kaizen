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
    X
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { Avatar } from "@/components/ui/Avatar"
import { CountdownTimer } from "@/components/ui/CountdownTimer"

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
    { name: "Notifications", href: "/team/notifications", icon: Bell },
    { name: "Team", href: "/team/profile", icon: User },
]

export function UserTopbar({ teamName, unreadCount = 0, endsAt, startsAt }: UserTopbarProps) {
    const pathname = usePathname()
    const [profileOpen, setProfileOpen] = useState(false)
    const [timerOpen, setTimerOpen] = useState(false)
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
            className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E6E9EE]"
            style={{ boxShadow: "0 1px 3px rgb(0 0 0 / 0.06)" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                {/* Left: Logo */}
                <Link href="/team" className="flex items-center gap-2.5 min-w-0 flex-shrink-0">
                    <div className="relative w-8 h-8">
                        <Image src="/assets/kaizen-asset.png" alt="Kaizen" fill className="object-contain" />
                    </div>
                    <span className="font-heading font-bold text-base text-[#0F172A] hidden sm:block">
                        Kaizen
                    </span>
                </Link>

                {/* Center: Page title (desktop) */}
                <div className="hidden md:flex items-center">
                    <span className="text-sm font-semibold text-[#64748B]">
                        {currentPage?.name ?? "Dashboard"}
                    </span>
                </div>

                {/* Right: Timer chip + notifications + profile */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Compact timer chip */}
                    {endsAt && (
                        <div ref={timerRef} className="relative">
                            <button
                                onClick={() => setTimerOpen(!timerOpen)}
                                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-sm font-semibold text-[#2563EB] hover:bg-[#DBEAFE] transition-all hover:shadow-sm"
                                aria-label="Hackathon timer"
                            >
                                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                                <CountdownTimer startsAt={startsAt} endsAt={endsAt} />
                            </button>

                            {/* Timer dropdown */}
                            {timerOpen && (
                                <div className="absolute top-10 right-0 w-80 bg-white border border-[#E6E9EE] rounded-2xl shadow-xl p-5 kz-animate-scale-in">
                                    <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">Hackathon Countdown</p>
                                    <CountdownTimer startsAt={startsAt} endsAt={endsAt} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bell */}
                    <Link
                        href="/team/notifications"
                        className="kz-icon-container w-10 h-10 bg-slate-50 hover:bg-slate-100 transition-colors"
                        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                    >
                        <Bell className="w-5 h-5 text-[#64748B]" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#DC2626] rounded-full border-2 border-white" />
                        )}
                    </Link>

                    {/* Profile dropdown */}
                    <div ref={profileRef} className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 px-1 py-1 rounded-2xl hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-slate-100"
                            aria-haspopup="true"
                            aria-expanded={profileOpen}
                        >
                            <Avatar name={teamName} size="sm" />
                            <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] hidden sm:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                        </button>

                        {profileOpen && (
                            <div className="absolute top-12 right-0 w-52 bg-white border border-[#E6E9EE] rounded-2xl shadow-xl overflow-hidden kz-animate-scale-in">
                                <div className="px-4 py-3 border-b border-[#E6E9EE]">
                                    <p className="font-semibold text-sm text-[#0F172A] truncate">{teamName}</p>
                                    <p className="text-xs text-[#64748B]">Member</p>
                                </div>
                                <div className="p-1.5">
                                    <Link
                                        href="/team/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] text-sm text-[#0F172A] font-medium transition-colors"
                                    >
                                        <User className="w-4 h-4 text-[#64748B]" />
                                        Team Profile
                                    </Link>
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#FEE2E2] text-sm text-[#DC2626] font-medium transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
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
