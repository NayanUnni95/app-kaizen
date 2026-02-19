"use client"

import { useState } from "react"
import { X, Upload, Link as LinkIcon, Loader2 } from "lucide-react"

interface SubmissionModalProps {
    isOpen: boolean
    onClose: () => void
    checkpointTitle: string
    onSubmit: (data: { url: string, remarks: string }) => Promise<void>
}

export function SubmissionModal({ isOpen, onClose, checkpointTitle, onSubmit }: SubmissionModalProps) {
    const [url, setUrl] = useState("")
    const [remarks, setRemarks] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await onSubmit({ url, remarks })
            onClose()
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-2">Milestone Submission</p>
                    <h3 className="text-2xl font-black text-white">{checkpointTitle}</h3>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Live Demo / Repository URL</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://github.com/..."
                                required
                                className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Member Remarks (Optional)</label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Add notes for the reviewers..."
                            className="w-full h-32 bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-all shadow-xl shadow-white/5 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <Upload className="w-5 h-5" />
                                Confirm Submission
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
