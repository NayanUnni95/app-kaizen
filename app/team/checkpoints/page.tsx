"use client"

import { useEffect, useState } from "react"
import { Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { EmptyState } from "@/components/ui/EmptyState"
import Link from "next/link"

interface CheckpointData {
    id: string
    title: string
    description?: string
    order: number
    status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
    teamProgress?: {
        status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
    }
}

export default function TeamCheckpointsPage() {
    const [checkpoints, setCheckpoints] = useState<CheckpointData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchCheckpoints()
    }, [])

    const fetchCheckpoints = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/team/checkpoints")
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setCheckpoints(data)
        } catch {
            toast.error("Could not load checkpoints")
        } finally {
            setIsLoading(false)
        }
    }

    // Ensure exactly 3 checkpoints are shown. Merge real data with placeholders.
    const MOCK_CHECKPOINTS = [
        { id: 'mock-1', title: 'Ideation & Genesis', description: 'Define your core solution, establish initial system architecture, and map the user journey.', order: 1 },
        { id: 'mock-2', title: 'Functional Prototyping', description: 'Implement the minimum viable features and demonstrate core technical integrity.', order: 2 },
        { id: 'mock-3', title: 'Optimization & Polish', description: 'System stress testing, finalizing documentation, and refining the final pitch.', order: 3 },
    ]

    const displayCheckpoints = MOCK_CHECKPOINTS.map(mock => {
        const real = checkpoints.find(c => c.order === mock.order)
        return real || mock
    })
    if (!isLoading && checkpoints.length === 0) {
        return (
            <div className="max-w-6xl mx-auto py-20 px-4">
                <EmptyState
                    icon={AlertCircle}
                    title="No Checkpoints Found"
                    description="Your event organizer hasn't set up any milestones for your team yet."
                />
            </div>
        )
    }

    return (
        <div className="max-w-none mx-auto space-y-12 pb-24 pt-8 px-4 sm:px-6 kz-mesh-bg min-h-screen">
            {/* ─── Milestones Header ───────────────────────── */}
            <header className="kz-animate-fade-in text-left space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-400">
                        <CheckCircle2 className="w-4.5 h-4.5" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tighter leading-none uppercase">Project Pipeline</h1>
                        <span className="text-[10px] font-mono-tech font-bold text-slate-500 uppercase tracking-widest mt-2">SYS_STATUS: OPERATIONAL_PHASE_MONITOR</span>
                    </div>
                </div>
            </header>

            {/* Pipeline Stream */}
            <div className="relative max-w-2xl mx-auto px-4 sm:px-0">
                {/* Decorative Connector Line */}
                <div className="absolute left-[2.75rem] sm:left-[3.75rem] top-10 bottom-10 w-[2px] bg-black/5 dark:bg-white/5 rounded-full" />

                <div className="flex flex-col gap-1 rest-y-16">
                    {displayCheckpoints.map((cp, i) => {
                        const status = (cp as any).teamProgress?.status || 'PENDING'
                        const hasAccess = !!(cp as any).teamProgress
                        const isLocked = !hasAccess

                        return (
                            <div
                                key={cp.id}
                                className={`
                                    relative flex items-start gap-4 sm:gap-10 transition-all duration-700
                                    kz-animate-slide-up group w-full
                                    ${isLocked
                                        ? "opacity-50 grayscale hover:opacity-70 transition-all duration-700"
                                        : "hover:translate-x-1"
                                    }
                                `}
                                style={{ animationDelay: `${i * 150}ms`, marginBottom: '4rem' }}
                            >
                                {/* Pipeline Node */}
                                <div className="relative z-10 shrink-0 mt-8">
                                    <div className={`
                                        w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-500
                                        ${isLocked
                                            ? 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                                            : 'bg-white dark:bg-[#0D0D0D] border-indigo-500/20 dark:border-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600'}
                                    `}>
                                        <span className="font-heading font-black text-sm sm:text-base">0{cp.order}</span>
                                    </div>
                                    {!isLocked && status === 'APPROVED' && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-white dark:ring-[#080808]">
                                            <CheckCircle2 className="w-3 h-3" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 min-w-0">
                                    <div className="kz-card-rich flex flex-col p-6 sm:p-8 bg-white dark:bg-[#0D0D0D] border-black/5 dark:border-white/5 group-hover:border-indigo-600/30 dark:group-hover:border-indigo-500/30 transition-all duration-500">
                                        {/* Header Info */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-mono-tech font-bold uppercase tracking-[0.25em] ${isLocked ? 'text-slate-500 dark:text-slate-400' : 'text-indigo-500 dark:text-indigo-400'}`}>
                                                    {isLocked ? 'ENCRYPTED_PHASE' : 'PHASE_IDENTIFIED'}
                                                </span>
                                            </div>

                                            <div className={`kz-status-chip h-auto py-1 px-3 border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5`}>
                                                <div className={`w-1 h-1 rounded-full ${status === 'APPROVED' ? 'bg-emerald-500' :
                                                    status === 'SUBMITTED' ? 'bg-indigo-500' :
                                                        'bg-slate-300 dark:bg-slate-700'
                                                    }`} />
                                                <span className={`text-[9px] font-mono-tech font-bold uppercase tracking-wider ${status === 'APPROVED' ? 'text-emerald-600 dark:text-emerald-400' :
                                                    status === 'SUBMITTED' ? 'text-indigo-600 dark:text-indigo-400' :
                                                        'text-slate-400 dark:text-slate-500'
                                                    }`}>
                                                    {status === 'PENDING' ? 'AWAITING' : status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Title & Description */}
                                        <div className="space-y-2 mb-6">
                                            <h2 className={`font-heading font-bold text-xl sm:text-2xl tracking-tight leading-none ${isLocked ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                                {cp.title}
                                            </h2>
                                            <p className={`text-xs sm:text-[13px] leading-relaxed font-medium ${isLocked ? 'text-slate-400 dark:text-slate-600 italic' : 'text-slate-500 dark:text-slate-400 italic'}`}>
                                                {cp.description || "Detailed operational parameters for this phase are locked until prerequisite completion."}
                                            </p>
                                        </div>

                                        {/* Action Bar */}
                                        {!isLocked ? (
                                            <div className="pt-4 border-t border-black/5 dark:border-white/5">
                                                <Link
                                                    href={`/team/checkpoints/${cp.id}`}
                                                    className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:translate-x-1 transition-all group/link"
                                                >
                                                    Access Pipeline
                                                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center gap-2 text-slate-400 dark:text-slate-600">
                                                <Lock className="w-3 h-3" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest">Protocol Restricted</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
