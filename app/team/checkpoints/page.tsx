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

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 pt-8 px-4 sm:px-6 kz-mesh-bg min-h-screen">
            {/* ─── Milestones Header ───────────────────────── */}
            <header className="kz-animate-fade-in text-left space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white ring-8 ring-slate-50 shadow-xl">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tighter leading-none">Milestones</h1>
                        <span className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">Track your progress and complete key tasks</span>
                    </div>
                </div>
                <p className="text-slate-400 text-base sm:text-lg font-semibold max-w-3xl leading-relaxed">
                    Monitor your project's development. Each milestone represents a key stage in the event completion process.
                </p>
                <div className="h-0.5 w-12 bg-indigo-600 rounded-full" />
            </header>

            {/* Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center gap-6 py-48 kz-card-rich bg-white/50 backdrop-blur-md">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Loading Milestones...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {displayCheckpoints.map((cp, i) => {
                        const status = (cp as any).teamProgress?.status || 'PENDING'
                        const hasAccess = !!(cp as any).teamProgress
                        const isLocked = !hasAccess

                        return (
                            <div
                                key={cp.id}
                                className={`
                                    relative flex flex-col p-10 h-full transition-all duration-700
                                    kz-animate-slide-up group w-full
                                    ${isLocked
                                        ? "opacity-60 grayscale"
                                        : "hover:scale-[1.01] active:scale-[0.99]"
                                    }
                                `}
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="kz-card-rich h-full flex flex-col p-5 sm:p-8 md:p-10 bg-white hover:bg-white group-hover:border-indigo-500 transition-all duration-500">
                                    {/* Stage Identification */}
                                    <div className="flex items-center justify-between mb-8 sm:mb-10">
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isLocked ? 'text-slate-600' : 'text-indigo-400'}`}>
                                                Stage 0{cp.order}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">
                                                {isLocked ? 'Locked' : 'Available'}
                                            </span>
                                        </div>

                                        <div className={`kz-icon-rich w-10 h-10 sm:w-12 sm:h-12 transition-all duration-500 ${isLocked ? 'bg-white/5 text-slate-700 border-white/5' : 'bg-white/10 text-white border-white/10 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-400'}`}>
                                            {isLocked ? <Lock className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" /> : <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />}
                                        </div>
                                    </div>

                                    {/* Title & Core Meta */}
                                    <div className="space-y-4 mb-8 sm:mb-10 flex-1">
                                        <h2 className={`font-heading font-black text-2xl sm:text-3xl tracking-tighter leading-[0.9] ${isLocked ? 'text-slate-600' : 'text-white'}`}>
                                            {cp.title}
                                        </h2>
                                        <p className={`text-[13px] sm:text-[14px] leading-relaxed font-semibold ${isLocked ? 'text-slate-700' : 'text-slate-400'}`}>
                                            {cp.description || "Parameters for this operational phase have not been broadcasted by the control center."}
                                        </p>
                                    </div>

                                    {/* Bottom Controller */}
                                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                        {!isLocked ? (
                                            <Link
                                                href={`/team/checkpoints/${cp.id}`}
                                                className="text-[11px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-all flex items-center gap-3 group/link"
                                            >
                                                Open Task
                                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover/link:bg-indigo-600 group-hover/link:text-white transition-all">
                                                    <ArrowRight className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                                                <span className="text-[11px] font-black uppercase tracking-widest">Access Restricted</span>
                                            </div>
                                        )}

                                        {hasAccess && (
                                            <div className="kz-status-chip h-auto py-1 px-3 border-white/10 bg-white/5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${status === 'APPROVED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                    status === 'SUBMITTED' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' :
                                                        'bg-slate-700'
                                                    }`} />
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${status === 'APPROVED' ? 'text-emerald-400' :
                                                    status === 'SUBMITTED' ? 'text-indigo-400' :
                                                        'text-slate-500'
                                                    }`}>
                                                    {status === 'PENDING' ? 'READY' : status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
