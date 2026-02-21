"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/hackathon/DataTable"
import { CheckCircle2, XCircle, Clock, ExternalLink, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { StatusBadge } from "@/components/hackathon/StatusBadge"

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([])
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedEventId, setSelectedEventId] = useState<string>("all")
    const [search, setSearch] = useState("")
    const [mainFilter, setMainFilter] = useState<"checkpoint" | "presentation">("checkpoint")
    const [subFilter, setSubFilter] = useState<"all" | "1" | "2" | "other">("all")

    const [viewingSub, setViewingSub] = useState<any>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    useEffect(() => {
        fetchSubmissions()
        fetchEvents()
    }, [])

    const fetchSubmissions = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/admin/submissions")
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setSubmissions(data)
        } catch (error) {
            toast.error("Could not load submissions")
        } finally {
            setIsLoading(false)
        }
    }

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

    const handleReview = async (id: string, status: string) => {
        try {
            const res = await fetch("/api/hackathon/admin/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            })
            if (!res.ok) throw new Error("Review failed")
            toast.success(`Submission ${status.toLowerCase()}ed`)
            fetchSubmissions()
            if (viewingSub?.id === id) setIsViewModalOpen(false)
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const columns = [
        {
            header: "Team/Event",
            accessor: (sub: any) => (
                <div>
                    <p className="font-bold text-white">{sub.team.name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{sub.event.name}</p>
                </div>
            )
        },
        {
            header: "Milestone",
            accessor: (sub: any) => (
                <div className="flex items-center gap-2">
                    <span className="text-zinc-400 font-medium">{sub.checkpoint.title}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: (sub: any) => (
                <StatusBadge status={sub.status} />
            )
        },
        {
            header: "Execution Log",
            accessor: (sub: any) => {
                const items = (sub.submissionData as any)?.items || []
                return (
                    <button
                        onClick={() => {
                            setViewingSub(sub)
                            setIsViewModalOpen(true)
                        }}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {items.length} {items.length === 1 ? 'Entry' : 'Entries'}
                    </button>
                )
            }
        }
    ]

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter">Submissions Queue</h1>
                <p className="text-zinc-500 font-medium italic">Reviewing and validating participant progress.</p>
            </header>

            <DataTable
                columns={columns}
                data={submissions.filter(s => {
                    const matchesEvent = selectedEventId === "all" ? true : s.eventId === selectedEventId
                    const matchesSearch = s.team.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.checkpoint.title.toLowerCase().includes(search.toLowerCase())

                    const isPresentation = s.checkpoint.title.toLowerCase().includes("presentation") || s.checkpoint.title.toLowerCase().includes("submission")
                    const matchesMain = mainFilter === "presentation" ? isPresentation : !isPresentation

                    let matchesSub = true
                    if (mainFilter === "checkpoint") {
                        const order = s.checkpoint.order
                        if (subFilter === "1") matchesSub = order === 1
                        else if (subFilter === "2") matchesSub = order === 2
                        else if (subFilter === "other") matchesSub = order > 2
                    }

                    return matchesEvent && matchesSearch && matchesMain && matchesSub
                })}
                isLoading={isLoading}
                searchPlaceholder="Search submissions..."
                searchValue={search}
                onSearchChange={setSearch}
                filterSlot={
                    <div className="flex items-center gap-3">
                        {/* Main Category Filter */}
                        <div className="flex p-1 bg-zinc-900 border border-white/5 rounded-2xl">
                            <button
                                onClick={() => setMainFilter("checkpoint")}
                                className={`px-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mainFilter === "checkpoint" ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Checkpoints
                            </button>
                            <button
                                onClick={() => setMainFilter("presentation")}
                                className={`px-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mainFilter === "presentation" ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Final Presentation
                            </button>
                        </div>

                        {/* Checkpoint Specific Sub-Filter */}
                        {mainFilter === "checkpoint" && (
                            <select
                                value={subFilter}
                                onChange={(e) => setSubFilter(e.target.value as any)}
                                className="h-12 bg-zinc-900 border border-white/5 rounded-2xl pl-4 pr-10 text-xs font-bold text-zinc-400 focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                            >
                                <option value="all">All Checkpoints</option>
                                <option value="1">1st Checkpoint</option>
                                <option value="2">2nd Checkpoint</option>
                                <option value="other">Other</option>
                            </select>
                        )}

                        <select
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className="h-12 bg-zinc-900 border border-white/5 rounded-2xl pl-4 pr-10 text-xs font-bold text-zinc-400 focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                        >
                            <option value="all">All Events</option>
                            {events.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.name}
                                </option>
                            ))}
                        </select>
                    </div>
                }
                actions={(sub: any) => (
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => handleReview(sub.id, 'REJECTED')}
                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                            title="Reject/Needs Revision"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handleReview(sub.id, 'APPROVED')}
                            className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                            title="Approve"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                        </button>
                    </div>
                )}
            />

            {/* View Modal */}
            {isViewModalOpen && viewingSub && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight text-white">{viewingSub.team.name}</h2>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-loose mt-1">
                                        {viewingSub.event.name} &bull; {viewingSub.checkpoint.title}
                                    </p>
                                </div>
                                <button onClick={() => setIsViewModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Execution Log Data</h3>
                                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {((viewingSub.submissionData as any)?.items || []).map((item: string, idx: number) => (
                                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4 items-start">
                                            <span className="w-6 h-6 rounded-md bg-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-500 shrink-0 mt-0.5">{idx + 1}</span>
                                            <p className="text-sm font-medium text-zinc-300 leading-relaxed">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    <StatusBadge status={viewingSub.status} />
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                        Last Updated: {new Date(viewingSub.updatedAt).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleReview(viewingSub.id, 'REJECTED')}
                                        className="h-10 px-6 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleReview(viewingSub.id, 'APPROVED')}
                                        className="h-10 px-6 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
