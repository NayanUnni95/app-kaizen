"use client"

import { useState, useEffect } from "react"
import { X, FileText, Type, Link2, Loader2, Calendar, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

interface ProblemStatementModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    editData?: any // null for create, object for edit
}

export function ProblemStatementModal({ isOpen, onClose, onSuccess, editData }: ProblemStatementModalProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [assetUrl, setAssetUrl] = useState("")
    const [eventId, setEventId] = useState("")
    const [isVisible, setIsVisible] = useState(false)
    const [events, setEvents] = useState<any[]>([])
    const [isLoadingEvents, setIsLoadingEvents] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isEditMode = !!editData

    useEffect(() => {
        if (isOpen) {
            fetchEvents()
            if (editData) {
                setTitle(editData.title || "")
                setDescription(editData.description || "")
                setAssetUrl(editData.assetUrl || "")
                setEventId(editData.eventId || "")
                setIsVisible(editData.meta?.is_visible ?? false)
            } else {
                setTitle("")
                setDescription("")
                setAssetUrl("")
                setIsVisible(false)
            }
        }
    }, [isOpen, editData])

    const fetchEvents = async () => {
        setIsLoadingEvents(true)
        try {
            const res = await fetch("/api/hackathon/admin/events")
            if (!res.ok) throw new Error("Failed to fetch events")
            const data = await res.json()
            setEvents(data)
            if (data.length > 0 && !editData) setEventId(data[0].id)
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
            if (isEditMode) {
                const res = await fetch("/api/hackathon/admin/problem-statements", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: editData.id,
                        title,
                        description,
                        assetUrl: assetUrl || null,
                        meta: { ...editData.meta, is_visible: isVisible },
                    }),
                })
                if (!res.ok) {
                    const err = await res.json()
                    throw new Error(err.error || "Failed to update statement")
                }
                toast.success("Problem statement updated!")
            } else {
                const res = await fetch("/api/hackathon/admin/problem-statements", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        eventId,
                        title,
                        description,
                        assetUrl: assetUrl || null,
                        is_visible: isVisible,
                    }),
                })
                if (!res.ok) {
                    const err = await res.json()
                    throw new Error(err.error || "Failed to create statement")
                }
                toast.success("Problem statement created!")
            }

            onSuccess()
            onClose()
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">
                        Problem Architecture
                    </p>
                    <h3 className="text-2xl font-black text-white">
                        {isEditMode ? "Edit Statement" : "New Problem Statement"}
                    </h3>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Event Selector (only for create) */}
                    {!isEditMode && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                                Target Event
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <select
                                    value={eventId}
                                    onChange={(e) => setEventId(e.target.value)}
                                    required
                                    disabled={isLoadingEvents}
                                    className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-amber-500/50 transition-colors appearance-none"
                                >
                                    <option value="" disabled>Select event</option>
                                    {events.map((event) => (
                                        <option key={event.id} value={event.id}>
                                            {event.name}
                                        </option>
                                    ))}
                                </select>
                                {isLoadingEvents && (
                                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-spin" />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                            Statement Title
                        </label>
                        <div className="relative">
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Smart Classroom Scheduler"
                                required
                                className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                            Description
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-4 w-4 h-4 text-zinc-500" />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the problem statement in detail..."
                                className="w-full h-36 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 pt-4 text-sm focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Asset URL */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                            Asset / Reference URL (Optional)
                        </label>
                        <div className="relative">
                            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="url"
                                value={assetUrl}
                                onChange={(e) => setAssetUrl(e.target.value)}
                                placeholder="https://drive.google.com/..."
                                className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Visibility Toggle */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                            Visibility
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsVisible(!isVisible)}
                            className={`w-full h-14 rounded-2xl border flex items-center justify-between px-5 transition-all ${isVisible
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                    : "bg-zinc-900 border-white/5 text-zinc-500"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                <span className="text-sm font-bold">
                                    {isVisible ? "Visible to teams" : "Hidden from teams"}
                                </span>
                            </div>
                            <div
                                className={`w-12 h-7 rounded-full transition-all relative ${isVisible ? "bg-emerald-500" : "bg-zinc-700"
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all ${isVisible ? "left-6" : "left-1"
                                        }`}
                                />
                            </div>
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isLoadingEvents}
                        className="w-full flex items-center justify-center gap-2 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-all shadow-xl shadow-white/5 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isEditMode ? (
                            "Update Statement"
                        ) : (
                            "Deploy Statement"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
