"use client"

import { useState, useEffect } from "react"
import { Bell, Info, Zap, ChevronRight, MessageSquare, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function TeamNotificationsPage() {
    const [messages, setMessages] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/team/notifications")
            if (!res.ok) throw new Error("Failed")
            const { announcements, notifications } = await res.json()

            // Combine and sort by date
            const combined = [...announcements, ...notifications].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            setMessages(combined)
        } catch {
            toast.error("Could not load notifications")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter">
                            Notifications
                        </h1>
                        <p className="text-zinc-500 font-medium italic">
                            Live system updates and team alerts.
                        </p>
                    </div>
                </div>
            </header>

            {/* List */}
            <div className="max-w-3xl">
                {isLoading ? (
                    <div className="py-20 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-500" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Syncing Intelligence...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="py-20 text-center bg-zinc-900/30 border border-white/5 rounded-3xl">
                        <Bell className="w-12 h-12 text-zinc-800 mx-auto mb-4" strokeWidth={1.5} />
                        <p className="text-sm font-semibold text-zinc-500">No new updates right now</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((m, i) => (
                            <div
                                key={m.id}
                                className="group p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 hover:border-indigo-500/30 transition-all duration-300"
                            >
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition-all duration-500">
                                        {m.category === 'ANNOUNCEMENT' ? (
                                            <MessageSquare className="w-6 h-6 text-amber-500 group-hover:text-white" />
                                        ) : m.type === 'ERROR' ? (
                                            <Zap className="w-6 h-6 text-rose-500 group-hover:text-white" />
                                        ) : (
                                            <Bell className="w-6 h-6 text-indigo-500 group-hover:text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-white text-lg">{m.title}</h3>
                                                {m.category === 'ANNOUNCEMENT' && (
                                                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-wider border border-amber-500/20">
                                                        Announcement
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs font-bold text-zinc-500">
                                                {new Date(m.createdAt).toLocaleDateString()} {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-400 leading-relaxed font-medium">{m.body}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
