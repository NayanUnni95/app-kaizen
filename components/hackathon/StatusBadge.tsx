import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react"

type StatusType = 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'LIVE' | 'UPCOMING' | 'COMPLETED'

interface StatusBadgeProps {
    status: StatusType
    className?: string
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
    const config: Record<StatusType, { label: string, color: string, icon: any }> = {
        PENDING: { label: "Pending", color: "bg-zinc-800 text-zinc-500", icon: Clock },
        SUBMITTED: { label: "Submitted", color: "bg-blue-500/10 text-blue-400", icon: CheckCircle2 },
        APPROVED: { label: "Approved", color: "bg-green-500/10 text-green-400", icon: CheckCircle2 },
        REJECTED: { label: "Rejected", color: "bg-red-500/10 text-red-400", icon: XCircle },
        LIVE: { label: "Live", color: "bg-green-500/10 text-green-400 animate-pulse", icon: AlertCircle },
        UPCOMING: { label: "Upcoming", color: "bg-blue-500/10 text-blue-400", icon: Clock },
        COMPLETED: { label: "Completed", color: "bg-zinc-800 text-zinc-500", icon: CheckCircle2 },
    }

    const current = config[status] || config.PENDING
    const Icon = current.icon

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 ${current.color} ${className}`}>
            <Icon className="w-3 h-3" />
            {current.label}
        </span>
    )
}
