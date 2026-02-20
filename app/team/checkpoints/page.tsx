"use client"

import { useEffect, useState, useRef } from "react"
import {
    Lock, Plus, Minus, CheckCircle2, Clock, Upload,
    AlertCircle, ChevronDown, ChevronUp, Send, X, Loader2,
    FileText, ExternalLink, Trash2, Check
} from "lucide-react"
import { toast } from "sonner"
import { EmptyState } from "@/components/ui/EmptyState"

// ─── Types ──────────────────────────────────────────────────────
interface CheckpointItem {
    text: string
    addedAt: string
    author?: string
}

interface CheckpointData {
    id: string
    title: string
    description?: string
    order: number
    dueAt?: string | null
    isRequired: boolean
    status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
    teamProgress?: {
        status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
        submissionData?: { items?: CheckpointItem[], url?: string, remarks?: string }
        reviewerNotes?: string
    }
}

// ─── Status config ───────────────────────────────────────────────
const STATUS_CONFIG = {
    PENDING: { label: "Pending", color: "text-[#64748B]", bg: "bg-[#F8FAFC]", border: "border-[#E6E9EE]" },
    SUBMITTED: { label: "Under Review", color: "text-[#2563EB]", bg: "bg-[#EFF6FF]", border: "border-[#BFDBFE]" },
    APPROVED: { label: "Approved ✓", color: "text-[#16A34A]", bg: "bg-[#D1FAE5]", border: "border-[#A7F3D0]" },
    REJECTED: { label: "Needs Revision", color: "text-[#DC2626]", bg: "bg-[#FEE2E2]", border: "border-[#FECACA]" },
}

