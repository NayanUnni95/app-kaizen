"use client"

import { useState } from "react"
import Link from "next/link"
import { CountdownTimer } from "@/components/ui/CountdownTimer"
import { EmptyState } from "@/components/ui/EmptyState"
import { NotificationsModal } from "@/components/ui/NotificationsModal"
import { ProblemStatementSection } from "@/components/hackathon/ProblemStatementSection"
import {
    Activity,
    Bell,
    Calendar,
    CheckSquare,
    ChevronRight,
    Clock,
    Layout,
    Lock,
    Users,
    Zap,
    Shield,
    Terminal,
    ListChecks
} from "lucide-react"

export default function TeamDashboardClient({ team, allTeams, announcements }: any) {
    const [notificationsOpen, setNotificationsOpen] = useState(false)

    // Calculate progress
    const now = new Date()
    // Hardcoded Event Times (IST)
    // 10:00 AM 21st Feb -> 04:30 UTC
    // 11:00 AM 22nd Feb -> 05:30 UTC
    const startsAt = "2026-02-21T04:30:00.000Z"
    const endsAt = "2026-02-22T05:30:00.000Z"

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
        <div className="space-y-16 pb-24 pt-6 kz-mesh-bg min-h-screen">
            <NotificationsModal
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
            />

            {/* ─── Team Overview Hero ────────────────────────── */}
            <section className="kz-animate-fade-in flex flex-col md:flex-row md:items-start justify-between gap-12 px-2">
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div className="px-3 py-1 rounded-lg bg-indigo-600 text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                            Team Dashboard
                        </div>
                        <div className="kz-status-chip bg-emerald-500/10 border-emerald-500/20 text-emerald-400 py-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            Live Hub
                        </div>
                    </div>
                    <h1 className="font-heading text-3xl md:text-3xl text-white tracking-tight leading-tight py-2">
                        Welcome Back,<br />
                        <span className="text-white inline-block mt-2 text-4xl md:text-5xl font-semibold">{team.name}</span>
                    </h1>
                    <div className="flex items-center gap-6 pt-4 border-t border-white/5 bg-white/[0.01] rounded-b-xl px-4 py-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Competition</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-mono-tech text-white leading-none">{allTeams - 1}</span>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Units Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block">
                    <div className="kz-card-rich p-6 w-72 bg-white/[0.02] border-white/5">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
                            <Activity className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="w-24 h-0.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 rounded-full w-4/5 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                                    </div>
                                    <span className="text-[10px] font-mono-tech font-bold text-slate-600 uppercase">stable_v{i}.0</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Mission Critical KPIs ─────────────────────────── */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
                {/* Global Countdown Card */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 kz-card-rich p-10 flex flex-col justify-between group overflow-hidden border-white/5 bg-white/[0.02]">
                    <div>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                                <Clock className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] leading-none">Event Timer</span>
                                <span className="text-[9px] text-slate-600 font-bold mt-1 uppercase tracking-widest">Status: Operational</span>
                            </div>
                        </div>
                        <div className="font-mono-tech text-4xl sm:text-5xl lg:text-7xl text-white tracking-widest leading-none mb-8 font-bold">
                            <CountdownTimer startsAt={startsAt} endsAt={endsAt} />
                        </div>
                    </div>
                    <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
                                <span className="text-[10px] font-mono-tech font-bold text-white uppercase tracking-[0.2em]">PROG: {progressPct}%</span>
                            </div>
                            <span className="text-[9px] font-mono-tech font-bold text-slate-600 uppercase tracking-widest">SYSTEM_LOAD: 0.82</span>
                        </div>
                        <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                            <div
                                className="h-full bg-white/40 rounded-full transition-all duration-1000"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Milestone Progression - Refined */}
                <div className="col-span-1 flex flex-col gap-6">
                    <div className="flex items-center gap-3 px-1">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <h2 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Pipeline</h2>
                    </div>

                    <Link href="/team/checkpoints" className="kz-card-rich p-8 flex flex-col group transition-all duration-500 hover:bg-white/[0.04] border-white/5 bg-white/[0.02] block h-full">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                                <ListChecks className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Milestones</span>
                                <span className="text-sm font-black text-white mt-1 uppercase tracking-tight">Stage {completedCheckpoints + 1}</span>
                            </div>
                            <div className="ml-auto w-10 h-10 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02] text-[11px] font-mono-tech font-bold text-white">
                                {completedCheckpoints}/{totalCheckpoints}
                            </div>
                        </div>
                        <div className="mt-auto space-y-4">
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-1/3 rounded-full" />
                            </div>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Verification Active</span>
                        </div>
                    </Link>
                </div>

                {/* Squad Composition */}
                <div className="col-span-1 lg:row-span-2">
                    <Link href="/team/profile" className="kz-card-rich p-10 flex flex-col group bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all duration-500 block h-full">
                        <div className="mb-12">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                                <Users className="w-6 h-6" strokeWidth={1.5} />
                            </div>
                        </div>
                        <div className="mt-auto space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-heading font-black text-white text-2xl uppercase tracking-tighter">Team Identity</h3>
                                    <span className="text-[9px] font-mono-tech font-black text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest">Secure</span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-mono-tech font-bold uppercase tracking-[0.3em]">@ Ops_Ready</p>
                            </div>

                            <div className="h-px w-full bg-white/5" />

                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Authorization Layer</p>
                                <p className="text-[11px] text-slate-400 font-bold leading-relaxed opacity-60">Multifactor credentials verified across all local nodes.</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Problem Statement Integration */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <ProblemStatementSection startsAt={startsAt} />
                </div>
            </section>

            {/* ─── Information Streams ─────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 px-2">
                {/* Primary Data Stream: Transmissions */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="flex items-center justify-between border-b border-indigo-500/30 pb-4">
                        <div className="flex flex-col">
                            <h2 className="font-heading font-black text-2xl text-white tracking-tight">
                                Latest Announcements
                            </h2>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Official Event Updates</p>
                        </div>
                        <button className="kz-btn-rich kz-btn-rich-secondary text-[10px] py-1.5 px-4">Archive</button>
                    </div>

                    <div className="space-y-3">
                        {announcements.length === 0 ? (
                            <EmptyState
                                icon={Terminal}
                                title="No Frequency Detected"
                                description="Secure channels are currently quiescent. Monitoring for next mission update."
                            />
                        ) : (
                            announcements.map((a: any) => (
                                <button
                                    key={a.id}
                                    onClick={() => setNotificationsOpen(true)}
                                    className="w-full text-left flex items-start gap-8 p-8 kz-card-rich bg-white/[0.02] border-white/5 hover:border-indigo-500/30 transition-all duration-500 group"
                                >
                                    <div className="kz-icon-rich w-12 h-12 border-white/5 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0">
                                        <Bell className="w-5 h-5 relative z-10" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1">
                                        <div className="flex items-center justify-between gap-4 mb-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-heading font-black text-lg text-white tracking-tight">
                                                    {a.title}
                                                </h3>
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                                {new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        {a.body && (
                                            <p className="text-sm text-slate-400 leading-relaxed font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                                                {a.body}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 mt-6">
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">Read Transmission <ChevronRight className="w-3 h-3" /></span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Direct Command Links */}
                <div className="space-y-10">
                    <div className="border-b border-indigo-500/30 pb-4">
                        <h2 className="font-heading font-black text-2xl text-white tracking-tight">Quick Links</h2>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Fast Navigation</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {[
                            { href: "/team/checkpoints", icon: CheckSquare, label: "Milestones", desc: "Your Progress", color: "indigo" },
                            { href: "/team/schedule", icon: Calendar, label: "Schedule", desc: "Event Timeline", color: "slate" },
                            { href: "/team/general", icon: Layout, label: "Overview", desc: "General Info", color: "indigo" },
                        ].map((item, i) => (
                            <Link key={i} href={item.href} className="group relative">
                                <div className="kz-card-rich p-6 flex items-center gap-5 bg-white/[0.02] border-white/5 hover:border-indigo-500/30 hover:scale-[1.02] transition-all duration-500 active:scale-95">
                                    <div className="kz-icon-rich w-12 h-12 bg-white/5 text-slate-400 border-white/5 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-400 transition-all duration-500 shrink-0">
                                        <item.icon className="w-5 h-5 relative z-10" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-heading font-black text-lg text-white leading-none group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{item.label}</span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">{item.desc}</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-700 ml-auto group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}

                        <button
                            onClick={() => setNotificationsOpen(true)}
                            className="group relative text-left"
                        >
                            <div className="kz-card-rich p-6 flex items-center gap-5 bg-indigo-600/10 hover:bg-indigo-600/20 hover:scale-[1.02] transition-all duration-500 active:scale-95 border-indigo-500/20">
                                <div className="kz-icon-rich w-12 h-12 bg-indigo-600 text-white border-indigo-400 shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                                    <Bell className="w-5 h-5 relative z-10 animate-bounce" style={{ animationDuration: '3s' }} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-heading font-black text-lg text-white leading-none uppercase tracking-tight">Notifications</span>
                                    <span className="text-[10px] text-indigo-400/80 font-bold uppercase tracking-widest mt-1.5">Latest Updates</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-indigo-400/30 ml-auto group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        </button>
                    </div>

                    {/* Section Info Badge */}
                    <div className="kz-card-rich p-6 border-dashed border-2 border-white/5 flex items-center gap-4 bg-white/[0.01]">
                        <Shield className="w-8 h-8 text-slate-600" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Session</span>
                            <p className="text-[11px] text-slate-500 font-bold leading-tight">Your connection is secure and verified for this event session.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
