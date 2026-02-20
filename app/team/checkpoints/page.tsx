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
        <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4">
            {/* Header Content */}
            <header className="kz-animate-fade-in text-left">
                <h1 className="font-heading font-black text-5xl text-[#0F172A] tracking-tighter leading-none mb-4">Milestones</h1>
                <p className="text-[#64748B] text-lg font-medium max-w-2xl">
                    Follow the roadmap to success. Unlock milestones by tracking your progress.
                </p>
            </header>

            {/* Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center gap-6 py-40 bg-white/50 rounded-[3rem] border border-dashed border-slate-200">
                    <Loader2 className="w-12 h-12 animate-spin text-black" />
                    <p className="text-black font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Architecture</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {checkpoints.map((cp, i) => {
                        const status = (cp as any).teamProgress?.status || 'PENDING'

                        // Logic for unlocking: Admin provides access by creating a progress record
                        const hasAccess = !!(cp as any).teamProgress
                        const isLocked = !hasAccess

                        return (
                            <div
                                key={cp.id}
                                className={`
                                    relative flex flex-col p-12 rounded-[3.5rem] bg-white border-2 transition-all duration-700
                                    kz-animate-slide-up
                                    ${isLocked
                                        ? "border-[#E6E9EE]/40"
                                        : "border-[#E6E9EE] hover:border-black hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)]"
                                    }
                                `}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {/* Checkpoint Label Pill + Arrow Button */}
                                <div className="flex items-center justify-between mb-10">
                                    <div className="px-6 py-3 rounded-full bg-black flex items-center justify-center">
                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.25em]">
                                            Checkpoint {cp.order}
                                        </span>
                                    </div>

                                    {isLocked ? (
                                        // Locked state icon - Matches image circle but non-interactive
                                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 shadow-inner group cursor-not-allowed">
                                            <ArrowRight className="w-7 h-7 opacity-30" strokeWidth={3} />
                                        </div>
                                    ) : (
                                        // Interactive arrow button
                                        <Link
                                            href={`/team/checkpoints/${cp.id}`}
                                            className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white shadow-2xl shadow-black/20 hover:scale-110 active:scale-95 transition-all group"
                                        >
                                            <ArrowRight className="w-7 h-7 transition-all group-hover:translate-x-1" strokeWidth={3} />
                                        </Link>
                                    )}
                                </div>

                                {/* Title - Matching Image Typography */}
                                <h2 className={`font-heading font-black text-4xl tracking-tighter mb-8 leading-[1] ${isLocked ? 'text-slate-900/40' : 'text-black'}`}>
                                    {cp.title}
                                </h2>

                                {/* Description - Matching Image Styles */}
                                <p className={`text-base leading-relaxed font-medium mb-14 flex-1 ${isLocked ? 'text-slate-400/60' : 'text-[#64748B]'}`}>
                                    {cp.description || "Complete the required tasks and document your progress to move forward."}
                                </p>

                                {/* Bottom Link - Matching "OPEN TASKS" Footer */}
                                <div className="mt-auto flex items-end justify-end">
                                    {!isLocked ? (
                                        <Link
                                            href={`/team/checkpoints/${cp.id}`}
                                            className="text-[11px] font-black text-black/40 uppercase tracking-[0.25em] hover:text-black transition-all duration-300 flex items-center gap-2 group"
                                        >
                                            Open Tasks <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" strokeWidth={4} />
                                        </Link>
                                    ) : (
                                        <div className="flex flex-col items-end gap-2 text-right">
                                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-1">Opening Soon</span>
                                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.25em] flex items-center gap-2 cursor-not-allowed">
                                                Open Tasks <ArrowRight className="w-3 h-3" strokeWidth={4} />
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