// ─── Submit Modal ────────────────────────────────────────────────
function SubmitModal({ checkpoint, onClose, onConfirm }: {
    checkpoint: CheckpointData
    onClose: () => void
    onConfirm: (data: { url: string, remarks: string }) => Promise<void>
}) {
    const [url, setUrl] = useState("")
    const [remarks, setRemarks] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [urlError, setUrlError] = useState("")

    const validateUrl = (val: string) => {
        if (!val) { setUrlError("URL is required"); return false }
        try {
            const u = new URL(val)
            if (!['http:', 'https:'].includes(u.protocol)) { setUrlError("Must be an http/https URL"); return false }
            setUrlError("")
            return true
        } catch { setUrlError("Invalid URL format"); return false }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateUrl(url)) return
        setSubmitting(true)
        try {
            await onConfirm({ url, remarks })
            onClose()
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm kz-animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-modal-title"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E6E9EE] kz-animate-scale-in overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-[#E6E9EE] flex items-start justify-between">
                    <div>
                        <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider mb-1">
                            Submit Checkpoint
                        </p>
                        <h3 id="submit-modal-title" className="font-heading font-bold text-lg text-[#0F172A]">
                            {checkpoint.title}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#F8FAFC] text-[#64748B] transition-colors" aria-label="Close">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                            Repository / Demo URL *
                        </label>
                        <div className="relative">
                            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => { setUrl(e.target.value); if (urlError) validateUrl(e.target.value) }}
                                onBlur={() => validateUrl(url)}
                                placeholder="https://github.com/your-team/project"
                                required
                                className={`
                                    w-full h-11 pl-10 pr-4 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20
                                    ${urlError ? "border-[#DC2626] focus:border-[#DC2626]" : "border-[#E6E9EE] focus:border-[#2563EB]"}
                                `}
                            />
                        </div>
                        {urlError && <p className="text-xs text-[#DC2626] font-medium">{urlError}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                            Notes for Reviewers (optional)
                        </label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Describe your progress, any known issues, etc."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-[#E6E9EE] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors"
                        />
                    </div>

                    {/* Summary */}
                    <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E6E9EE] space-y-1.5">
                        <p className="text-xs font-semibold text-[#64748B]">Submission Summary</p>
                        <p className="text-sm text-[#0F172A]"><span className="font-medium">Checkpoint:</span> {checkpoint.title}</p>
                        {checkpoint.dueAt && (
                            <p className="text-sm text-[#0F172A]">
                                <span className="font-medium">Deadline:</span>{" "}
                                {new Date(checkpoint.dueAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="kz-btn-ghost flex-1 text-sm py-2.5">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="kz-btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-2.5"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            {submitting ? "Submitting..." : "Confirm Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Single Checkpoint Panel ─────────────────────────────────────
function CheckpointPanel({ checkpoint, onRefresh }: {
    checkpoint: CheckpointData
    onRefresh: () => void
}) {
    const progress = checkpoint.teamProgress
    const status = progress?.status ?? 'PENDING'
    const cfg = STATUS_CONFIG[status]
    const isLocked = status === 'APPROVED'
    const items: CheckpointItem[] = progress?.submissionData?.items ?? []

    const [expanded, setExpanded] = useState(true)
    const [showSubmitModal, setShowSubmitModal] = useState(false)
    const [addingItem, setAddingItem] = useState(false)
    const [itemText, setItemText] = useState("")
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState<number | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Autofocus textarea when adding item
    useEffect(() => {
        if (addingItem && textareaRef.current) textareaRef.current.focus()
    }, [addingItem])

    const handleAddItem = async () => {
        if (!itemText.trim()) return
        setSaving(true)
        try {
            const res = await fetch("/api/hackathon/team/checkpoints", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    checkpointId: checkpoint.id,
                    action: "ADD_ITEM",
                    item: { text: itemText.trim(), addedAt: new Date().toISOString() }
                })
            })
            if (!res.ok) throw new Error("Failed")
            setItemText("")
            setAddingItem(false)
            onRefresh()
            toast.success("Item added")
        } catch {
            toast.error("Failed to add item")
        } finally {
            setSaving(false)
        }
    }

    const handleRemoveItem = async (idx: number) => {
        setDeleting(idx)
        try {
            const res = await fetch("/api/hackathon/team/checkpoints", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    checkpointId: checkpoint.id,
                    action: "REMOVE_ITEM",
                    itemIndex: idx
                })
            })
            if (!res.ok) throw new Error("Failed")
            onRefresh()
            toast.success("Item removed")
        } catch {
            toast.error("Failed to remove item")
        } finally {
            setDeleting(null)
        }
    }

    const handleSubmit = async (data: { url: string, remarks: string }) => {
        const res = await fetch("/api/hackathon/team/checkpoints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checkpointId: checkpoint.id, submissionData: data })
        })
        if (!res.ok) throw new Error("Failed to submit")
        toast.success("Checkpoint submitted for review!")
        onRefresh()
    }

    const dueDate = checkpoint.dueAt ? new Date(checkpoint.dueAt) : null
    const isPastDue = dueDate && dueDate < new Date()

    return (
        <>
            <div className={`kz-card overflow-hidden border ${cfg.border} transition-all`}>
                {/* Panel Header */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-between p-5 hover:bg-[#F8FAFC] transition-colors text-left"
                    aria-expanded={expanded}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-sm font-bold text-[#2563EB]">
                            {checkpoint.order}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-heading font-semibold text-[#0F172A] text-sm">
                                    {checkpoint.title}
                                </h3>
                                {isLocked && <Lock className="w-3.5 h-3.5 text-[#16A34A]" />}
                                {checkpoint.isRequired && (
                                    <span className="text-[10px] font-bold text-[#F59E0B] bg-[#FEF3C7] px-2 py-0.5 rounded-full">Required</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                                <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                                {dueDate && (
                                    <span className={`text-[10px] font-medium flex items-center gap-1 ${isPastDue ? "text-[#DC2626]" : "text-[#64748B]"}`}>
                                        <Clock className="w-3 h-3" />
                                        {isPastDue ? "Past due: " : "Due: "}
                                        {dueDate.toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {/* Expanded body */}
                {expanded && (
                    <div className="border-t border-[#E6E9EE]">
                        {/* Description */}
                        {checkpoint.description && (
                            <div className="px-5 py-3 bg-[#F8FAFC] border-b border-[#E6E9EE]">
                                <p className="text-sm text-[#64748B] leading-relaxed">{checkpoint.description}</p>
                            </div>
                        )}

                        {/* Reviewer notes if rejected */}
                        {status === 'REJECTED' && progress?.reviewerNotes && (
                            <div className="px-5 py-3 bg-[#FEE2E2] border-b border-[#FECACA]">
                                <p className="text-xs font-semibold text-[#DC2626] mb-1">Reviewer Feedback:</p>
                                <p className="text-sm text-[#991B1B]">{progress.reviewerNotes}</p>
                            </div>
                        )}

                        {/* Items list */}
                        <div className="p-5 space-y-2">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                                    Progress Items ({items.length})
                                </span>
                                {!isLocked && (
                                    <button
                                        onClick={() => setAddingItem(true)}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Item
                                    </button>
                                )}
                            </div>

                            {items.length === 0 && !addingItem && (
                                <div className="text-center py-6 text-[#94A3B8] text-sm">
                                    No items yet — add your first progress note
                                </div>
                            )}

                            {items.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E6E9EE] group">
                                    <div className="w-5 h-5 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-3 h-3 text-[#2563EB]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-[#0F172A] leading-relaxed">{item.text}</p>
                                        <p className="text-[10px] text-[#94A3B8] mt-1">
                                            {new Date(item.addedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    {!isLocked && (
                                        <button
                                            onClick={() => handleRemoveItem(idx)}
                                            disabled={deleting === idx}
                                            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-[#FEE2E2] text-[#DC2626] transition-all flex-shrink-0"
                                            aria-label="Remove item"
                                        >
                                            {deleting === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Minus className="w-3.5 h-3.5" />}
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Add item form */}
                            {addingItem && !isLocked && (
                                <div className="p-3 bg-[#EFF6FF] rounded-xl border border-[#BFDBFE]">
                                    <textarea
                                        ref={textareaRef}
                                        value={itemText}
                                        onChange={(e) => setItemText(e.target.value)}
                                        placeholder="Describe your progress on this checkpoint..."
                                        rows={3}
                                        className="w-full bg-white rounded-lg border border-[#BFDBFE] p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 mb-2"
                                    />
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleAddItem}
                                            disabled={!itemText.trim() || saving}
                                            className="kz-btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                                        >
                                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                                            Add
                                        </button>
                                        <button
                                            onClick={() => { setAddingItem(false); setItemText("") }}
                                            className="text-xs text-[#64748B] font-medium hover:text-[#0F172A] px-3 py-2"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit footer */}
                        {!isLocked && (
                            <div className="px-5 pb-5 pt-3 border-t border-[#E6E9EE]">
                                <button
                                    onClick={() => setShowSubmitModal(true)}
                                    disabled={status === 'SUBMITTED'}
                                    className={`
                                        w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all
                                        ${status === 'SUBMITTED'
                                            ? "bg-[#F8FAFC] text-[#94A3B8] border border-[#E6E9EE] cursor-not-allowed"
                                            : "kz-btn-primary"
                                        }
                                    `}
                                >
                                    {status === 'SUBMITTED' ? (
                                        <><Upload className="w-4 h-4" /> Awaiting Review</>
                                    ) : (
                                        <><Send className="w-4 h-4" /> Submit Checkpoint</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showSubmitModal && (
                <SubmitModal
                    checkpoint={checkpoint}
                    onClose={() => setShowSubmitModal(false)}
                    onConfirm={handleSubmit}
                />
            )}
        </>
    )
}

// ─── Main Page ───────────────────────────────────────────────────
export default function TeamCheckpointsPage() {
    const [checkpoints, setCheckpoints] = useState<CheckpointData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchCheckpoints = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/team/checkpoints")
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setCheckpoints(data)
        } catch {
            toast.error("Could not load checkpoints")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => { fetchCheckpoints() }, [])

    const approved = checkpoints.filter(c => c.teamProgress?.status === 'APPROVED').length
    const submitted = checkpoints.filter(c => c.teamProgress?.status === 'SUBMITTED').length
    const pending = checkpoints.filter(c => !c.teamProgress || c.teamProgress.status === 'PENDING').length

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <header className="kz-animate-fade-in">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#0F172A]">Checkpoints</h1>
                <p className="text-[#64748B] text-sm mt-1">Track your progress and submit milestone deliverables</p>
            </header>

            {/* Status chips */}
            {!isLoading && checkpoints.length > 0 && (
                <div className="flex flex-wrap gap-2 kz-animate-slide-up">
                    <span className="kz-badge bg-[#D1FAE5] text-[#065F46]">
                        <CheckCircle2 className="w-3 h-3" /> {approved} Approved
                    </span>
                    <span className="kz-badge bg-[#EFF6FF] text-[#1D4ED8]">
                        <Upload className="w-3 h-3" /> {submitted} Under Review
                    </span>
                    <span className="kz-badge bg-[#F8FAFC] text-[#64748B]">
                        <Clock className="w-3 h-3" /> {pending} Pending
                    </span>
                </div>
            )}

            {/* Loading */}
            {isLoading ? (
                <div className="flex flex-col items-center gap-3 py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
                    <p className="text-sm text-[#64748B] font-medium">Loading checkpoints...</p>
                </div>
            ) : checkpoints.length === 0 ? (
                <EmptyState
                    icon={CheckCircle2}
                    title="No checkpoints yet"
                    description="Checkpoints will appear here once the organizers set them up."
                />
            ) : (
                /* 3-column on desktop, stacked on mobile */
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {checkpoints.map((cp, i) => (
                        <div
                            key={cp.id}
                            className="kz-animate-slide-up"
                            style={{ animationDelay: `${i * 0.06}s` }}
                        >
                            <CheckpointPanel checkpoint={cp} onRefresh={fetchCheckpoints} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
