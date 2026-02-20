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
        <div className="space-y-12 pb-24 pt-6 kz-mesh-bg min-h-screen">
            <NotificationsModal
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
            />

            {/* ─── Team Overview Hero ────────────────────────── */}
            <section className="kz-animate-fade-in flex flex-col md:flex-row md:items-start justify-between gap-8 px-6">
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <div className="px-3 py-1 rounded-lg bg-slate-900 dark:bg-zinc-800 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                            Command Terminal
                        </div>
                        <div className="kz-status-chip bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-500 py-1.5 px-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="font-black text-[9px]">Established</span>
                        </div>
                    </div>
                    <h1 className="font-heading text-2xl md:text-3xl text-slate-900 dark:text-white tracking-tighter leading-[0.9] py-2 uppercase">
                        Welcome Back,<br />
                        <span className="text-indigo-600 dark:text-indigo-400 inline-block mt-2 text-4xl md:text-5xl font-black drop-shadow-sm">{team.name}</span>
                    </h1>
                    <div className="flex items-center gap-8 pt-8 border-t border-black/5 dark:border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-2">Total teams</span>
                            <div className="flex items-baseline gap-3">
                                <span className="text-xl font-mono-tech text-slate-900 dark:text-white leading-none font-black tracking-tighter">{allTeams - 1}</span>
                                <span className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.3em] opacity-40">Deployed</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="hidden lg:block">
                    <div className="kz-card-rich p-6 w-72 bg-black/[0.01] dark:bg-white/[0.01]">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">System Status</span>
                            <Activity className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="w-24 h-0.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full w-4/5 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                                    </div>
                                    <span className="text-[10px] font-mono-tech font-bold text-slate-500 dark:text-slate-600 uppercase">stable_v{i}.0</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Mission Critical KPIs ─────────────────────────── */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
                {/* Global Countdown Card */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 kz-card-rich p-6 lg:p-8 flex flex-col justify-between group overflow-hidden bg-black/[0.01] dark:bg-white/[0.01]">
                    {/* Background Detail */}

                    <div>
                        <div className="flex items-center gap-5 mb-12 relative z-10">
                            <div className="w-11 h-11 rounded-xl bg-black/5 dark:bg-white/[0.05] border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:border-indigo-500/30 transition-all duration-500 shadow-inner">
                                <Clock className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] leading-none">Global Mission Protocol</span>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest leading-none">Status: Synchronized</span>
                                </div>
                            </div>
                        </div>
                        <div className="font-mono-tech text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white tracking-[-0.05em] leading-none mb-4 font-black relative z-10">
                            <CountdownTimer startsAt={startsAt} endsAt={endsAt} />
                        </div>
                    </div>
                    <div className="mt-auto relative z-10">
                        <div className="flex items-center justify-between mb-5 px-1">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                                <span className="text-[11px] font-mono-tech font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Data_Transmission: {progressPct}%</span>
                            </div>
                            <span className="text-[10px] font-mono-tech font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest opacity-80">STABLE_SIGNAL</span>
                        </div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/[0.05] rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                            <div
                                className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-1000"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Milestone Progression - Refined */}
                <div className="col-span-1 flex flex-col gap-6">
                    <div className="flex items-center gap-3 px-1">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-zinc-800 text-white">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <h2 className="text-[11px] font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase">Pipeline</h2>
                    </div>

                    <Link href="/team/checkpoints" className="kz-card-rich p-6 lg:p-8 flex flex-col group transition-all duration-300 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] bg-black/[0.01] dark:bg-white/[0.01] block h-full">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                <ListChecks className="w-4.5 h-4.5" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em] leading-none">Milestones</span>
                                <span className="text-sm font-black text-slate-900 dark:text-white mt-1 uppercase tracking-tight">Stage {completedCheckpoints + 1}</span>
                            </div>
                            <div className="ml-auto w-9 h-9 rounded-full border border-black/5 dark:border-white/5 flex items-center justify-center bg-black/[0.02] dark:bg-white/[0.02] text-[10px] font-mono-tech font-black text-slate-900 dark:text-white">
                                {completedCheckpoints}/{totalCheckpoints}
                            </div>
                        </div>
                        <div className="mt-auto space-y-4">
                            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 dark:bg-indigo-500 w-1/3 rounded-full" />
                            </div>
                            <span className="text-[9px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.2em]">Verification Active</span>
                        </div>
                    </Link>
                </div>

                {/* Squad Composition */}
                <div className="col-span-1 lg:row-span-2">
                    <Link href="/team/profile" className="kz-card-rich p-6 lg:p-7 flex flex-col group bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all duration-300 block h-full overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-zinc-800 group-hover:text-white transition-all duration-300">
                                <Users className="w-4 h-4" strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-mono-tech font-black text-zinc-500 uppercase tracking-widest bg-black/5 dark:bg-white/5 px-2 py-1 rounded">Unit: {team.id.slice(0, 4)}</span>
                        </div>

                        {/* DESKTOP DIRECTORY */}
                        <div className="hidden lg:block flex-1 mb-6">
                            <p className="text-[9px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 opacity-80">Personnel_Files</p>
                            <div className="space-y-2">
                                {team.members?.slice(0, 4).map((m: any) => (
                                    <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/[0.05]">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-6 h-6 rounded-md bg-zinc-800 dark:bg-zinc-700 flex items-center justify-center text-[9px] text-white font-black shrink-0">
                                                {m.name.charAt(0)}
                                            </div>
                                            <span className="text-[10px] font-black text-slate-800 dark:text-slate-300 truncate uppercase">{m.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto space-y-5">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-heading font-black text-slate-900 dark:text-white text-lg uppercase tracking-tighter">Team Identity</h3>
                                    <span className="text-[8px] font-mono-tech font-black text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/10 uppercase tracking-widest">Secure</span>
                                </div>
                                <p className="text-[9px] text-slate-500 dark:text-slate-600 font-mono-tech font-bold uppercase tracking-[0.3em]">@ Ops_Ready</p>
                            </div>
                            <div className="h-px w-full bg-black/5 dark:bg-white/5" />
                            <div className="space-y-1">
                                <p className="text-[9px] text-slate-500 dark:text-slate-500 font-medium leading-normal opacity-60">Credential Verified.</p>
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
                            <h2 className="font-heading font-black text-2xl text-slate-900 dark:text-white tracking-tight">
                                Latest Announcements
                            </h2>
                            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mt-1">Official Event Updates</p>
                        </div>
                        <button className="kz-btn-rich kz-btn-rich-secondary text-[10px] py-1.5 px-4">Archive</button>
                    </div>

                    <div className="space-y-4">
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
                                    className="w-full text-left flex items-start gap-10 p-10 kz-card-rich bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all duration-500 group"
                                >
                                    <div className="kz-icon-rich w-12 h-12 bg-black/5 dark:bg-white/[0.05] border-black/5 dark:border-white/10 text-slate-400 dark:text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shrink-0 shadow-inner">
                                        <Bell className="w-5 h-5 relative z-10" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1">
                                        <div className="flex items-center justify-between gap-4 mb-3">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-heading font-black text-xl text-slate-900 dark:text-white tracking-tight uppercase">
                                                    {a.title}
                                                </h3>
                                                <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-500" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest whitespace-nowrap bg-black/[0.03] dark:bg-white/[0.05] px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5">
                                                {new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        {a.body && (
                                            <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                                                {a.body}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 mt-8">
                                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform inline-flex items-center gap-3">Open Secure Transmission <ChevronRight className="w-4 h-4" strokeWidth={3} /></span>
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
                        <h2 className="font-heading font-black text-2xl text-slate-900 dark:text-white tracking-tight">Quick Links</h2>
                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mt-1">Fast Navigation</p>
                    </div>

                    <div className="flex flex-col gap-5">
                        {[
                            { href: "/team/checkpoints", icon: CheckSquare, label: "Milestones", desc: "Your Progress", color: "indigo" },
                            { href: "/team/schedule", icon: Calendar, label: "Schedule", desc: "Event Timeline", color: "slate" },
                            { href: "/team/general", icon: Layout, label: "Overview", desc: "General Info", color: "indigo" },
                        ].map((item, i) => (
                            <Link key={i} href={item.href} className="group relative">
                                <div className="kz-card-rich p-6 flex items-center gap-6 bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:scale-[1.02] transition-all duration-500 active:scale-95 border-black/5 dark:border-white/5">
                                    <div className="kz-icon-rich w-11 h-11 bg-black/5 dark:bg-white/[0.05] text-slate-400 dark:text-slate-500 border-black/5 dark:border-white/10 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-400 transition-all duration-300 shrink-0 shadow-inner">
                                        <item.icon className="w-5 h-5 relative z-10" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-heading font-black text-lg text-slate-900 dark:text-white leading-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{item.label}</span>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-600 font-black uppercase tracking-widest mt-2">{item.desc}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 ml-auto group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}

                        <button
                            onClick={() => setNotificationsOpen(true)}
                            className="group relative text-left"
                        >
                            <div className="kz-card-rich p-8 flex items-center gap-6 bg-indigo-600/[0.03] dark:bg-indigo-500/[0.05] hover:bg-indigo-600/[0.08] hover:scale-[1.02] transition-all duration-500 active:scale-95 border-indigo-500/20">
                                <div className="kz-icon-rich w-14 h-14 bg-indigo-600 text-white border-indigo-400 shrink-0">
                                    <Bell className="w-6 h-6 relative z-10" />
                                </div>
                                <div className="flex-col min-w-0">
                                    <span className="font-heading font-black text-xl text-slate-900 dark:text-white leading-none uppercase tracking-tighter">Notifications</span>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                        <span className="text-[10px] text-indigo-500/80 dark:text-indigo-400 font-black uppercase tracking-widest">Latest Transmissions</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-indigo-500/40 ml-auto group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-2 transition-all" />
                            </div>
                        </button>
                    </div>

                    {/* Section Info Badge */}
                    <div className="kz-card-rich p-8 border-dashed border border-black/10 dark:border-white/10 flex items-center gap-5 bg-black/[0.01] dark:bg-white/[0.01]">
                        <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-600 shrink-0">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">Encrypted Session</span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-500 font-bold leading-relaxed opacity-60">Verified connection via Kaizen Net. All data streams are isolated and secure.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
