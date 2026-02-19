"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/hackathon/DataTable"
import { Bell, Plus, MoreHorizontal, Send, Info, Tag } from "lucide-react"
import { toast } from "sonner"

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)

    // Form state
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [type, setType] = useState("INFO")
    const [targetEvent, setTargetEvent] = useState("") // Should be eventId
    const [events, setEvents] = useState<any[]>([])

    useEffect(() => {
        fetchNotifications()
        fetchEvents()
    }, [])

    const fetchNotifications = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/admin/notifications")
            const data = await res.json()
            setNotifications(data)
        } catch (error) {
            toast.error("Could not load notifications")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchEvents = async () => {
        const res = await fetch("/api/hackathon/admin/events")
        const data = await res.json()
        setEvents(data)
        if (data.length > 0) setTargetEvent(data[0].id)
    }

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!targetEvent) return toast.error("Select an event")

        try {
            const res = await fetch("/api/hackathon/admin/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    body,
                    type,
                    eventId: targetEvent
                })
            })
            if (!res.ok) throw new Error("Broadcast failed")
            toast.success("Notification broadcasted successfully!")
            setTitle("")
            setBody("")
            setIsCreating(false)
            fetchNotifications()
        } catch (error) {
            toast.error("Failed to send notification")
        }
    }

    const columns = [
        {
            header: "Notification",
            accessor: (n: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400">
                        <Tag className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">{n.title}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black line-clamp-1">{n.body || "No body"}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Type",
            accessor: (n: any) => (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${n.type === 'ERROR' ? 'text-red-400 bg-red-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                    {n.type}
                </span>
            )
        },
        {
            header: "Sent At",
            accessor: (n: any) => new Date(n.createdAt).toLocaleString()
        }
    ]

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black tracking-tighter">Broadcast Center</h1>
                    <p className="text-zinc-500 font-medium italic">Communicate critical updates to participants.</p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center justify-center gap-2 px-8 h-12 bg-white text-black rounded-xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Create Broadcast
                    </button>
                )}
            </header>

            {isCreating && (
                <section className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 animate-in scroll-in-from-top-4 duration-500">
                    <form onSubmit={handleBroadcast} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Event Target</label>
                                <select
                                    value={targetEvent}
                                    onChange={(e) => setTargetEvent(e.target.value)}
                                    className="w-full h-12 bg-zinc-950 border border-white/5 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                >
                                    {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Alert Level</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full h-12 bg-zinc-950 border border-white/5 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                >
                                    <option value="INFO">Information</option>
                                    <option value="SUCCESS">Success</option>
                                    <option value="WARNING">Warning</option>
                                    <option value="ERROR">Critical/Error</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Message Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="E.g. Technical Workshop Starting"
                                required
                                className="w-full h-12 bg-zinc-950 border border-white/5 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Detailed Body</label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Optional description..."
                                className="w-full h-32 bg-zinc-950 border border-white/5 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-4 justify-end pt-4">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-6 h-12 text-zinc-500 font-bold hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-8 h-12 bg-blue-600 text-white rounded-xl font-black uppercase tracking-tighter hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20"
                            >
                                <Send className="w-4 h-4" />
                                Post Announcement
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <DataTable
                columns={columns}
                data={notifications}
                isLoading={isLoading}
                searchPlaceholder="Search history..."
                actions={(n) => (
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
                        <MoreHorizontal className="w-5 h-5 text-zinc-600 group-hover:text-white" />
                    </button>
                )}
            />
        </div>
    )
}
