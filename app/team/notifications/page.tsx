"use client"

import { useEffect, useState, useRef } from "react"
import { Bell, Info, AlertTriangle, CheckCircle, XCircle, Clock, BellOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { EmptyState } from "@/components/ui/EmptyState"

const TYPE_CONFIG = {
    INFO: { icon: Info, color: "text-[#2563EB]", bg: "bg-[#EFF6FF]", border: "border-[#BFDBFE]", badgeBg: "bg-[#EFF6FF]", badgeText: "text-[#1D4ED8]" },
    SUCCESS: { icon: CheckCircle, color: "text-[#16A34A]", bg: "bg-[#D1FAE5]", border: "border-[#A7F3D0]", badgeBg: "bg-[#D1FAE5]", badgeText: "text-[#065F46]" },
    WARNING: { icon: AlertTriangle, color: "text-[#F59E0B]", bg: "bg-[#FEF3C7]", border: "border-[#FCD34D]", badgeBg: "bg-[#FEF3C7]", badgeText: "text-[#92400E]" },
    ERROR: { icon: XCircle, color: "text-[#DC2626]", bg: "bg-[#FEE2E2]", border: "border-[#FECACA]", badgeBg: "bg-[#FEE2E2]", badgeText: "text-[#991B1B]" },
}

export default function TeamNotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => { fetchNotifications() }, [])

    const fetchNotifications = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/team/notifications")
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setNotifications(data)
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

    const handleMarkAllRead = async () => {
        const unread = notifications.filter((n) => !n.isRead)
        if (unread.length === 0) return
        await Promise.all(unread.map((n) => handleMarkAsRead(n.id, false)))
        toast.success("All marked as read")
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <header className="flex items-center justify-between kz-animate-fade-in">
                <div>
                    <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#0F172A]">Notifications</h1>
                    <p className="text-[#64748B] text-sm mt-1">Updates from organizers and the system</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors whitespace-nowrap"
                    >
                        Mark all read
                    </button>
                )}
            </header>

            {/* Unread badge */}
            {!isLoading && unreadCount > 0 && (
                <div className="flex items-center gap-2 kz-animate-slide-up">
                    <span className="kz-badge bg-[#EFF6FF] text-[#1D4ED8]">
                        <Bell className="w-3 h-3" />
                        {unreadCount} unread
                    </span>
                </div>
            )}

            {/* Loading */}
            {isLoading ? (
                <div className="flex flex-col items-center gap-3 py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
                    <p className="text-sm text-[#64748B] font-medium">Loading notifications...</p>
                </div>
            ) : notifications.length === 0 ? (
                <div className="kz-animate-slide-up">
                    <EmptyState
                        icon={BellOff}
                        title="No notifications yet"
                        description="When organizers post announcements or system updates, they'll appear here."
                    />
                </div>
            ) : (
                <div className="space-y-2 kz-animate-slide-up">
                    {notifications.map((n: any, i: number) => {
                        const cfg = TYPE_CONFIG[n.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.INFO
                        const Icon = cfg.icon
                        const isUnread = !n.isRead

                        return (
                            <button
                                key={n.id}
                                onClick={() => handleMarkAsRead(n.id, n.isRead)}
                                className={`
                                    w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-200
                                    kz-animate-slide-up
                                    ${isUnread
                                        ? `${cfg.bg} ${cfg.border} hover:shadow-sm`
                                        : "bg-white border-[#E6E9EE] opacity-70 hover:opacity-100"
                                    }
                                `}
                                style={{ animationDelay: `${i * 0.04}s` }}
                                aria-label={`${n.title} — ${isUnread ? "click to mark as read" : "read"}`}
                            >
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className={`kz-badge ${cfg.badgeBg} ${cfg.badgeText} text-[10px]`}>
                                            {n.type}
                                        </span>
                                        {isUnread && (
                                            <span className="w-2 h-2 rounded-full bg-[#2563EB]" aria-label="Unread" />
                                        )}
                                    </div>
                                    <p className={`text-sm font-semibold ${isUnread ? "text-[#0F172A]" : "text-[#64748B]"}`}>
                                        {n.title}
                                    </p>
                                    {n.body && (
                                        <p className="text-sm text-[#64748B] mt-0.5 leading-relaxed">{n.body}</p>
                                    )}
                                    <div className="flex items-center gap-1 mt-2 text-[#94A3B8]">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-[10px] font-medium">
                                            {new Date(n.createdAt).toLocaleString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
