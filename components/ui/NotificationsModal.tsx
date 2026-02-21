"use client"

import { useState, useEffect } from "react"
import { Bell, X, Info, Zap, Layout, ChevronRight, MessageSquare, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface NotificationsModalProps {
    isOpen: boolean
    onClose: () => void
    teamId?: string
    eventId?: string
}

export function NotificationsModal({ isOpen, onClose, teamId, eventId }: NotificationsModalProps) {
    const [messages, setMessages] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            fetchNotifications()
        }
    }, [isOpen])

    const fetchNotifications = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/team/notifications")
            if (!res.ok) throw new Error("Failed")
            const { announcements, notifications } = await res.json()

            // Show only actual notifications in this modal
            const filtered = notifications.sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            setMessages(filtered)
        } catch {
            toast.error("Could not load notifications")
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm kz-animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-[#08080A] rounded-[2.5rem] shadow-2xl overflow-hidden kz-animate-scale-in flex flex-col max-h-[80vh] border border-black/5 dark:border-white/5">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="font-heading font-black text-2xl text-slate-900 dark:text-white tracking-tight uppercase">Updates & Alerts</h2>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Live Feed</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {isLoading ? (
                        <div className="py-20 text-center">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Intelligence</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="py-20 text-center">
                            <Bell className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" strokeWidth={1.5} />
                            <p className="text-sm font-semibold text-slate-400">No new updates right now</p>
                        </div>
                    ) : (
                        messages.map((m, i) => (
                            <div
                                key={m.id}
                                className="group p-6 rounded-[2rem] bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:bg-white dark:hover:bg-white/[0.04] hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-all duration-300 shadow-sm"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                <div className="flex gap-5">
                                    <div className="w-11 h-11 rounded-xl bg-white dark:bg-white/5 shadow-inner border border-black/5 dark:border-white/10 flex items-center justify-center flex-shrink-0 text-slate-400 dark:text-slate-500">
                                        {m.type === 'ERROR' ? (
                                            <Zap className="w-5 h-5 text-rose-500" />
                                        ) : m.type === 'WARNING' ? (
                                            <AlertCircle className="w-5 h-5 text-amber-500" />
                                        ) : (
                                            <Bell className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-heading font-black text-slate-900 dark:text-white text-base tracking-tight uppercase leading-none">{m.title}</h3>
                                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold opacity-70 group-hover:opacity-100 transition-opacity">{m.body}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5">
                    <p className="text-[10px] text-center font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">End of Transmission</p>
                </div>
            </div>
        </div>
    )
}
