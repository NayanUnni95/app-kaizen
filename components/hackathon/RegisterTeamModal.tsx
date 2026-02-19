"use client"

import { useState, useEffect } from "react"
import { X, User, Lock, Mail, Users, Loader2, Calendar } from "lucide-react"
import { toast } from "sonner"

interface RegisterTeamModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function RegisterTeamModal({ isOpen, onClose, onSuccess }: RegisterTeamModalProps) {
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [eventId, setEventId] = useState("")
    const [events, setEvents] = useState<any[]>([])
    const [isLoadingEvents, setIsLoadingEvents] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen) {
            fetchEvents()
        }
    }, [isOpen])

    const fetchEvents = async () => {
        setIsLoadingEvents(true)
        try {
            const res = await fetch("/api/hackathon/admin/events")
            if (!res.ok) throw new Error("Failed to fetch events")
            const data = await res.json()
            setEvents(data)
            if (data.length > 0) setEventId(data[0].id)
        } catch (error) {
            toast.error("Could not load events")
        } finally {
            setIsLoadingEvents(false)
        }
    }

    if (!isOpen) return null

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!eventId) {
            toast.error("Please select an event")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/hackathon/admin/teams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, username, password, email, eventId })
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Failed to register team")
            }

            toast.success("Team registered successfully!")
            onSuccess()
            onClose()
            // Reset form
            setName("")
            setUsername("")
            setPassword("")
            setEmail("")
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Onboarding Protocol</p>
                    <h3 className="text-2xl font-black text-white">Register Team</h3>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Team Details</label>
                        <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Squad/Team Name"
                                required
                                className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Login Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                                    placeholder="team_handle"
                                    required
                                    className="w-full h-12 bg-zinc-900 border border-white/5 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Access Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-12 bg-zinc-900 border border-white/5 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">POC Email (Optional)</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="lead@team.com"
                                className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Assigned Event</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <select
                                value={eventId}
                                onChange={(e) => setEventId(e.target.value)}
                                required
                                className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                                disabled={isLoadingEvents}
                            >
                                <option value="" disabled>Select an active event</option>
                                {events.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.name}
                                    </option>
                                ))}
                            </select>
                            {isLoadingEvents && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-spin" />}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isLoadingEvents}
                        className="w-full flex items-center justify-center gap-2 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-all shadow-xl shadow-white/5 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Team Account"}
                    </button>
                </form>
            </div>
        </div>
    )
}
