import { prisma } from "@/lib/prisma"
import { StatsCard } from "@/components/hackathon/StatsCard"
import {
    Calendar,
    CheckSquare,
    Bell,
    Zap,
    Users
} from "lucide-react"

export default async function OrganizerDashboard() {
    // Fetch counts for the overview
    const [teamCount, eventCount, checkpointCount, notificationCount] = await Promise.all([
        prisma.team.count(),
        prisma.event.count(),
        prisma.checkpoint.count(),
        prisma.notification.count(),
    ])

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-teal-500 fill-teal-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500">Event Monitoring</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter">Organizer Overview</h1>
                <p className="text-zinc-500 font-medium italic">Operational status of the current hackathon cycle.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Active Teams"
                    value={teamCount}
                    icon={Users}
                    color="green" // Using green for teal-like feel
                    description="Participants registered"
                />
                <StatsCard
                    title="Live Events"
                    value={eventCount}
                    icon={Calendar}
                    color="blue"
                    description="Coordinated tracks"
                />
                <StatsCard
                    title="Milestones"
                    value={checkpointCount}
                    icon={CheckSquare}
                    color="purple"
                    description="Participant targets"
                />
                <StatsCard
                    title="Broadcasts"
                    value={notificationCount}
                    icon={Bell}
                    color="yellow"
                    description="System-wide alerts"
                />
            </div>

            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                    <Calendar className="w-8 h-8 text-zinc-700" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Ready for Kickoff</h3>
                <p className="text-zinc-500 text-sm max-w-sm">Use the sidebar to manage your events, define milestones, and broadcast updates to teams.</p>
            </div>
        </div>
    )
}
