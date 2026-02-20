"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
    Activity,
    Bell,
    ChevronDown,
    ChevronRight,
    Clock,
    LogOut,
    Search,
    User,
    Shield,
    Terminal
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { Avatar } from "@/components/ui/Avatar"
import { ThemeToggle } from "./ThemeToggle"
import { CountdownTimer } from "@/components/ui/CountdownTimer"
import { NotificationsModal } from "@/components/ui/NotificationsModal"

interface UserTopbarProps {
    teamName: string
    unreadCount?: number
    endsAt?: Date | null
    startsAt?: Date | null
}

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

    return (
        <header
            className="fixed top-4 left-4 right-4 lg:left-8 lg:right-8 z-50 kz-glass-surface border border-black/5 dark:border-white/10 rounded-2xl transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
            <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between gap-8">
                {/* Left: Branding & Status */}
                <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-1">
                    <Link href="/team" className="flex items-center gap-2 sm:gap-3 min-w-0 group">
                        <div className="relative flex items-center">
                            <div className="relative w-8 h-8 flex items-center justify-center transition-all duration-500 z-10">
                                <Image
                                    src="/assets/kaizen-asset.png"
                                    alt="Kaizen"
                                    width={50}
                                    height={50}
                                    unoptimized
                                    priority
                                    className="object-contain"
                                />
                            </div>
                            <div className="w-8 h-8 -ml-3 rounded-lg border-2 border-white dark:border-[#0B0E14] ring-2 ring-indigo-500/20 bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0 group-hover:translate-x-1 transition-transform sm:block hidden">
                                <Avatar name={teamName} size="sm" />
                            </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-heading font-semibold text-[14px] sm:text-[15px] text-slate-900 dark:text-white leading-none tracking-tight">
                                KAIZEN<span className="text-indigo-400">.</span>
                            </span>
                            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-0.5 truncate">{teamName}</span>
                        </div>
                    </Link>

                    <div className="h-5 w-[1px] bg-black/5 dark:bg-white/5 hidden lg:block" />

                    {/* System Meta - hidden on mobile/tablet */}
                    <div className="hidden 2xl:flex items-center gap-3">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">System: <span className="text-emerald-500 dark:text-emerald-400">Active</span></span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                    <ThemeToggle />

                    {/* Bell / Notifications */}
                    <button
                        onClick={() => setNotificationsOpen(true)}
                        className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all group"
                        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                    >
                        <Bell
                            className="w-4.5 h-4.5 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
                            strokeWidth={2}
                        />
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white dark:border-[#0B0E14]" />
                        )}
                    </button>

                    <NotificationsModal
                        isOpen={notificationsOpen}
                        onClose={() => setNotificationsOpen(false)}
                    />

                    {/* Profile Dropdown */}
                    <div ref={profileRef} className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all group"
                            aria-haspopup="true"
                            aria-expanded={profileOpen}
                        >
                            <div className="relative">
                                <Avatar name={teamName} size="sm" className="w-7 h-7 ring-2 ring-black/10 dark:ring-white/10" />
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0B0E14]" />
                            </div>
                            <div className="hidden sm:flex flex-col items-start min-w-0">
                                <span className="text-[12px] font-bold text-slate-900 dark:text-white truncate max-w-[100px] leading-none mb-0.5">{teamName}</span>
                                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Authorized</span>
                            </div>
                            <ChevronDown
                                className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-500 ${profileOpen ? "rotate-180 text-slate-900 dark:text-white" : "group-hover:text-slate-900 dark:group-hover:text-white"}`}
                                strokeWidth={2}
                            />
                        </button>

                        {profileOpen && (
                            <div className="absolute top-14 right-0 w-64 kz-card-rich p-2 kz-animate-scale-in origin-top-right z-50 border-black/10 dark:border-white/10">
                                <div className="px-4 py-4 mb-2 bg-black/5 dark:bg-white/5 rounded-lg relative overflow-hidden group border border-black/5 dark:border-white/5">
                                    <p className="font-heading font-semibold text-sm text-slate-900 dark:text-white truncate relative z-10">{teamName}</p>
                                    <div className="flex items-center gap-2 mt-1 relative z-10">
                                        <Shield className="w-3 h-3 text-slate-400 dark:text-slate-600" strokeWidth={1.5} />
                                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Team Identity: SECURE</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Link
                                        href="/team/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[12px] font-bold text-slate-600 dark:text-slate-300 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                <User className="w-4 h-4" strokeWidth={2} />
                                            </div>
                                            Operational Profile
                                        </div>
                                        <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-rose-500/10 text-[12px] font-bold text-rose-500 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-rose-500/10 dark:border-rose-500/20 flex items-center justify-center text-rose-500/50 group-hover:text-rose-500 transition-colors">
                                            <LogOut className="w-4 h-4" strokeWidth={2} />
                                        </div>
                                        Terminate Session
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
