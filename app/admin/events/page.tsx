"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/hackathon/DataTable"
import { Plus, MoreHorizontal, Calendar, Users, MapPin, Clock, FileText, ToggleLeft, ToggleRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { StatusBadge } from "@/components/hackathon/StatusBadge"
import { CreateEventModal } from "@/components/hackathon/CreateEventModal"

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selectedStatus, setSelectedStatus] = useState<string>("all")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [togglingRelease, setTogglingRelease] = useState<string | null>(null)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/admin/events")
            if (!res.ok) throw new Error("Failed to fetch events")
            const data = await res.json()
            setEvents(data)
        } catch (error) {
            toast.error("Could not load events")
        } finally {
            setIsLoading(false)
        }
    }

    const handleTogglePBRelease = async (eventId: string, current: boolean) => {
        setTogglingRelease(eventId)
        try {
            const res = await fetch("/api/hackathon/admin/problem-statements/release", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId, is_pb_statement_released: !current }),
            })
            if (!res.ok) throw new Error("Failed")
            toast.success(!current ? "Problem statements released!" : "Problem statements hidden")
            fetchEvents()
        } catch {
            toast.error("Failed to toggle release")
        } finally {
            setTogglingRelease(null)
        }
    }

    const filteredEvents = events
        .filter(event => {
            if (selectedStatus === "all") return true

            const now = new Date()
            const starts = event.startsAt ? new Date(event.startsAt) : null
            const ends = event.endsAt ? new Date(event.endsAt) : null

            let status = "UPCOMING"
            if (starts && ends) {
                if (now < starts) status = "UPCOMING"
                else if (now > ends) status = "COMPLETED"
                else status = "LIVE"
            }
            return status === selectedStatus
        })
        .filter(event =>
            event.name.toLowerCase().includes(search.toLowerCase())
        )

    const columns = [
        {
            header: "Event",
            accessor: (event: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-white">{event.name}</p>
                        <p className="text-xs text-zinc-500 truncate max-w-[200px]">{event.description || "No description"}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Status",
            accessor: (event: any) => {
                const now = new Date()
                const starts = event.startsAt ? new Date(event.startsAt) : null
                const ends = event.endsAt ? new Date(event.endsAt) : null

                let status: any = "UPCOMING"
                if (starts && ends) {
                    if (now < starts) status = "UPCOMING"
                    else if (now > ends) status = "COMPLETED"
                    else status = "LIVE"
                }

                return <StatusBadge status={status} />
            }
        },
        {
            header: "Teams",
            accessor: (event: any) => (
                <div className="flex items-center gap-2 text-zinc-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-bold">{event._count?.teams || 0}</span>
                </div>
            )
        },
        {
            header: "Dates",
            accessor: (event: any) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Clock className="w-3 h-3" />
                        <span>{event.startsAt ? new Date(event.startsAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>
            )
        },
        {
            header: "PS Release",
            accessor: (event: any) => {
                const isReleased = (event.settings as any)?.is_pb_statement_released ?? false
                return (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isReleased ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                        {isReleased ? 'LIVE' : 'DRAFT'}
                    </span>
                )
            }
        }
    ]

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black tracking-tighter">Event Protocol</h1>
                    <p className="text-zinc-500 font-medium italic">Scheduling and orchestration of hackathon activities.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-8 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    New Event
                </button>
            </header>

            <DataTable
                columns={columns}
                data={filteredEvents}
                isLoading={isLoading}
                searchPlaceholder="Search events..."
                searchValue={search}
                onSearchChange={setSearch}
                filterSlot={
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="h-12 bg-zinc-900 border border-white/5 rounded-2xl pl-4 pr-10 text-sm font-bold text-zinc-400 focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                    >
                        <option value="all">All Status</option>
                        <option value="LIVE">Live</option>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                }
                actions={(event: any) => {
                    const isReleased = (event.settings as any)?.is_pb_statement_released ?? false
                    const isToggling = togglingRelease === event.id
                    return (
                        <div className="flex items-center gap-2 justify-end">
                            <button
                                onClick={() => handleTogglePBRelease(event.id, isReleased)}
                                disabled={isToggling}
                                className={`p-2 rounded-lg transition-all ${isReleased
                                    ? 'hover:bg-red-500/10 text-emerald-400 hover:text-red-400'
                                    : 'hover:bg-emerald-500/10 text-zinc-500 hover:text-emerald-400'
                                    }`}
                                title={isReleased ? 'Revoke PS Release' : 'Release PS to Teams'}
                            >
                                {isToggling ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : isReleased ? (
                                    <ToggleRight className="w-5 h-5" />
                                ) : (
                                    <ToggleLeft className="w-5 h-5" />
                                )}
                            </button>
                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
                                <MoreHorizontal className="w-5 h-5 text-zinc-600 group-hover:text-white" />
                            </button>
                        </div>
                    )
                }}
            />

            <CreateEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchEvents}
            />
        </div>
    )
}
