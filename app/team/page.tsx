import { auth } from "@/auth"
import { getTeamById } from "@/lib/hackathon/teams"
import { prisma } from "@/lib/prisma"
import { Avatar } from "@/components/ui/Avatar"
import { CountdownTimer } from "@/components/ui/CountdownTimer"
import { EmptyState } from "@/components/ui/EmptyState"
import {
    CheckSquare,
    ChevronRight,
    Users,
    Zap,
    Calendar,
    Bell,
    ExternalLink,
    Info,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    Pin,
    Activity
} from "lucide-react"
import Link from "next/link"

function getStatusBadge(team: any) {
    const isSubmitted = team.submissions?.some((s: any) => s.status === 'SUBMITTED' || s.status === 'APPROVED')
    if (isSubmitted) return { label: "Submitted", color: "bg-[#D1FAE5] text-[#065F46]" }
    if (!team.isActive) return { label: "Paused", color: "bg-[#FEF3C7] text-[#92400E]" }
    return { label: "Active", color: "bg-[#D1FAE5] text-[#065F46]" }
}

function NotifIcon({ type }: { type: string }) {
    const map: Record<string, any> = {
        INFO: { icon: Info, color: "text-[#2563EB]", bg: "bg-[#EFF6FF]" },
        SUCCESS: { icon: CheckCircle, color: "text-[#16A34A]", bg: "bg-[#D1FAE5]" },
        WARNING: { icon: AlertTriangle, color: "text-[#F59E0B]", bg: "bg-[#FEF3C7]" },
        ERROR: { icon: XCircle, color: "text-[#DC2626]", bg: "bg-[#FEE2E2]" },
    }
    const cfg = map[type] || map.INFO
    const Icon = cfg.icon
    return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
            <Icon className={`w-4 h-4 ${cfg.color}`} />
        </div>
    )
}

