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
        <div className="max-w-4xl mx-auto space-y-12 pb-20 pt-4 px-4 overflow-hidden">
            {/* Header */}
            <header className="kz-animate-fade-in">
                <h1 className="font-heading font-black text-5xl text-[#0F172A] tracking-tighter leading-none mb-4">Meta View</h1>
                <p className="text-[#64748B] text-lg font-medium max-w-2xl">
                    Executive overview, global stats, and event intelligence.
                </p>
            </header>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="kz-card-premium p-8 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-blue-600">
                        <Layout className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Teams</p>
                        <h3 className="text-4xl font-black text-black tracking-tight">{totalTeams}</h3>
                    </div>
                </div>
                <div className="kz-card-premium p-8 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Students</p>
                        <h3 className="text-4xl font-black text-black tracking-tight">{totalMembers}</h3>
                    </div>
                </div>
            </section>

            {/* About & FAQ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <section className="md:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <h2 className="font-black text-xl text-black flex items-center gap-2 uppercase tracking-tight">
                            <Info className="w-5 h-5 text-blue-600" />
                            Mission Protocol
                        </h2>
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 text-slate-600 leading-relaxed font-medium">
                            Kaizen is more than a hackathon; it's a crucible for technical excellence and innovative disruption.
                            Our goal is to push the boundaries of collective intelligence through 48 hours of intense creation.
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-black text-xl text-black flex items-center gap-2 uppercase tracking-tight">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                            Knowledge Base
                        </h2>
                        <div className="space-y-3">
                            {[
                                { q: "How are checkpoints verified?", a: "Mentors will visit your table to verify milestone completion in person." },
                                { q: "Can we change track midway?", a: "Track changes require admin approval and must be done within 6 hours of start." }
                            ].map((faq, i) => (
                                <div key={i} className="bg-white rounded-[1.5rem] border border-slate-100 p-6">
                                    <h4 className="font-bold text-black text-sm mb-2">{faq.q}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <aside className="space-y-8">
                    {/* Feedback Section */}
                    <div className="space-y-4">
                        <h2 className="font-black text-xl text-black flex items-center gap-2 uppercase tracking-tight">
                            <Heart className="w-5 h-5 text-rose-500" />
                            Insights
                        </h2>
                        <div className={`
                            kz-card-premium p-8 text-center space-y-4
                            ${!isFeedbackUnlocked ? 'opacity-50 grayscale' : ''}
                        `}>
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-black text-sm">Feedback Terminal</h3>
                            <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                                {isFeedbackUnlocked ? 'Submit your experience' : 'Encryption Active — Unlocked later'}
                            </p>
                            <button disabled={!isFeedbackUnlocked} className="w-full py-3 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] disabled:bg-slate-100 disabled:text-slate-300">
                                Launch
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
