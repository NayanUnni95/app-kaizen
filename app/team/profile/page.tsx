import { auth, signOut } from "@/auth"
import { getTeamById } from "@/lib/hackathon/teams"
import { Avatar } from "@/components/ui/Avatar"
import { EmptyState } from "@/components/ui/EmptyState"
import {
    User, Mail, Shield, LogOut, Users, CheckSquare,
    Phone, Linkedin, ExternalLink, Upload, Github, Info,
    Terminal, Activity, Zap
} from "lucide-react"
// import { Activity } from "react"

const STATUS_BADGE_MAP: Record<string, { label: string, cls: string }> = {
    active: { label: "Active", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    paused: { label: "Paused", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    submitted: { label: "Submitted", cls: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
}

export default async function TeamProfilePage() {
    const session = await auth()
    const teamId = (session?.user as any)?.teamId
    const team = teamId ? await getTeamById(teamId) : null

    if (!team) return (
        <div className="flex items-center justify-center py-20">
            <div className="kz-card-rich p-10 text-center bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5">
                <Info className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="font-heading font-black text-xl text-slate-900 dark:text-white uppercase tracking-tighter">Entity Not Found</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold mt-2 uppercase tracking-widest">System Record Missing</p>
            </div>
        </div>
    )

    const isActive = team.isActive
    const statusKey = isActive ? "active" : "paused"
    const statusBadge = STATUS_BADGE_MAP[statusKey]

    return (
        <div className="max-w-none mx-auto space-y-16 pb-24 pt-12 px-6 min-h-screen">
            {/* ─── Profile Header ─────────────────────── */}
            <header className="kz-animate-fade-in flex flex-col md:flex-row md:items-start justify-between gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-400">
                            <Users className="w-4.5 h-4.5" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-heading font-black text-4xl text-slate-900 dark:text-white tracking-tighter leading-none uppercase">Squad Identity</h1>
                            <span className="text-[10px] font-mono-tech font-bold text-slate-500 uppercase tracking-widest mt-2">SYS_REGISTRY: ALPHA_SECURE_ACCESS</span>
                        </div>
                    </div>
                </div>
                <div className="kz-status-chip bg-indigo-500/5 border-indigo-500/10 text-indigo-600 dark:text-indigo-400 py-2 px-4">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono-tech font-bold uppercase tracking-widest">NETWORK_UPLINK: ENCRYPTED</span>
                </div>
            </header>

            {/* ─── Team Telemetry Card ──────────────────────────── */}
            <section className="kz-card-rich p-10 kz-animate-slide-up bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5 group overflow-hidden" style={{ animationDelay: "100ms" }}>
                <div className="flex flex-col md:flex-row md:items-center gap-10 relative z-10">
                    {/* Large high-end team avatar */}
                    <div className="relative shrink-0">
                        <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-4xl font-heading font-bold text-slate-900 dark:text-white border border-black/5 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04] overflow-hidden">
                            {team.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white dark:bg-[#0B0E14] border border-black/5 dark:border-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 ring-4 ring-white dark:ring-[#0B0E14]">
                            <Zap className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="font-heading font-black text-3xl text-slate-900 dark:text-white tracking-tighter uppercase">{team.name}</h2>
                                <div className={`kz-status-chip h-auto py-1 px-3 ${statusBadge.cls} border-0`}>
                                    <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    <span className="text-[9px] font-mono-tech font-bold uppercase tracking-widest">{statusBadge.label}_OPS</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-6 text-[10px] font-mono-tech font-bold text-slate-500 uppercase tracking-widest">
                                <span className="flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.5} />
                                    ID_@{team.username}
                                </span>
                                {team.email && (
                                    <span className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.5} />
                                        AUTH_{team.email}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-6 mt-6 border-t border-black/5 dark:border-white/5">
                            <div className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center gap-2.5 group/meta">
                                <Activity className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Event</span>
                                    <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">{team.event.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex flex-col gap-16">
                {/* ─── Members Stream ───────────────────────────── */}
                <section className="space-y-8 kz-animate-slide-up px-2" style={{ animationDelay: "200ms" }}>
                    <div className="flex items-center justify-between border-b border-indigo-500/30 pb-4">
                        <div className="flex flex-col">
                            <h2 className="font-heading font-black text-2xl text-slate-900 dark:text-white tracking-tight uppercase">Operational Personnel</h2>
                            <p className="text-[11px] font-mono-tech font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">SQUAD_REGISTRY_VERIFIED</p>
                        </div>
                        <span className="text-[10px] font-mono-tech font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-md uppercase tracking-widest">{team.members.length} UNITS_ACTIVE</span>
                    </div>

                    {team.members.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="No Members"
                            description="No members found in this team."
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {team.members.map((member: any, i: number) => {
                                const isLeader = member.role === 'LEADER'
                                const meta = member.meta as any ?? {}

                                return (
                                    <div key={member.id}
                                        className="kz-card-rich p-6 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:scale-[1.02] transition-all duration-500 group border-black/5 dark:border-white/5 hover:border-indigo-500/30"
                                        style={{ animationDelay: `${250 + (i * 50)}ms` }}>
                                        <div className="flex items-start gap-4 mb-6">
                                            <Avatar name={member.name} size="lg" className="shrink-0 ring-4 ring-black/5 dark:ring-white/5" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-heading font-black text-lg text-slate-900 dark:text-white tracking-tight truncate">{member.name}</p>
                                                    {isLeader && (
                                                        <div className="px-1.5 py-0.5 rounded-md bg-indigo-500 text-white text-[8px] font-black uppercase tracking-widest shadow-sm">
                                                            Leader
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-mono-tech font-bold uppercase tracking-wider ${member.isAccepted ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${member.isAccepted ? "bg-emerald-500" : "bg-amber-500"}`} />
                                                    {member.isAccepted ? "ACCEPTED" : "PENDING_AUTH"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                                            {meta?.phone && (
                                                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                                    <Phone className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                                                    {meta.phone}
                                                </div>
                                            )}
                                            {meta?.email && (
                                                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                                    <Mail className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                                                    {meta.email}
                                                </div>
                                            )}
                                            {meta?.linkedin && (
                                                <a
                                                    href={meta.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:translate-x-1 transition-all"
                                                >
                                                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                                                </a>
                                            )}
                                            {meta?.github && (
                                                <a
                                                    href={meta.github.startsWith('http') ? meta.github : `https://github.com/${meta.github}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 text-[11px] font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                >
                                                    <Github className="w-3.5 h-3.5" /> GitHub
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* ─── Mission Submission ───────────────────────── */}
                <section className="space-y-8 kz-animate-slide-up px-2" style={{ animationDelay: "300ms" }}>
                    <div className="border-b border-black/5 dark:border-white/10 pb-4">
                        <h2 className="font-heading font-black text-2xl text-slate-900 dark:text-white tracking-tight uppercase">Project Pipeline</h2>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Final Deployment Link</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        {/* Pipeline Content */}
                        <div className="lg:col-span-3 kz-card-rich p-8 bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5">
                            <div className="flex items-start gap-4 p-5 bg-amber-500/10 rounded-2xl border border-amber-500/20 mb-8">
                                <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-black text-amber-400 uppercase tracking-widest leading-none mb-2">Submissions currently locked</p>
                                    <p className="text-[11px] text-amber-400/60 font-bold leading-relaxed">
                                        The project pipeline is not yet synchronized for deployment.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6 opacity-40 select-none">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Source Code Repository</label>
                                        <div className="relative">
                                            <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-700" />
                                            <div className="w-full h-12 pl-11 pr-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center text-xs font-bold text-slate-500 dark:text-slate-700">
                                                https://github.com/squad-alpha/kaizen...
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Deployment Summary</label>
                                        <div className="w-full h-12 p-3 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-xs font-bold text-slate-500 dark:text-slate-700 truncate leading-none flex items-center">
                                            Executive summary of the mission outcome...
                                        </div>
                                    </div>
                                </div>

                                <div className="border-2 border-dashed border-black/5 dark:border-white/5 rounded-2xl p-8 text-center bg-black/5 dark:bg-white/[0.01]">
                                    <Upload className="w-8 h-8 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Uplink Assets</p>
                                    <p className="text-[8px] text-slate-500 font-bold mt-1 uppercase">PPTX | PDF | MP4 [MAX 50MB]</p>
                                </div>

                                <button className="w-full py-4 rounded-xl bg-black/5 dark:bg-white/5 text-slate-400 dark:text-slate-700 text-[11px] font-black uppercase tracking-[0.2em] cursor-not-allowed border border-black/5 dark:border-white/5">
                                    EXECUTE DEPLOYMENT
                                </button>
                            </div>
                        </div>

                        {/* Security Actions */}
                        <div className="space-y-6">
                            <div className="kz-card-rich p-6 border-dashed border-2 border-black/5 dark:border-white/5 flex items-center gap-4 bg-black/5 dark:bg-white/[0.01]">
                                <Shield className="w-8 h-8 text-slate-300 dark:text-slate-800" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Security Protocol</span>
                                    <p className="text-[11px] text-slate-500 font-bold leading-tight">All transmissions are encrypted and final. Direct verification required.</p>
                                </div>
                            </div>

                            <form
                                action={async (formData) => {
                                    "use server"
                                    await signOut({ redirectTo: "/" })
                                }}
                            >
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-3 h-14 bg-rose-500/10 text-rose-500 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Terminate Session
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
