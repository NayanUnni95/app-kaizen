"use client"

import { useState } from "react"
import Link from "next/link"
import { CountdownTimer } from "@/components/ui/CountdownTimer"
import { EmptyState } from "@/components/ui/EmptyState"
import { NotificationsModal } from "@/components/ui/NotificationsModal"
import {
    Activity,
    Bell,
    Calendar,
    CheckSquare,
    ChevronRight,
    Clock,
    Lock,
    Users,
    Zap
} from "lucide-react"

export default function TeamDashboardClient({ team, allTeams, announcements }: any) {
    const [notificationsOpen, setNotificationsOpen] = useState(false)

    // Calculate progress
    const now = new Date()
    const startsAt = team.event.startsAt
    const endsAt = team.event.endsAt

    let progressPct = 0
    if (startsAt && endsAt) {
        const start = new Date(startsAt)
        const end = new Date(endsAt)
        const totalDuration = end.getTime() - start.getTime()
        const elapsed = now.getTime() - start.getTime()
        progressPct = Math.round((elapsed / totalDuration) * 100)
        if (progressPct < 0) progressPct = 0
        if (progressPct > 100) progressPct = 100
    }

    const completedCheckpoints = 0
    const totalCheckpoints = 3

    return (
        <div className="space-y-8 pb-12 pt-6">
            <NotificationsModal
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
            />

            {/* ─── Minimal Hero ─────────────────────────────────── */}
            <section className="kz-animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight">
                        Good afternoon, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">{team.name}</span>
                    </h1>
                    <p className="text-[#64748B] text-sm md:text-base mt-2 max-w-xl leading-relaxed">
                        Welcome to your command center. You're competing against {allTeams - 1} other teams.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100/50 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                        <span className="text-xs font-bold text-emerald-700 tracking-wide uppercase">System Active</span>
                    </div>
                </div>
            </section>

            {/* ─── Hero Stats Grid ─────────────────────────────── */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
                <div className="col-span-1 md:col-span-2 kz-card-premium p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-4 h-4 text-blue-500" strokeWidth={2} />
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Time Remaining</span>
                        </div>
                        <div className="font-mono text-3xl sm:text-4xl text-slate-800 tracking-tighter">
                            <CountdownTimer startsAt={team.event.startsAt} endsAt={team.event.endsAt} />
                        </div>
                        <div className="mt-4 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>
                </div>

                <Link href="/team/checkpoints" className="col-span-1 kz-card-premium p-5 flex flex-col justify-between group hover:border-blue-200/50 transition-all hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <CheckSquare className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <span className="text-2xl font-heading font-bold text-slate-800">{completedCheckpoints}/{totalCheckpoints}</span>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-700 text-sm">Checkpoints</p>
                        <p className="text-xs text-slate-400 mt-0.5">Track your progress</p>
                    </div>
                </Link>

                <Link href="/team/profile" className="col-span-1 kz-card-premium p-5 flex flex-col justify-between group hover:border-blue-200/50 transition-all hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                            <Users className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <div className="flex -space-x-2">
                            {team.members.slice(0, 3).map((m: any, i: number) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" title={m.name} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-700 text-sm">Squad Status</p>
                        <p className="text-xs text-slate-400 mt-0.5">{team.members.length} members active</p>
                    </div>
                </Link>
            </section>

            {/* ─── Main Content Grid ────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Announcements */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="font-heading font-semibold text-lg text-[#0F172A] flex items-center gap-2">
                            <Bell className="w-5 h-5 text-blue-500" strokeWidth={2} />
                            Announcements
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {announcements.length === 0 ? (
                            <EmptyState
                                icon={Bell}
                                title="No updates yet"
                                description="Stay tuned! Important announcements will appear here."
                            />
                        ) : (
                            announcements.map((a: any) => (
                                <button
                                    key={a.id}
                                    onClick={() => setNotificationsOpen(true)}
                                    className="w-full text-left block p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold text-sm text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                                    {a.title}
                                                </h3>
                                                <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                                                    {new Date(a.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {a.body && (
                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{a.body}</p>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Quick Actions */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="font-heading font-semibold text-lg text-[#0F172A]">Quick Actions</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <Link href="/team/checkpoints" className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 transition-all hover:scale-[1.02] group">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <CheckSquare className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-sm text-slate-700">Checkpoints</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-1" />
                        </Link>
                        <Link href="/team/schedule" className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 transition-all hover:scale-[1.02] group">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-sm text-slate-700">Schedule</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-1" />
                        </Link>
                        <button onClick={() => setNotificationsOpen(true)} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 transition-all hover:scale-[1.02] group">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                <Bell className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-sm text-slate-700">Notifications</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
