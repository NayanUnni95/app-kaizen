"use client"

import { useState, useEffect } from "react"
import { Bell, X, Info, Zap, Layout, ChevronRight, MessageSquare } from "lucide-react"
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
            const data = await res.json()
            setMessages(data)
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
            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden kz-animate-scale-in flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="font-heading font-black text-2xl text-black tracking-tight">Updates & Alerts</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Live Feed</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-black transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {isLoading ? (
                        <div className="py-20 text-center">
                            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Intelligence</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="py-20 text-center">
                            <Bell className="w-12 h-12 text-slate-100 mx-auto mb-4" strokeWidth={1.5} />
                            <p className="text-sm font-semibold text-slate-400">No new updates right now</p>
                        </div>
                    ) : (
                        messages.map((m, i) => (
                            <div
                                key={m.id}
                                className="group p-5 rounded-3xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:border-blue-100 transition-all duration-300"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                        {m.type === 'ERROR' ? <Zap className="w-5 h-5 text-rose-500" /> : <Bell className="w-5 h-5 text-blue-500" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-bold text-slate-900 text-sm">{m.title}</h3>
                                            <span className="text-[10px] font-bold text-slate-400">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{m.body}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <p className="text-[10px] text-center font-black text-slate-400 uppercase tracking-[0.2em]">End of Transmission</p>
                </div>
            </div>
        </div>
    )
}
