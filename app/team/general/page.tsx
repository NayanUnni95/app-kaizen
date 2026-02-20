import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getTeamBySession } from "@/lib/hackathon/teams"
import { redirect } from "next/navigation"
import { Layout, Users, Info, MessageSquare, ChevronRight, ShieldCheck, Heart } from "lucide-react"

export default async function GeneralPage() {
    const session = await auth()
    if (!session?.user) redirect("/hackathon-login")

    const team = await getTeamBySession(session.user)

    // Stats
    const totalTeams = await prisma.team.count({ where: { eventId: team?.eventId } })
    const totalMembers = await prisma.teamMember.count({
        where: { team: { eventId: team?.eventId } }
    })

    const isFeedbackUnlocked = false // Admin controlled

    return (
        <div className="max-w-none mx-auto space-y-12 pb-20 pt-4 px-4 overflow-hidden">
            {/* Header */}
            <header className="kz-animate-fade-in px-2">
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tighter leading-none mb-3 uppercase">GENERAL OVERVIEW</h1>
                <p className="font-mono-tech text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    Executive overview, global stats, and event intelligence.
                </p>
            </header>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
                <div className="kz-card-rich p-6 flex items-center gap-5 bg-white/[0.02] border-white/5">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 border border-white/5">
                        <Layout className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-[9px] lg:text-[15px] font-mono-tech font-bold text-slate-500 uppercase tracking-widest mb-1">TOTAL TEAMS</p>
                        <h3 className="text-xl font-mono-tech font-bold text-slate-900 dark:text-white tracking-tight">{totalTeams}</h3>
                    </div>
                </div>
                <div className="kz-card-rich p-6 flex items-center gap-5 bg-white/[0.02] border-white/5">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 border border-white/5">
                        <Users className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-[9px] lg:text-[15px] font-mono-tech font-bold text-slate-500 uppercase tracking-widest mb-1">TOTAL STUDENTS</p>
                        <h3 className="text-xl font-mono-tech font-bold text-slate-900 dark:text-white tracking-tight">{totalMembers}</h3>
                    </div>
                </div>
            </section>

            {/* About & FAQ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
                <section className="md:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <h2 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
                            <Info className="w-4 h-4 text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
                            Mission Protocol
                        </h2>
                        <div className="kz-card-rich p-6 text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium bg-black/5 dark:bg-white/[0.02] border-black/5 dark:border-white/5">
                            We are looking for transforming and automating complex workflows,
                            or creating self-evolving AI agents, your mission is to build
                            solutions that are innovative, creative, and ground-breaking.
                            This isn’t just a competition; it’s a 24-hour sprint to define
                            the future of autonomy.
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
                            <ShieldCheck className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                            Knowledge Base
                        </h2>
                        <div className="space-y-3">
                            {[
                                { q: "When will be the Problem statements released?", a: "Problem statements will be released at the start of the hackathon." },
                                {
                                    q: "Can we work on a pre-built or existing project?",
                                    a: "No. Projects must be developed entirely during the hackathon. Pre-built or previously submitted projects are strictly prohibited."
                                },

                                {
                                    q: "Are we allowed to use open-source libraries or APIs?",
                                    a: "Yes. Use of open-source libraries, frameworks, and APIs is encouraged, provided they are properly credited."
                                },
                                {
                                    q: "What happens in case of misconduct?",
                                    a: "There is zero tolerance for misconduct. Participants must respect mentors, organizers, and fellow participants at all times."
                                },
                                {
                                    q: "Is this a continuous 24-hour event?",
                                    a: "Yes. This is a 24-hour hackathon. Rest areas for boys and girls will be available during the event."
                                }
                            ].map((faq, i) => (
                                <div key={i} className="bg-black/5 dark:bg-white/[0.02] rounded-[1.5rem] border border-black/5 dark:border-white/5 p-6 border-l-4 border-l-indigo-500/40">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{faq.q}</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <aside className="space-y-8">
                    {/* Feedback Section */}
                    <div className="space-y-4">
                        <h2 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
                            <Heart className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                            Insights
                        </h2>
                        <div className="kz-card-rich p-8 text-center space-y-4 bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10">
                            <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto text-slate-500 border border-black/5 dark:border-white/5">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <h3 className="font-mono-tech font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-widest">Feedback Terminal</h3>
                            <p className="text-[10px] font-mono-tech font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
                                {isFeedbackUnlocked ? 'CHANNEL_OPEN' : 'ENCRYPTION_ACTIVE'}
                            </p>
                            <button disabled={!isFeedbackUnlocked} className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-widest disabled:opacity-20">
                                Launch
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