export default async function TeamDashboard() {
    const session = await auth()
    const teamId = (session?.user as any).teamId
    const team = await getTeamById(teamId)

    if (!team) return <div className="p-6 text-[#64748B]">Team not found</div>

    const completedCheckpoints = team.progress.filter((p: any) => p.status === 'APPROVED').length
    const totalCheckpoints = team.event.checkpoints.length
    const progressPct = totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0

    // Get recent notifications/announcements for this team
    const announcements = await prisma.notification.findMany({
        where: {
            OR: [
                { teamId },
                { teamId: null, eventId: team.eventId },
            ]
        },
        orderBy: { createdAt: "desc" },
        take: 5,
    })

    const unreadCount = announcements.filter((a: any) => !a.isRead).length
    const status = getStatusBadge(team)

    // Quick stats from event
    const allTeams = await prisma.team.count({ where: { eventId: team.eventId } })
    const checkedIn = await prisma.team.count({ where: { eventId: team.eventId, isActive: true } })

    return (
        <div className="space-y-6 pb-8">
            {/* ─── Hero Strip ─────────────────────────────────── */}
            <section className="kz-animate-fade-in">
                <div
                    className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #0369A1 100%)",
                    }}
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
                        {/* Large team avatar */}
                        <div className="flex-shrink-0">
                            <div
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#1D4ED8]"
                                style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                            >
                                {team.name.slice(0, 2).toUpperCase()}
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                                    {team.name}
                                </h1>
                                <span className={`kz-badge text-[10px] font-bold px-2.5 py-0.5 rounded-full ${status.color}`}>
                                    {status.label}
                                </span>
                            </div>
                            <p className="text-blue-200 text-sm font-medium">
                                {team.event.name}
                            </p>
                            {/* Track badge */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/20">
                                    <Activity className="w-3 h-3" />
                                    Hackathon Track
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/20">
                                    <Users className="w-3 h-3" />
                                    {team.members.length} members
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Countdown + Progress ────────────────────────── */}
            <section
                className="kz-card p-6 kz-animate-fade-in"
                style={{ animationDelay: "0.05s" }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-semibold text-base text-[#0F172A]">
                        Hackathon Countdown
                    </h2>
                    <span className="text-xs text-[#64748B] font-medium">
                        {progressPct}% milestones complete
                    </span>
                </div>
                <CountdownTimer startsAt={team.event.startsAt} endsAt={team.event.endsAt} />

                {/* Checkpoint progress */}
                <div className="mt-5 pt-5 border-t border-[#E6E9EE]">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-[#0F172A]">Checkpoint Progress</span>
                        <span className="font-bold text-[#2563EB]">{completedCheckpoints}/{totalCheckpoints}</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#E6E9EE] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${progressPct}%`,
                                background: "linear-gradient(90deg, #2563EB, #06B6D4)"
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* ─── Track & Problem Statement Section ────────── */}
            <section className="kz-animate-slide-up" style={{ animationDelay: "0.08s" }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Track Info */}
                    <div className="md:col-span-1 kz-card-premium p-6 flex flex-col justify-between">
                        <div>
                            <div className="kz-icon-container w-12 h-12 bg-blue-50 mb-4">
                                <Zap className="w-6 h-6 text-[#2563EB]" />
                            </div>
                            <h3 className="font-heading font-bold text-lg text-[#0F172A]">
                                Selected Track
                            </h3>
                            <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
                                You are currently competing in the <span className="font-bold text-[#0F172A]">Innovation</span> track. Good luck!
                            </p>
                        </div>
                        <div className="mt-4 flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    {i}
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                +{team.members.length}
                            </div>
                        </div>
                    </div>

                    {/* Problem Statement Card */}
                    <div className="md:col-span-2 kz-card-premium p-1 relative overflow-hidden group">
                        {/* Background subtle mesh */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(at_top_right,_#2563EB_0%,_transparent_50%)]" />

                        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-6 h-full">
                            <div className="kz-icon-container w-20 h-20 bg-slate-50 flex-shrink-0">
                                <Activity className="w-10 h-10 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-heading font-bold text-xl text-[#0F172A]">
                                        Problem Statement
                                    </h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider">
                                        Coming Soon
                                    </span>
                                </div>
                                <p className="text-sm text-[#64748B] leading-relaxed max-w-md">
                                    The problem statement for your track will be officially released at the start of the hackathon. Prepare your tools!
                                </p>

                                <div className="pt-2 flex items-center gap-3">
                                    <button disabled className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold flex items-center gap-2 cursor-not-allowed border border-slate-200">
                                        <Clock className="w-3.5 h-3.5" />
                                        Unlocking Soon
                                    </button>
                                    <p className="text-[10px] font-medium text-slate-400">
                                        Release: {team.event.startsAt ? new Date(team.event.startsAt).toLocaleDateString() : 'TBD'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Two-column: Announcements + Quick Actions ───── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Announcements/Notifications */}
                <section
                    className="kz-animate-slide-up"
                    style={{ animationDelay: "0.1s" }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-heading font-semibold text-base text-[#0F172A] flex items-center gap-2">
                            <Bell className="w-4 h-4 text-[#2563EB]" />
                            Announcements
                            {unreadCount > 0 && (
                                <span className="w-5 h-5 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </h2>
                        <Link href="/team/notifications" className="flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
                            View all <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="space-y-2">
                        {announcements.length === 0 ? (
                            <EmptyState
                                icon={Bell}
                                title="No announcements yet"
                                description="Organizers will post updates here. Check back soon."
                            />
                        ) : (
                            announcements.map((a: any) => (
                                <Link
                                    key={a.id}
                                    href="/team/notifications"
                                    className={`
                                        flex items-start gap-3 p-3.5 rounded-xl border transition-all
                                        ${!a.isRead
                                            ? "border-[#BFDBFE] bg-[#EFF6FF] hover:bg-[#DBEAFE]"
                                            : "border-[#E6E9EE] bg-white hover:bg-[#F8FAFC]"
                                        }
                                    `}
                                >
                                    <NotifIcon type={a.type} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm font-semibold truncate ${!a.isRead ? "text-[#1D4ED8]" : "text-[#0F172A]"}`}>
                                                {a.title}
                                            </p>
                                            {!a.isRead && (
                                                <span className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />
                                            )}
                                        </div>
                                        {a.body && (
                                            <p className="text-xs text-[#64748B] mt-0.5 line-clamp-2 leading-relaxed">{a.body}</p>
                                        )}
                                        <p className="text-[10px] text-[#94A3B8] mt-1 font-medium">
                                            {new Date(a.createdAt).toLocaleString('en-US', {
                                                month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </section>

                {/* Team Dashboard Card */}
                <section
                    className="kz-animate-slide-up"
                    style={{ animationDelay: "0.15s" }}
                >
                    <h2 className="font-heading font-semibold text-base text-[#0F172A] flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-[#F59E0B]" />
                        Quick Actions
                    </h2>

                    <div className="kz-card-premium overflow-hidden divide-y divide-[#E6E9EE]/50">
                        {[
                            {
                                href: "/team/checkpoints",
                                icon: CheckSquare,
                                label: "View Checkpoints",
                                desc: `${completedCheckpoints}/${totalCheckpoints} completed`,
                                color: "#2563EB",
                                bg: "bg-blue-50/50"
                            },
                            {
                                href: "/team/schedule",
                                icon: Calendar,
                                label: "Event Schedule",
                                desc: "Timeline & events",
                                color: "#06B6D4",
                                bg: "bg-cyan-50/50"
                            },
                            {
                                href: "/team/profile",
                                icon: Users,
                                label: "Team Profile",
                                desc: `${team.members.length} members`,
                                color: "#16A34A",
                                bg: "bg-emerald-50/50"
                            },
                            {
                                href: "/team/notifications",
                                icon: Bell,
                                label: "Notifications",
                                desc: unreadCount > 0 ? `${unreadCount} unread` : "All caught up",
                                color: "#F59E0B",
                                bg: "bg-amber-50/50"
                            },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-4 p-4 hover:bg-slate-50/80 transition-colors group"
                            >
                                <div
                                    className={`kz-icon-container w-10 h-10 flex-shrink-0 ${item.bg}`}
                                >
                                    <item.icon className="w-5 h-5 transition-transform group-hover:scale-110 duration-300" style={{ color: item.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[#0F172A]">{item.label}</p>
                                    <p className="text-xs text-[#64748B]">{item.desc}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            {/* ─── Quick Stats ──────────────────────────────────── */}
            <section
                className="kz-animate-slide-up"
                style={{ animationDelay: "0.2s" }}
            >
                <h2 className="font-heading font-semibold text-sm text-[#64748B] uppercase tracking-wider mb-3">
                    Event Overview
                </h2>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Total Teams", value: allTeams, color: "#2563EB", bg: "bg-blue-50/50", icon: Users },
                        { label: "Active Now", value: checkedIn, color: "#16A34A", bg: "bg-emerald-50/50", icon: Activity },
                        { label: "Checkpoints", value: totalCheckpoints, color: "#06B6D4", bg: "bg-cyan-50/50", icon: CheckSquare },
                    ].map((stat) => (
                        <div key={stat.label} className="kz-card-premium p-4 flex flex-col items-center text-center group">
                            <div className={`kz-icon-container w-8 h-8 mb-2 ${stat.bg}`}>
                                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                            </div>
                            <p
                                className="font-heading text-2xl font-bold group-hover:scale-110 transition-transform"
                                style={{ color: stat.color }}
                            >
                                {stat.value}
                            </p>
                            <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
