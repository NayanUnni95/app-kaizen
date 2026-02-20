// app/team/page.tsx
import { auth } from "@/auth"
import { ProblemStatementSection } from "@/components/hackathon/ProblemStatementSection"
import { getTeamBySession } from "@/lib/hackathon/teams"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CountdownTimer } from "@/components/ui/CountdownTimer"
import { EmptyState } from "@/components/ui/EmptyState"
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

export default async function TeamDashboardPage() {
    const session = await auth()
    // If not signed in, send to explicit signin page (do NOT redirect to "/")
    if (!session?.user) redirect("/hackathon-login")

    const team = await getTeamBySession(session.user)
    // If signed in but no team, send to team-join/create flow (do NOT redirect to "/")
    if (!team) redirect("/team/join")

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

    // Fetch announcements (using Notification model)
    const announcements = await prisma.notification.findMany({
        where: {
            eventId: team.eventId,
            teamId: null,
            category: 'ANNOUNCEMENT'
        } as any, // Global announcements
        orderBy: { createdAt: 'desc' },
        take: 5
    })

    // Quick status logic (mock for now, replace with real data)
    const completedCheckpoints = 2 // mock
    const totalCheckpoints = 5 // mock

    // Quick stats from event
    const allTeams = await prisma.team.count({ where: { eventId: team.eventId } })

    // Helper for notif icon (kept as server component small helper)
    const NotifIcon = ({ type }: { type: string }) => {
        switch (type) {
            case "alert": return (
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                    <Activity className="w-5 h-5" />
                </div>
            )
            case "task": return (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <CheckSquare className="w-5 h-5" />
                </div>
            )
            default: return (
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                    <Bell className="w-5 h-5" />
                </div>
            )
        }
    }

    return (
        <div className="space-y-8 pb-12 pt-6">
            {/* ─── Minimal Hero ─────────────────────────────────── */}
            <section className="kz-animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight">
                        Good afternoon, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">{team.name}</span>
                    </h1>
                    <p className="text-[#64748B] text-sm md:text-base mt-2 max-w-xl leading-relaxed">
                        Welcome to your command center. You're competing in the <span className="font-semibold text-slate-800">Innovation Track</span> against {allTeams - 1} other teams.
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
                {/* Countdown Card (Double Width) */}
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

                {/* Progress Micro-Card */}
                <div className="col-span-1 kz-card-premium p-5 flex flex-col justify-between group hover:border-blue-200/50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <CheckSquare className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <span className="text-2xl font-heading font-bold text-slate-800">{completedCheckpoints}/{totalCheckpoints}</span>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-700 text-sm">Checkpoints</p>
                        <p className="text-xs text-slate-400 mt-0.5">Keep pushing forward</p>
                    </div>
                </div>

                {/* Team Micro-Card */}
                <div className="col-span-1 kz-card-premium p-5 flex flex-col justify-between group hover:border-blue-200/50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                            <Users className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <div className="flex -space-x-2">
                            {team.members.slice(0, 3).map((m: any, i: number) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-700 text-sm">Squad Status</p>
                        <p className="text-xs text-slate-400 mt-0.5">{team.members.length} members active</p>
                    </div>
                </div>
            </section>

            {/* ─── Problem Statement Section ────────────────────── */}
            <section className="kz-animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <ProblemStatementSection startsAt={team.event.startsAt?.toISOString()} />
            </section>

            {/* ─── Main Content Grid ────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Announcements (2/3 width) */}
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
                            announcements.map((a: any) => {
                                return (
                                    <Link
                                        key={a.id}
                                        href="/team/notifications"
                                        className={`
                      block p-5 rounded-2xl border transition-all duration-300 group
                      ${!a.isRead
                                                ? "bg-white border-blue-100 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.1)]"
                                                : "bg-white/60 border-slate-100 hover:border-slate-200 hover:bg-white"
                                            }
                    `}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!a.isRead ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"}`}>
                                                {a.type === "ERROR" ? (
                                                    <Activity className="w-5 h-5" />
                                                ) : a.type === "SUCCESS" ? (
                                                    <CheckSquare className="w-5 h-5" />
                                                ) : (
                                                    <Bell className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className={`font-semibold text-sm truncate ${!a.isRead ? "text-slate-900" : "text-slate-600"}`}>
                                                        {a.title}
                                                    </h3>
                                                    <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                                                        {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                {a.body && (
                                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{a.body}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Right: Quick Actions (1/3 width) */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="font-heading font-semibold text-lg text-[#0F172A]">Quick Actions</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { href: "/team/checkpoints", label: "Checkpoints", icon: CheckSquare, color: "text-blue-600", bg: "bg-blue-50" },
                            { href: "/team/schedule", label: "Schedule", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
                            { href: "/team/profile", label: "Team Profile", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { href: "/team/notifications", label: "Notifications", icon: Bell, color: "text-amber-600", bg: "bg-amber-50" },
                        ].map((action) => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 group"
                            >
                                <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                                    <action.icon className="w-5 h-5" strokeWidth={2} />
                                </div>
                                <span className="font-semibold text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{action.label}</span>
                                <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
