"use client"

import { useState } from "react"
import { X, Calendar, Type, FileText, Users, Loader2, Clock } from "lucide-react"
import { toast } from "sonner"

interface CreateEventModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [startsAt, setStartsAt] = useState("")
    const [endsAt, setEndsAt] = useState("")
    const [maxTeamSize, setMaxTeamSize] = useState(4)
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/hackathon/admin/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description,
                    startsAt: startsAt ? new Date(startsAt).toISOString() : null,
                    endsAt: endsAt ? new Date(endsAt).toISOString() : null,
                    maxTeamSize: Number(maxTeamSize)
                })
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Failed to create event")
            }

            toast.success("Event created successfully!")
            onSuccess()
            onClose()
            // Reset form
            setName("")
            setDescription("")
            setStartsAt("")
            setEndsAt("")
            setMaxTeamSize(4)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Event Architecture</p>
                    <h3 className="text-2xl font-black text-white">New Event</h3>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Event name</label>
                        <div className="relative">
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Kaizen Hack 2026"
                                required
                                className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Description</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-4 w-4 h-4 text-zinc-500" />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the mission and objectives..."
                                className="w-full h-32 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 pt-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Starts At</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="datetime-local"
                                    value={startsAt}
                                    onChange={(e) => setStartsAt(e.target.value)}
                                    className="w-full h-12 bg-zinc-900 border border-white/5 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors text-zinc-400"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Ends At</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="datetime-local"
                                    value={endsAt}
                                    onChange={(e) => setEndsAt(e.target.value)}
                                    className="w-full h-12 bg-zinc-900 border border-white/5 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors text-zinc-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Max Team Size</label>
                        <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="number"
                                value={maxTeamSize}
                                onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                                min={1}
                                max={10}
                                className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-all shadow-xl shadow-white/5 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initiate Event Track"}
                    </button>
                </form>
            </div>
        </div>
    )
}
