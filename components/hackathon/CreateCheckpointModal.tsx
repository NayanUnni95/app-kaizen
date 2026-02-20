"use client"

import { useState, useEffect } from "react"
import { X, CheckSquare, Clock, Type, FileText, Calendar, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface CreateCheckpointModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    checkpoint?: any // Added for editing
}

export function CreateCheckpointModal({ isOpen, onClose, onSuccess, checkpoint }: CreateCheckpointModalProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [order, setOrder] = useState(1)
    const [dueAt, setDueAt] = useState("")
    const [eventId, setEventId] = useState("")
    const [isRequired, setIsRequired] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const [events, setEvents] = useState<any[]>([])
    const [isLoadingEvents, setIsLoadingEvents] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen) {
            fetchEvents()
            if (checkpoint) {
                setTitle(checkpoint.title || "")
                setDescription(checkpoint.description || "")
                setOrder(checkpoint.order || 1)
                setDueAt(checkpoint.dueAt ? new Date(checkpoint.dueAt).toISOString().slice(0, 16) : "")
                setEventId(checkpoint.eventId || "")
                setIsRequired(checkpoint.isRequired ?? true)
                setIsVisible(checkpoint.isVisible ?? false)
            } else {
                setTitle("")
                setDescription("")
                setOrder(1)
                setDueAt("")
                setEventId(events[0]?.id || "")
                setIsRequired(true)
                setIsVisible(false)
            }
        }
    }, [isOpen, checkpoint])

    const fetchEvents = async () => {
        setIsLoadingEvents(true)
        try {
            const res = await fetch("/api/hackathon/admin/events")
            if (!res.ok) throw new Error("Failed to fetch events")
            const data = await res.json()
            setEvents(data)
            if (data.length > 0 && !eventId) setEventId(data[0].id)
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
            const isEditing = !!checkpoint?.id
            const res = await fetch("/api/hackathon/admin/checkpoints", {
                method: isEditing ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: checkpoint?.id,
                    title,
                    description,
                    order: Number(order),
                    dueAt: dueAt ? new Date(dueAt).toISOString() : null,
                    eventId,
                    isRequired,
                    isVisible
                })
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || `Failed to ${isEditing ? 'update' : 'create'} checkpoint`)
            }

            toast.success(`Checkpoint ${isEditing ? 'updated' : 'created'} successfully!`)
            onSuccess()
            onClose()
            // Reset form if not editing
            if (!isEditing) {
                setTitle("")
                setDescription("")
                setOrder(order + 1)
                setDueAt("")
                setIsRequired(true)
            }
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-2">Milestone Definition</p>
                    <h3 className="text-2xl font-black text-white">{checkpoint ? "Edit Checkpoint" : "Add Checkpoint"}</h3>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Assigned Event</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <select
                                value={eventId}
                                onChange={(e) => setEventId(e.target.value)}
                                required
                                className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-green-500/50 transition-colors appearance-none"
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

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Checkpoint Title</label>
                        <div className="relative">
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Project Proposal Submission"
                                required
                                className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Instructions / Description</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-4 w-4 h-4 text-zinc-500" />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detail the requirements for this milestone..."
                                className="w-full h-24 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 pt-4 text-sm focus:outline-none focus:border-green-500/50 transition-colors resize-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Display Order</label>
                            <input
                                type="number"
                                value={order}
                                onChange={(e) => setOrder(Number(e.target.value))}
                                min={1}
                                className="w-full h-12 bg-zinc-900 border border-white/5 rounded-xl px-4 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Deadline Date</label>
                            <input
                                type="datetime-local"
                                value={dueAt}
                                onChange={(e) => setDueAt(e.target.value)}
                                className="w-full h-12 bg-zinc-900 border border-white/5 rounded-xl px-4 text-sm focus:outline-none focus:border-green-500/50 transition-colors text-zinc-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 px-1">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isRequired"
                                checked={isRequired}
                                onChange={(e) => setIsRequired(e.target.checked)}
                                className="w-4 h-4 rounded border-white/10 bg-zinc-900 text-green-500 focus:ring-green-500/50"
                            />
                            <label htmlFor="isRequired" className="text-xs font-bold text-zinc-400 cursor-pointer">Mandatory</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isVisible"
                                checked={isVisible}
                                onChange={(e) => setIsVisible(e.target.checked)}
                                className="w-4 h-4 rounded border-white/10 bg-zinc-900 text-blue-500 focus:ring-blue-500/50"
                            />
                            <label htmlFor="isVisible" className="text-xs font-bold text-zinc-400 cursor-pointer">Visible to Teams</label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isLoadingEvents}
                        className="w-full flex items-center justify-center gap-2 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-all shadow-xl shadow-white/5 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (checkpoint ? "Save Changes" : "Publish Milestone")}
                    </button>
                </form>
            </div>
        </div>
    )
}
