"use client"

import { useEffect, useState } from "react"
import { NotificationCard } from "@/components/hackathon/NotificationCard"
import { Loader2, BellOff } from "lucide-react"
import { toast } from "sonner"

export default function TeamNotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([])
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
            setNotifications(data)
        } catch (error) {
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
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
        } catch (error) {
            console.error("Failed to mark as read")
        }
    }

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight">Broadcasts</h1>
                <p className="text-zinc-500 font-medium italic">Latest updates from the organizers.</p>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Fetching Alerts...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {notifications.map((n: any) => (
                        <NotificationCard
                            key={n.id}
                            title={n.title}
                            body={n.body}
                            type={n.type}
                            createdAt={n.createdAt}
                            isRead={n.isRead}
                            onMarkAsRead={() => handleMarkAsRead(n.id, n.isRead)}
                        />
                    ))}
                    {notifications.length === 0 && (
                        <div className="text-center py-24 bg-zinc-900/30 border border-dashed border-white/5 rounded-3xl">
                            <BellOff className="w-8 h-8 text-zinc-800 mx-auto mb-4" />
                            <p className="text-zinc-600 font-black italic uppercase tracking-widest text-sm">No new notifications</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
