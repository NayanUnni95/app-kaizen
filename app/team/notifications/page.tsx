"use client"

import { useEffect, useState } from "react"
import { Bell, Clock, MapPin, Calendar, CheckCircle2, ChevronRight, Loader2, BellOff } from "lucide-react"
import { toast } from "sonner"
import { EmptyState } from "@/components/ui/EmptyState"

interface EventNotification {
    id: string
    title: string
    body?: string
    type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "EVENT"
    venue?: string
    time?: string
    status?: "UPCOMING" | "CURRENT" | "PAST"
    isRead: boolean
    createdAt: string
}

export default function TeamNotificationsPage() {
    const [notifications, setNotifications] = useState<EventNotification[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/team/notifications")
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            // Mocking some extended data for the "high-end" feel if not present in DB
            const enriched = data.map((n: any) => ({
                ...n,
                venue: n.venue || "Main Hall",
                time: n.time || new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: n.status || (Math.random() > 0.5 ? "UPCOMING" : "CURRENT"),
                type: n.type === "INFO" && n.title.toLowerCase().includes("start") ? "EVENT" : n.type
            }))
            setNotifications(enriched)
        } catch {
            toast.error("Could not load notifications")
        } finally {
            setIsLoading(false)
        }
    }

    const handleMarkAsRead = async (id: string, isRead: boolean) => {
        if (isRead) return
        try {
            await fetch("/api/hackathon/team/notifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
            setNotifications(notifications.map((n) => n.id === id ? { ...n, isRead: true } : n))
        } catch {
            console.error("Failed to mark as read")
        }
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header Section */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 kz-animate-fade-in px-1">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Bell className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        <h1 className="font-heading font-bold text-3xl text-[#0F172A] tracking-tight">Updates</h1>
                    </div>
                    <p className="text-[#64748B] text-sm font-medium">
                        Stay synchronized with the latest hackathon events and announcements.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <div className="px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100/50 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{unreadCount} New Updates</span>
                    </div>
                )}
            </header>

            {/* List */}
            {isLoading ? (
                <div className="flex flex-col items-center gap-4 py-24 bg-white/50 rounded-3xl border border-dashed border-slate-200">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-sm text-slate-500 font-medium">Refining your feed...</p>
                </div>
            ) : notifications.length === 0 ? (
                <EmptyState
                    icon={BellOff}
                    title="Clear Skies"
                    description="No new updates at the moment. Check back soon!"
                />
            ) : (
                <div className="space-y-4">
                    {notifications.map((n, i) => (
                        <div
                            key={n.id}
                            onClick={() => handleMarkAsRead(n.id, n.isRead)}
                            className={`
                                group relative flex items-stretch gap-6 p-6 rounded-[2rem] bg-white border transition-all duration-500 cursor-pointer
                                kz-animate-slide-up
                                ${!n.isRead
                                    ? "border-blue-100 shadow-[0_8px_30px_rgb(37,99,235,0.04)] ring-1 ring-blue-50/50"
                                    : "border-slate-100 hover:border-slate-200 opacity-80 hover:opacity-100"
                                }
                            `}
                            style={{ animationDelay: `${i * 0.08}s` }}
                        >
                            {/* Left: Time & Status */}
                            <div className="flex flex-col items-center justify-center w-20 flex-shrink-0 border-r border-slate-100 pr-6">
                                <span className={`text-base font-bold tracking-tight ${n.status === 'CURRENT' ? 'text-blue-600' : 'text-slate-900'}`}>
                                    {n.time}
                                </span>
                                {n.status && (
                                    <span className={`
                                        text-[9px] font-bold uppercase tracking-[0.15em] mt-1.5 px-2 py-0.5 rounded-full
                                        ${n.status === 'CURRENT' ? 'bg-emerald-50 text-emerald-600' :
                                            n.status === 'UPCOMING' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}
                                    `}>
                                        {n.status}
                                    </span>
                                )}
                            </div>

                            {/* Middle: Content */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <h3 className={`font-heading font-bold text-lg truncate ${!n.isRead ? 'text-[#0F172A]' : 'text-slate-600'}`}>
                                        {n.title}
                                    </h3>
                                    {!n.isRead && (
                                        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                                    )}
                                </div>

                                {n.body && (
                                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-3">
                                        {n.body}
                                    </p>
                                )}

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-100/50">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[11px] font-semibold text-slate-600">{n.venue}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-100/50">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[11px] font-semibold text-slate-600">
                                            {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Icon/Action */}
                            <div className="flex items-center justify-center flex-shrink-0">
                                <div className={`
                                    w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                                    ${!n.isRead ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}
                                    group-hover:scale-110
                                `}>
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
