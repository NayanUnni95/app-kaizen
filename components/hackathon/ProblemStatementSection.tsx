"use client"

import { useEffect, useState } from "react"
import {
    Activity,
    ChevronRight,
    Clock,
    ExternalLink,
    FileText,
    Lock,
    Sparkles,
    Loader2,
    X,
} from "lucide-react"

export function ProblemStatementSection({ startsAt }: { startsAt?: string | null }) {
    const [statements, setStatements] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isReleased, setIsReleased] = useState(false)
    const [selectedStmt, setSelectedStmt] = useState<any>(null)

    useEffect(() => {
        fetchStatements()
    }, [])

    const fetchStatements = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/team/problem-statements")
            if (!res.ok) throw new Error("Failed")
            const data = await res.json()
            setStatements(data)
            setIsReleased(data.length > 0)
        } catch {
            // Silently fail – team might not have event
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="md:col-span-2 kz-card-rich p-8 flex items-center justify-center min-h-[180px] bg-white/[0.01]">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            </div>
        )
    }

    // Not released or no visible statements — show Coming Soon
    if (!isReleased || statements.length === 0) {
        return (
            <div className="kz-card-rich p-10 relative overflow-hidden group bg-white/[0.02] border-white/5">
                <div className="flex flex-col sm:flex-row items-center gap-10 h-full">
                    <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-indigo-500/30 transition-all duration-500">
                        <Activity className="w-8 h-8 text-slate-600 group-hover:text-indigo-400 transition-colors" strokeWidth={1} />
                    </div>
                    <div className="flex-1 space-y-4 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <h3 className="font-heading font-black text-3xl text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                                Problem Statement
                            </h3>
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-mono-tech font-black bg-white/5 text-slate-500 border border-white/5 uppercase tracking-[0.2em]">
                                ENCRYPTED
                            </span>
                        </div>
                        <p className="text-[14px] text-slate-500 leading-relaxed font-bold max-w-xl">
                            The problem statement for your track will be officially released at
                            the start of the hackathon. Prepare your tools!
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-6">
                            <button
                                disabled
                                className="px-6 py-2.5 rounded-xl bg-white/5 text-slate-700 text-[10px] font-mono-tech font-black flex items-center gap-2.5 cursor-not-allowed border border-white/5 uppercase tracking-widest"
                            >
                                <Lock className="w-3.5 h-3.5" strokeWidth={2} />
                                Unlocking Soon
                            </button>
                            <p className="text-[10px] font-mono-tech font-bold text-slate-600 uppercase tracking-[0.2em]">
                                RELEASE:{" "}
                                {startsAt
                                    ? new Date(startsAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                    : "TBD_WINDOW"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Released — show clickable problem statement cards + modal
    return (
        <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2 px-1">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-indigo-500 text-white text-[10px] font-bold shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                    <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} />
                </div>
                <h3 className="text-[12px] font-bold text-slate-900 dark:text-white tracking-widest uppercase">
                    Problem Statement
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-mono-tech font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-[0.2em] animate-pulse">
                    BROADCAST_LIVE
                </span>
            </div>

            <div className="space-y-3">
                {statements.map((stmt: any, index: number) => (
                    <button
                        key={stmt.id}
                        onClick={() => setSelectedStmt(stmt)}
                        className="w-full text-left kz-card-rich p-6 group cursor-pointer hover:bg-white/[0.04] transition-all duration-500 border-white/5 active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-6">
                            <div className="kz-icon-rich w-12 h-12 bg-white/5 border-white/10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shrink-0">
                                <span className="text-lg font-mono-tech font-bold">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-heading font-black text-slate-900 dark:text-white text-xl tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                                    {stmt.title}
                                </h4>
                                {stmt.description && (
                                    <p className="text-[11px] font-mono-tech font-bold text-slate-500 uppercase tracking-widest mt-1.5 line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                        AUTH_{stmt.id.slice(0, 8).toUpperCase()}
                                    </p>
                                )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                    </button>
                ))}
            </div>

            {/* ─── Detail Modal ──────────────────────── */}
            {selectedStmt && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
                    onClick={() => setSelectedStmt(null)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Modal */}
                    <div
                        className="relative w-full max-w-xl bg-white dark:bg-[#080808] border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 max-h-[85vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top accent */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                        {/* Close button */}
                        <button
                            onClick={() => setSelectedStmt(null)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white border border-white/10 transition-all z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="overflow-y-auto p-10">
                            {/* Number badge + header */}
                            <div className="flex items-start gap-6 mb-10">
                                <div className="kz-icon-rich w-16 h-16 border-white/10 shrink-0 bg-indigo-500/10 text-indigo-400">
                                    <Sparkles className="w-7 h-7" strokeWidth={1.5} />
                                </div>
                                <div className="flex flex-col pt-1">
                                    <p className="text-[10px] font-mono-tech font-bold text-indigo-400 uppercase tracking-[0.2em] mb-2">
                                        Problem Statement
                                    </p>
                                    <h2 className="font-heading font-black text-3xl text-slate-900 dark:text-white tracking-tighter leading-tight uppercase">
                                        {selectedStmt.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Description */}
                            {selectedStmt.description && (
                                <div className="mb-10">
                                    <h4 className="text-[10px] font-mono-tech font-bold text-slate-600 uppercase tracking-widest mb-4">
                                        Description
                                    </h4>
                                    <div className="kz-card-rich p-6 border-white/5 bg-white/[0.02]">
                                        <p className="text-[14px] text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                                            {selectedStmt.description}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Asset link */}
                            {selectedStmt.assetUrl && (
                                <div className="mb-10">
                                    <h4 className="text-[10px] font-mono-tech font-bold text-slate-600 uppercase tracking-widest mb-4">
                                        Asset
                                    </h4>
                                    <a
                                        href={selectedStmt.assetUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-5 p-6 kz-card-rich border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all group"
                                    >
                                        <div className="kz-icon-rich w-12 h-12 border-white/10 bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] shrink-0">
                                            <ExternalLink className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-white uppercase tracking-tight">
                                                UPLINK_DATA_STREAM
                                            </p>
                                            <p className="text-[10px] font-mono-tech text-indigo-400 truncate opacity-70">
                                                {selectedStmt.assetUrl}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                    </a>
                                </div>
                            )}

                            {/* Timestamp */}
                            {/* Timestamp */}
                            <div className="flex items-center gap-3 text-[10px] font-mono-tech font-bold text-slate-700 uppercase tracking-widest pt-8 border-t border-white/5">
                                <Clock className="w-3 h-3" />
                                <span>
                                    SYNCED_{new Date(selectedStmt.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
