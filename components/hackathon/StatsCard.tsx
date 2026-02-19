import { LucideIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    color?: "blue" | "purple" | "green" | "yellow" | "red"
}

export function StatsCard({ title, value, icon: Icon, description, color = "blue" }: StatsCardProps) {
    const colors = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        green: "text-green-500 bg-green-500/10 border-green-500/20",
        yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
        red: "text-red-500 bg-red-500/10 border-red-500/20",
    }

    return (
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 transition-all hover:bg-zinc-900 hover:border-white/10 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl border ${colors[color]} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div>
                <h3 className="text-zinc-500 text-sm font-semibold uppercase tracking-wider mb-1">{title}</h3>
                <p className="text-3xl font-black tracking-tight text-white">{value}</p>
                {description && (
                    <p className="text-zinc-500 text-xs mt-2 font-medium">{description}</p>
                )}
            </div>
        </div>
    )
}
