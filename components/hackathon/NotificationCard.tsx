import { Bell, Info, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"

interface NotificationCardProps {
    title: string
    body?: string
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
    createdAt: Date
    isRead?: boolean
    onMarkAsRead?: () => void
}

export function NotificationCard({
    title,
    body,
    type,
    createdAt,
    isRead,
    onMarkAsRead
}: NotificationCardProps) {
    const typeConfig = {
        INFO: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" },
        SUCCESS: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
        WARNING: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        ERROR: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
    }

    const config = typeConfig[type] || typeConfig.INFO
    const Icon = config.icon

    return (
        <div
            onClick={onMarkAsRead}
            className={`
                relative bg-zinc-900 border border-white/5 rounded-2xl p-5 flex gap-4 transition-all group cursor-pointer
                ${!isRead ? "border-l-4 border-l-purple-500 shadow-xl shadow-purple-500/5 bg-zinc-900/80" : "opacity-60 grayscale-[0.5]"}
                hover:border-white/10 hover:scale-[1.01] active:scale-[0.99]
            `}
        >
            <div className={`p-3 rounded-xl h-fit ${config.bg}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white text-sm truncate pr-4">{title}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-600 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                {body && <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mt-1">{body}</p>}

                {!isRead && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                )}
            </div>
        </div>
    )
}
