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
            <div className="md:col-span-2 kz-card-premium p-1 relative overflow-hidden">
                <div className="p-5 flex items-center justify-center h-full min-h-[180px]">
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                </div>
            </div>
        )
    }

    // Not released or no visible statements — show Coming Soon
    if (!isReleased || statements.length === 0) {
        return (
            <div className="md:col-span-2 kz-card-premium p-1 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(at_top_right,_#2563EB_0%,_transparent_50%)]" />
                <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-6 h-full">
                    <div className="kz-icon-container w-20 h-20 bg-slate-50 flex-shrink-0">
                        <Activity className="w-10 h-10 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-heading font-bold text-xl text-[#0F172A]">
                                Problem Statement
                            </h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider">
                                Coming Soon
                            </span>
                        </div>
                        <p className="text-sm text-[#64748B] leading-relaxed max-w-md">
                            The problem statement for your track will be officially released at
                            the start of the hackathon. Prepare your tools!
                        </p>
                        <div className="pt-2 flex items-center gap-3">
                            <button
                                disabled
                                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold flex items-center gap-2 cursor-not-allowed border border-slate-200"
                            >
                                <Lock className="w-3.5 h-3.5" />
                                Unlocking Soon
                            </button>
                            <p className="text-[10px] font-medium text-slate-400">
                                Release:{" "}
                                {startsAt
                                    ? new Date(startsAt).toLocaleDateString()
                                    : "TBD"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Released — show clickable problem statement cards + modal
    return (
        <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-heading font-bold text-base text-[#0F172A]">
                    Problem Statements
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                    Live
                </span>
            </div>

            <div className="space-y-3">
                {statements.map((stmt: any, index: number) => (
                    <button
                        key={stmt.id}
                        onClick={() => setSelectedStmt(stmt)}
                        className="w-full text-left kz-card-premium p-1 relative overflow-hidden group cursor-pointer hover:shadow-md transition-all"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
                        <div className="p-4 sm:p-5 flex items-center gap-4">
                            <div className="kz-icon-container w-12 h-12 bg-amber-50 flex-shrink-0">
                                <span className="text-lg font-bold text-amber-600">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-heading font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors truncate">
                                    {stmt.title}
                                </h4>
                                {stmt.description && (
                                    <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">
                                        {stmt.description}
                                    </p>
                                )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#CBD5E1] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
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
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 max-h-[85vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top accent */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

                        {/* Close button */}
                        <button
                            onClick={() => setSelectedStmt(null)}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Modal content (scrollable) */}
                        <div className="overflow-y-auto p-6 sm:p-8">
                            {/* Number badge + header */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="kz-icon-container w-14 h-14 bg-amber-50 flex-shrink-0 rounded-2xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-amber-500" />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                                        Problem Statement
                                    </p>
                                    <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#0F172A] leading-tight">
                                        {selectedStmt.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Description */}
                            {selectedStmt.description && (
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                                        Description
                                    </h4>
                                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                        <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-wrap">
                                            {selectedStmt.description}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Asset link */}
                            {selectedStmt.assetUrl && (
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                                        Reference Material
                                    </h4>
                                    <a
                                        href={selectedStmt.assetUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 rounded-2xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <ExternalLink className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[#1D4ED8] group-hover:text-[#1E40AF] transition-colors">
                                                View Reference Material
                                            </p>
                                            <p className="text-xs text-blue-400 truncate">
                                                {selectedStmt.assetUrl}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-blue-300 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                                    </a>
                                </div>
                            )}

                            {/* Timestamp */}
                            <div className="flex items-center gap-2 text-[10px] text-[#94A3B8] font-medium pt-2 border-t border-slate-100">
                                <Clock className="w-3 h-3" />
                                <span>
                                    Published{" "}
                                    {new Date(selectedStmt.createdAt).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
