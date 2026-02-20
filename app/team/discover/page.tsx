// app/team/discover/page.tsx
import { auth } from "@/auth"
import { getTeamBySession, getAllTeams } from "@/lib/hackathon/teams"
import { redirect } from "next/navigation"
import { Users, Github, Linkedin, Crown, ShieldCheck } from "lucide-react"

export default async function DiscoverTeamsPage() {
    const session = await auth()
    if (!session?.user) redirect("/hackathon-login")

    // Restore real data retrieval
    const currentTeam = await getTeamBySession(session.user)
    const allTeams = await getAllTeams()

    return (
        <div className="max-w-none mx-auto space-y-12 pb-32 pt-4 px-4 overflow-hidden">
            {/* Header */}
            <header className="kz-animate-fade-in px-2 max-w-7xl mx-auto w-full">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className="px-3 py-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        Directory Protocol 4.0
                    </div>
                </div>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tighter leading-none mb-4 uppercase">
                    UNIT DIRECTORY
                </h1>
                <p className="font-sans text-slate-600 dark:text-slate-400 text-[12px] font-bold uppercase tracking-[0.1em] max-w-2xl leading-relaxed">
                    A secure listing of all active personnel units participating in the Kaizen Tech Sprint.
                </p>
                <div className="h-px w-full bg-black/5 dark:bg-white/5 mt-8" />
            </header>

            {/* Teams Grid — Expanded Width Protocol */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 px-2 max-w-7xl mx-auto">
                {allTeams.map((team, i) => {
                    const isOwnTeam = team.id === currentTeam?.id

                    const sortedMembers = [...(team.members || [])].sort((a: any, b: any) => {
                        if (a.role === "LEADER") return -1
                        if (b.role === "LEADER") return 1
                        return 0
                    })

                    return (
                        <div
                            key={team.id}
                            className={`
                                kz-card-rich p-6 px-3 sm:px-5 lg:px-6 space-y-6 sm:space-y-8 kz-animate-slide-up relative group bg-black/[0.01] dark:bg-white/[0.01]
                                ${isOwnTeam ? "ring-1 ring-indigo-500/30" : ""}
                            `}
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            {isOwnTeam && (
                                <div className="absolute top-5 right-5 px-3 py-1 rounded bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] z-10 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                    Primary Unit
                                </div>
                            )}

                            {/* Team Header */}
                            <div className="space-y-5">
                                <h3 className="font-heading font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
                                    {team.name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-4 text-slate-500">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/[0.04] dark:bg-indigo-500/[0.08] border border-indigo-500/10 dark:border-indigo-500/20 shadow-sm">
                                        <Users className="w-4 h-4 text-indigo-500" strokeWidth={3} />
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                                            {team.members?.length ?? 0} Personnel
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Members */}
                            <div className="space-y-4 sm:space-y-2">
                                {sortedMembers.map((member: any) => {
                                    const meta: any = member.meta || {}

                                    return (
                                        <div key={member.id} className="flex items-center justify-between gap-4 group/member">
                                            <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-1">
                                                <div className={`
                                                    w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0 border shadow-sm
                                                    ${member.role === "LEADER"
                                                        ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                                                        : "bg-black/[0.03] dark:bg-white/[0.05] border-black/5 dark:border-white/10 text-slate-500 dark:text-slate-400 group-hover/member:border-indigo-500/40 shadow-inner"}
                                                `}>
                                                    {member.role === "LEADER"
                                                        ? <Crown className="w-3.5 h-3.5 sm:w-4 h-4" />
                                                        : <Users className="w-3.5 h-3.5 sm:w-4 h-4" />
                                                    }
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight">
                                                        {member.name}
                                                    </p>
                                                    <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 font-black mt-1 opacity-60 group-hover/member:opacity-100 transition-opacity whitespace-nowrap">
                                                        {member.role === "LEADER" ? "Protocol Lead" : "Field Agent"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 sm:gap-4 shrink-0 relative z-10 sm:ml-auto">
                                                {meta.github && (
                                                    <a
                                                        href={meta.github.startsWith("http") ? meta.github : `https://github.com/${meta.github}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 border border-black/5 dark:border-white/10 shadow-sm"
                                                    >
                                                        <Github className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                                {meta.linkedin && (
                                                    <a
                                                        href={meta.linkedin.startsWith("http") ? meta.linkedin : `https://linkedin.com/in/${meta.linkedin}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 border border-black/5 dark:border-white/10 shadow-sm"
                                                    >
                                                        <Linkedin className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}
