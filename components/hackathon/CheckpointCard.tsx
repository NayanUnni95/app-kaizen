import { LucideIcon, CheckCircle2, Clock, AlertCircle, ChevronRight, Upload } from "lucide-react"

interface CheckpointCardProps {
    title: string
    description?: string
    status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
    dueAt?: Date
    order: number
    isRequired?: boolean
    onAction?: () => void
}

export function CheckpointCard({
    title,
    description,
    status,
    dueAt,
    order,
    isRequired,
    onAction
}: CheckpointCardProps) {
    const statusConfig = {
        PENDING: {
            icon: Clock,
            color: "text-zinc-500 bg-zinc-800",
            label: "Pending",
            actionLabel: "Submit Progress"
        },
        SUBMITTED: {
            icon: Upload,
            color: "text-blue-500 bg-blue-500/10",
            label: "Submitted",
            actionLabel: "View Submission"
        },
        APPROVED: {
            icon: CheckCircle2,
            color: "text-green-500 bg-green-500/10",
            label: "Approved",
            actionLabel: "Completed"
        },
        REJECTED: {
            icon: AlertCircle,
            color: "text-red-500 bg-red-500/10",
            label: "Needs Revision",
            actionLabel: "Resubmit"
        },
    }

    const current = statusConfig[status] || statusConfig.PENDING
    const StatusIcon = current.icon

    return (
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 transition-all hover:border-white/10 group">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 font-black text-xs">
                        {order}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">{title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${current.color}`}>
                                {current.label}
                            </span>
                            {isRequired && (
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Mandatory</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-3 bg-zinc-800/50 rounded-2xl">
                    <StatusIcon className={`w-5 h-5 ${current.color.split(' ')[0]}`} />
                </div>
            </div>

            {description && (
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2">{description}</p>
            )}

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-zinc-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                        {dueAt ? new Date(dueAt).toLocaleDateString() : 'No Deadline'}
                    </span>
                </div>
                <button
                    onClick={onAction}
                    disabled={status === 'APPROVED'}
                    className={`
                        flex items-center gap-2 px-4 h-11 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                        ${status === 'APPROVED'
                            ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                            : "bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5"}
                    `}
                >
                    {current.actionLabel}
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    )
}
