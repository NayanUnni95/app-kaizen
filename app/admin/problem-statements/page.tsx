"use client"

import { useEffect, useState } from "react"
import {
    Plus,
    FileText,
    Eye,
    EyeOff,
    Trash2,
    Edit3,
    Loader2,
    ToggleLeft,
    ToggleRight,
    Rocket,
    Search,
    ChevronDown,
    ExternalLink,
    Sparkles,
    AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import { ProblemStatementModal } from "@/components/hackathon/ProblemStatementModal"

export default function ProblemStatementsPage() {
    const [statements, setStatements] = useState<any[]>([])
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedEventId, setSelectedEventId] = useState<string>("all")
    const [search, setSearch] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editData, setEditData] = useState<any>(null)
    const [togglingRelease, setTogglingRelease] = useState<string | null>(null)
    const [togglingVisibility, setTogglingVisibility] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => {
        fetchEvents()
        fetchStatements()
    }, [])

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/hackathon/admin/events")
            if (!res.ok) throw new Error("Failed")
            const data = await res.json()
            setEvents(data)
        } catch {
            toast.error("Could not load events")
        }
    }

    const fetchStatements = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/admin/problem-statements")
            if (!res.ok) throw new Error("Failed")
            const data = await res.json()
            setStatements(data)
        } catch {
            toast.error("Could not load problem statements")
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleRelease = async (eventId: string, currentValue: boolean) => {
        setTogglingRelease(eventId)
        try {
            const res = await fetch("/api/hackathon/admin/problem-statements/release", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId,
                    is_pb_statement_released: !currentValue,
                }),
            })
            if (!res.ok) throw new Error("Failed to toggle release")
            toast.success(
                !currentValue
                    ? "Problem statements released to teams!"
                    : "Problem statements hidden from teams"
            )
            fetchEvents()
            fetchStatements()
        } catch {
            toast.error("Failed to toggle release status")
        } finally {
            setTogglingRelease(null)
        }
    }

    const handleToggleVisibility = async (id: string, currentValue: boolean) => {
        setTogglingVisibility(id)
        try {
            const res = await fetch("/api/hackathon/admin/problem-statements", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, is_visible: !currentValue }),
            })
            if (!res.ok) throw new Error("Failed to toggle visibility")
            toast.success(!currentValue ? "Statement now visible" : "Statement hidden")
            fetchStatements()
        } catch {
            toast.error("Failed to toggle visibility")
        } finally {
            setTogglingVisibility(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this problem statement?")) return
        setDeletingId(id)
        try {
            const res = await fetch(`/api/hackathon/admin/problem-statements?id=${id}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Failed to delete")
            toast.success("Problem statement deleted")
            fetchStatements()
        } catch {
            toast.error("Failed to delete")
        } finally {
            setDeletingId(null)
        }
    }

    const handleEdit = (statement: any) => {
        setEditData(statement)
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        setEditData(null)
        setIsModalOpen(true)
    }

    // Filtered statements
    const filteredStatements = statements
        .filter((s) =>
            selectedEventId === "all" ? true : s.eventId === selectedEventId
        )
        .filter(
            (s) =>
                s.title.toLowerCase().includes(search.toLowerCase()) ||
                s.description?.toLowerCase().includes(search.toLowerCase())
        )

    // Group statements by event
    const groupedByEvent: Record<string, any[]> = {}
    filteredStatements.forEach((s) => {
        const eventName = s.event?.name || "Unknown Event"
        if (!groupedByEvent[eventName]) groupedByEvent[eventName] = []
        groupedByEvent[eventName].push(s)
    })

    // Get event release status
    const getEventReleaseStatus = (eventId: string) => {
        const event = events.find((e) => e.id === eventId)
        return (event?.settings as any)?.is_pb_statement_released ?? false
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter">
                                Problem Statements
                            </h1>
                            <p className="text-zinc-500 font-medium italic">
                                Architect challenges for hackathon participants.
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 px-8 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    New Statement
                </button>
            </header>

            {/* Event Release Controls */}
            <section className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <Rocket className="w-4 h-4" />
                    Event Release Control
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => {
                        const isReleased = (event.settings as any)?.is_pb_statement_released ?? false
                        const statementCount = statements.filter((s) => s.eventId === event.id).length
                        const visibleCount = statements.filter(
                            (s) => s.eventId === event.id && (s.meta as any)?.is_visible
                        ).length
                        const isToggling = togglingRelease === event.id

                        return (
                            <div
                                key={event.id}
                                className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${isReleased
                                        ? "bg-emerald-500/5 border-emerald-500/20"
                                        : "bg-zinc-900/50 border-white/5"
                                    }`}
                            >
                                {/* Decorative gradient */}
                                {isReleased && (
                                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                )}

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-bold text-white text-sm">
                                                {event.name}
                                            </p>
                                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-0.5">
                                                {statementCount} statement{statementCount !== 1 ? "s" : ""} · {visibleCount} visible
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isReleased
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : "bg-zinc-800 text-zinc-500"
                                                }`}
                                        >
                                            {isReleased ? "LIVE" : "DRAFT"}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleToggleRelease(event.id, isReleased)}
                                        disabled={isToggling}
                                        className={`w-full flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isReleased
                                                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                                                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                                            }`}
                                    >
                                        {isToggling ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : isReleased ? (
                                            <>
                                                <ToggleRight className="w-4 h-4" />
                                                Revoke Release
                                            </>
                                        ) : (
                                            <>
                                                <ToggleLeft className="w-4 h-4" />
                                                Release to Teams
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )
                    })}

                    {events.length === 0 && (
                        <div className="col-span-full text-center py-10 text-zinc-600 italic">
                            No events found. Create an event first.
                        </div>
                    )}
                </div>
            </section>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search statements..."
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 h-12 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                </div>
                <div className="relative">
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    <select
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        className="h-12 bg-zinc-900 border border-white/5 rounded-2xl pl-4 pr-10 text-sm font-bold text-zinc-400 focus:outline-none focus:border-amber-500/50 transition-colors appearance-none"
                    >
                        <option value="all">All Events</option>
                        {events.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Statements Cards */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    <p className="text-zinc-500 text-sm mt-4 font-bold uppercase tracking-widest">
                        Loading statements...
                    </p>
                </div>
            ) : filteredStatements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 border border-white/5 rounded-3xl">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-zinc-600" />
                    </div>
                    <p className="text-zinc-500 font-bold text-lg mb-1">No problem statements</p>
                    <p className="text-zinc-600 text-sm">
                        Create your first challenge to get started
                    </p>
                </div>
            ) : (
                Object.entries(groupedByEvent).map(([eventName, stmts]) => {
                    const eventId = stmts[0]?.eventId
                    const isEventReleased = getEventReleaseStatus(eventId)

                    return (
                        <section key={eventName} className="space-y-4">
                            {/* Event group header */}
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${isEventReleased ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
                                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">
                                    {eventName}
                                </h3>
                                {isEventReleased && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        Released
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {stmts.map((stmt: any) => {
                                    const isVisible = (stmt.meta as any)?.is_visible ?? false
                                    const isTogglingVis = togglingVisibility === stmt.id
                                    const isDeleting = deletingId === stmt.id

                                    return (
                                        <div
                                            key={stmt.id}
                                            className={`group relative rounded-2xl border transition-all hover:border-white/10 ${isVisible
                                                    ? "bg-zinc-900/60 border-amber-500/10"
                                                    : "bg-zinc-900/30 border-white/5 opacity-80"
                                                }`}
                                        >
                                            {/* Top accent line */}
                                            <div
                                                className={`absolute top-0 left-6 right-6 h-px ${isVisible
                                                        ? "bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
                                                        : "bg-transparent"
                                                    }`}
                                            />

                                            <div className="p-6">
                                                {/* Header row */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isVisible
                                                                    ? "bg-amber-500/10 text-amber-400"
                                                                    : "bg-zinc-800 text-zinc-500"
                                                                }`}
                                                        >
                                                            <Sparkles className="w-5 h-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="font-bold text-white text-sm truncate">
                                                                {stmt.title}
                                                            </h4>
                                                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-0.5">
                                                                {new Date(stmt.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <span
                                                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isVisible
                                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                                    : "bg-zinc-800 text-zinc-500"
                                                                }`}
                                                        >
                                                            {isVisible ? "VISIBLE" : "HIDDEN"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                {stmt.description && (
                                                    <p className="text-sm text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                                                        {stmt.description}
                                                    </p>
                                                )}

                                                {/* Asset link */}
                                                {stmt.assetUrl && (
                                                    <a
                                                        href={stmt.assetUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold mb-4 transition-colors"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                        View Asset
                                                    </a>
                                                )}

                                                {/* Action buttons */}
                                                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                                    <button
                                                        onClick={() => handleToggleVisibility(stmt.id, isVisible)}
                                                        disabled={isTogglingVis}
                                                        className={`flex items-center gap-2 px-3 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isVisible
                                                                ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                                                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                                            }`}
                                                    >
                                                        {isTogglingVis ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : isVisible ? (
                                                            <EyeOff className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <Eye className="w-3.5 h-3.5" />
                                                        )}
                                                        {isVisible ? "Hide" : "Show"}
                                                    </button>

                                                    <button
                                                        onClick={() => handleEdit(stmt)}
                                                        className="flex items-center gap-2 px-3 h-9 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(stmt.id)}
                                                        disabled={isDeleting}
                                                        className="flex items-center gap-2 px-3 h-9 rounded-xl bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all ml-auto"
                                                    >
                                                        {isDeleting ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        )}
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )
                })
            )}

            {/* Info Banner */}
            <section className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-zinc-300 mb-1">How it works</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Create problem statements and assign them to events. Use the <strong className="text-zinc-400">visibility toggle</strong> to
                        control which individual statements teams can see. Use the <strong className="text-zinc-400">event release control</strong> above
                        to release all visible statements for an event at once. Teams will only see
                        statements that are both released at the event level AND individually marked
                        as visible.
                    </p>
                </div>
            </section>

            {/* Modal */}
            <ProblemStatementModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditData(null)
                }}
                onSuccess={() => {
                    fetchStatements()
                    fetchEvents()
                }}
                editData={editData}
            />
        </div>
    )
}
