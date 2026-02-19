import { prisma } from "@/lib/prisma"
import { StatsCard } from "@/components/hackathon/StatsCard"
import {
    Users,
    Calendar,
    CheckSquare,
    Upload,
    Activity,
    Clock
} from "lucide-react"

export default async function AdminDashboard() {
    // Fetch counts for the overview
    const [teamCount, eventCount, checkpointCount, submissionCount] = await Promise.all([
        prisma.team.count(),
        prisma.event.count(),
        prisma.checkpoint.count(),
        prisma.submission.count(),
    ])

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter">System Overview</h1>
                <p className="text-zinc-500 font-medium">Monitoring track for the current hackathon cycle.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Active Teams"
                    value={teamCount}
                    icon={Users}
                    color="blue"
                    description="Total registered teams"
                />
                <StatsCard
                    title="Live Events"
                    value={eventCount}
                    icon={Calendar}
                    color="purple"
                    description="Ongoing and upcoming"
                />
                <StatsCard
                    title="Checkpoints"
                    value={checkpointCount}
                    icon={CheckSquare}
                    color="green"
                    description="Milestones defined"
                />
                <StatsCard
                    title="Submissions"
                    value={submissionCount}
                    icon={Upload}
                    color="yellow"
                    description="Awaiting review"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-900/30 border border-white/5 rounded-3xl p-8 h-80 flex flex-col items-center justify-center text-center">
                    <Activity className="w-12 h-12 text-zinc-700 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Registration Trends</h3>
                    <p className="text-zinc-500 text-sm max-w-xs">Chart data will appear here once the event cycle starts receiving live traffic.</p>
                </div>

                <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <h3 className="font-bold">Recent Activity</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-1 h-10 bg-blue-500/20 rounded-full" />
                            <div>
                                <p className="text-sm font-semibold">Admin Panel Online</p>
                                <p className="text-xs text-zinc-500">System initialized successfully</p>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-600 text-center py-10 italic">No recent log entries to display</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
