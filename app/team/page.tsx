import { auth } from "@/auth"
import { getTeamById } from "@/lib/hackathon/teams"
import { StatsCard } from "@/components/hackathon/StatsCard"
import {
    Zap,
    CheckSquare,
    Calendar,
    Users,
    ChevronRight,
    Bell
} from "lucide-react"
import Link from "next/link"

export default async function TeamDashboard() {
    const session = await auth()
    const teamId = (session?.user as any).teamId
    const team = await getTeamById(teamId)

    if (!team) return <div>Team not found</div>

    const completedCheckpoints = team.progress.filter(p => p.status === 'APPROVED').length
    const totalCheckpoints = team.event.checkpoints.length

    return (
        <div className="space-y-8 pb-10">
            {/* Hero Section */}
            <header className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-black tracking-tight">{team.name}</h1>
                        <p className="text-zinc-500 font-medium text-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            {team.event.name} • Active
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-400">
                        <Bell className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 shadow-2xl shadow-purple-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10">
                        <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-2">Overall Progress</p>
                        <h2 className="text-4xl font-black text-white mb-6">
                            {completedCheckpoints}/{totalCheckpoints} <span className="text-lg font-bold opacity-60">Milestones</span>
                        </h2>
                        <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-1000 ease-out"
                                style={{ width: `${(completedCheckpoints / (totalCheckpoints || 1)) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Actions/Stats */}
            <div className="grid grid-cols-2 gap-4">
                <StatsCard
                    title="Members"
                    value={team.members.length}
                    icon={Users}
                    color="purple"
                />
                <StatsCard
                    title="Submissions"
                    value={team.submissions.length}
                    icon={Zap}
                    color="blue"
                />
            </div>

            {/* Announcements/Next Checkpoint */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Upcoming Milestone</h3>
                    <Link href="/team/checkpoints" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 group">
                        View All <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Checkpoint #1</p>
                            <h4 className="font-bold text-lg">Initial Idea Pitch</h4>
                            <p className="text-zinc-400 text-sm mt-1 leading-relaxed">Submit your project proposal and tech stack breakdown by midnight.</p>
                        </div>
                        <div className="p-3 bg-zinc-800 rounded-xl">
                            <Calendar className="w-5 h-5 text-zinc-400" />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <Link
                            href="/team/checkpoints"
                            className="w-full flex items-center justify-center h-12 bg-white text-black rounded-xl font-bold text-sm hover:scale-[1.01] transition-all"
                        >
                            Check Requirements
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
