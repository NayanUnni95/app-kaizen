"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Type, FileText, Users, Loader2, Clock, Eye, EyeOff, Hash, Send } from "lucide-react"
import { toast } from "sonner"

interface CreateEventModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    event?: any // Added for editing
}

export function CreateEventModal({ isOpen, onClose, onSuccess, event }: CreateEventModalProps) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [startsAt, setStartsAt] = useState("")
    const [endsAt, setEndsAt] = useState("")
    const [maxTeamSize, setMaxTeamSize] = useState(4)
    const [minTeamSize, setMinTeamSize] = useState(1)
    const [isPublic, setIsPublic] = useState(true)
    const [isSubmissionEnabled, setIsSubmissionEnabled] = useState(false)
    const [isResubmissionAllowed, setIsResubmissionAllowed] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen) {
            if (event) {
                setName(event.name || "")
                setDescription(event.description || "")
                setStartsAt(event.startsAt ? new Date(event.startsAt).toISOString().slice(0, 16) : "")
                setEndsAt(event.endsAt ? new Date(event.endsAt).toISOString().slice(0, 16) : "")
                setMaxTeamSize(event.maxTeamSize ?? 4)
                setMinTeamSize(event.minTeamSize ?? 1)
                setIsPublic(event.isPublic ?? true)
                setIsSubmissionEnabled((event.settings as any)?.is_submission_enabled ?? false)
                setIsResubmissionAllowed((event.settings as any)?.resubmission_allowed ?? true)
            } else {
                setName("")
                setDescription("")
                setStartsAt("")
                setEndsAt("")
                setMaxTeamSize(4)
                setMinTeamSize(1)
                setIsPublic(true)
                setIsSubmissionEnabled(false)
                setIsResubmissionAllowed(true)
            }
        }
    }, [isOpen, event])

    if (!isOpen) return null

    const isEditing = !!event?.id

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const payload: any = {
                name,
                description,
                startsAt: startsAt ? new Date(startsAt).toISOString() : null,
                endsAt: endsAt ? new Date(endsAt).toISOString() : null,
                maxTeamSize: Number(maxTeamSize),
                minTeamSize: Number(minTeamSize),
                isPublic,
                settings: {
                    ...(event?.settings as any || {}),
                    is_submission_enabled: isSubmissionEnabled,
                    resubmission_allowed: isResubmissionAllowed
                }
            }

            if (isEditing) {
                payload.id = event.id
            }

            const res = await fetch("/api/hackathon/admin/events", {
                method: isEditing ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || `Failed to ${isEditing ? 'update' : 'create'} event`)
            }

            toast.success(isEditing ? "Event updated successfully!" : "Event created successfully!")
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Event Architecture</p>
                    <h3 className="text-2xl font-black text-white">{isEditing ? "Edit Event" : "New Event"}</h3>
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Min Team Size</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="number"
                                    value={minTeamSize}
                                    onChange={(e) => setMinTeamSize(Number(e.target.value))}
                                    min={1}
                                    max={maxTeamSize}
                                    className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
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
                                    min={minTeamSize}
                                    max={10}
                                    className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-1">
                        <button
                            type="button"
                            onClick={() => setIsPublic(!isPublic)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${isPublic
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-zinc-900 border-white/5 text-zinc-500'
                                }`}
                        >
                            {isPublic ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            {isPublic ? "Public Event" : "Private Event"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsSubmissionEnabled(!isSubmissionEnabled)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${isSubmissionEnabled
                                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                : 'bg-zinc-900 border-white/5 text-zinc-500'
                                }`}
                        >
                            <Send className="w-3.5 h-3.5" />
                            {isSubmissionEnabled ? "Submissions Open" : "Submissions Closed"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsResubmissionAllowed(!isResubmissionAllowed)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${isResubmissionAllowed
                                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                                : 'bg-zinc-900 border-white/5 text-zinc-500'
                                }`}
                        >
                            <Calendar className="w-3.5 h-3.5" />
                            {isResubmissionAllowed ? "Resubmission ON" : "Resubmission OFF"}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-all shadow-xl shadow-white/5 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditing ? "Save Changes" : "Initiate Event Track")}
                    </button>
                </form>
            </div>
        </div>
    )
}
