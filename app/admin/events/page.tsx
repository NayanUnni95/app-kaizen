"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/hackathon/DataTable"
import { Plus, MoreHorizontal, Calendar, Users, MapPin, Clock } from "lucide-react"
import { toast } from "sonner"
import { StatusBadge } from "@/components/hackathon/StatusBadge"
import { CreateEventModal } from "@/components/hackathon/CreateEventModal"

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

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

    const filteredEvents = events.filter(event =>
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
                actions={(event) => (
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
                        <MoreHorizontal className="w-5 h-5 text-zinc-600 group-hover:text-white" />
                    </button>
                )}
            />

            <CreateEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchEvents}
            />
        </div>
    )
}
