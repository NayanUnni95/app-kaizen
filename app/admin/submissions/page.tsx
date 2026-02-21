"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/hackathon/DataTable"
import { CheckCircle2, XCircle, Clock, ExternalLink, MessageSquare, Github, Eye } from "lucide-react"
import { toast } from "sonner"
import { StatusBadge } from "@/components/hackathon/StatusBadge"

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([])
    const [projectSubmissions, setProjectSubmissions] = useState<any[]>([])
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
        fetchProjectSubmissions()
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

    const fetchProjectSubmissions = async () => {
        try {
            const res = await fetch("/api/hackathon/admin/project-submissions")
            if (!res.ok) throw new Error("Failed")
            const data = await res.json()
            setProjectSubmissions(data)
        } catch {
            console.error("Could not load project submissions")
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

    const getColumns = () => {
        if (mainFilter === "checkpoint") {
            return [
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
        } else {
            return [
                {
                    header: "Team",
                    accessor: (sub: any) => (
                        <div>
                            <p className="font-bold text-white">{sub.team.name}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{sub.event.name}</p>
                        </div>
                    )
                },
                {
                    header: "Project Details",
                    accessor: (sub: any) => (
                        <div>
                            <p className="font-bold text-zinc-300">{sub.title}</p>
                            <p className="text-xs text-zinc-500 truncate max-w-xs">{sub.description}</p>
                        </div>
                    )
                },
                {
                    header: "Uplinks",
                    accessor: (sub: any) => (
                        <div className="flex items-center gap-3">
                            {sub.repoUrl && (
                                <a href={sub.repoUrl} target="_blank" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
                                    <Github className="w-4 h-4" />
                                </a>
                            )}
                            {sub.demoUrl && (
                                <a href={sub.demoUrl} target="_blank" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                            <button
                                onClick={() => {
                                    setViewingSub({ ...sub, _isProject: true })
                                    setIsViewModalOpen(true)
                                }}
                                className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                                title="View Details"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    )
                },
                {
                    header: "Version",
                    accessor: (sub: any) => (
                        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-indigo-500/20">
                            v{sub.version}
                        </span>
                    )
                }
            ]
        }
    }

    const filteredData = mainFilter === "checkpoint"
        ? submissions.filter(s => {
            const matchesEvent = selectedEventId === "all" ? true : s.eventId === selectedEventId
            const matchesSearch = s.team.name.toLowerCase().includes(search.toLowerCase()) ||
                s.checkpoint.title.toLowerCase().includes(search.toLowerCase())

            // Filter out presentation/final from checkpoints
            const isPresentation = s.checkpoint.title.toLowerCase().includes("presentation") || s.checkpoint.title.toLowerCase().includes("submission")
            if (isPresentation) return false

            let matchesSub = true
            const order = s.checkpoint.order
            if (subFilter === "1") matchesSub = order === 1
            else if (subFilter === "2") matchesSub = order === 2
            else if (subFilter === "other") matchesSub = order > 2

            return matchesEvent && matchesSearch && matchesSub
        })
        : projectSubmissions.filter(s => {
            const matchesEvent = selectedEventId === "all" ? true : s.eventId === selectedEventId
            const matchesSearch = s.team.name.toLowerCase().includes(search.toLowerCase()) ||
                s.title.toLowerCase().includes(search.toLowerCase())
            return matchesEvent && matchesSearch
        })

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter">Submissions Queue</h1>
                <p className="text-zinc-500 font-medium italic">Reviewing and validating participant progress.</p>
            </header>

            <DataTable
                columns={getColumns()}
                data={filteredData}
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
                actions={mainFilter === "checkpoint" ? (sub: any) => (
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
                ) : undefined}
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
                                        {viewingSub.event.name} &bull; {viewingSub?._isProject ? "Project Submission" : viewingSub.checkpoint.title}
                                    </p>
                                </div>
                                <button onClick={() => setIsViewModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            {viewingSub?._isProject ? (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Project Title</h3>
                                        <p className="text-xl font-bold text-white uppercase tracking-tight">{viewingSub.title}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Project Description</h3>
                                        <p className="text-sm text-zinc-400 leading-relaxed font-medium">{viewingSub.description || "No description provided."}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Source Code</h3>
                                            {viewingSub.repoUrl ? (
                                                <a href={viewingSub.repoUrl} target="_blank" className="flex items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                                    <Github className="w-4 h-4" /> Repository
                                                </a>
                                            ) : (
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-600 font-bold uppercase tracking-widest">Not Provided</div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Demo / PPT</h3>
                                            {viewingSub.demoUrl ? (
                                                <a href={viewingSub.demoUrl} target="_blank" className="flex items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                                                    <ExternalLink className="w-4 h-4" /> View Site / Slides
                                                </a>
                                            ) : (
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-600 font-bold uppercase tracking-widest">Not Provided</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
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
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    {!viewingSub?._isProject && <StatusBadge status={viewingSub.status} />}
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                        {viewingSub?._isProject ? `Version v${viewingSub.version}` : 'Last Updated'}: {new Date(viewingSub.updatedAt || viewingSub.submittedAt).toLocaleString()}
                                    </span>
                                </div>
                                {viewingSub?._isProject ? (
                                    <button onClick={() => setIsViewModalOpen(false)} className="h-10 px-8 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                                        Close Terminal
                                    </button>
                                ) : (
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
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
