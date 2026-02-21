"use client"

import { useState, useEffect } from "react"
import { Github, Globe, Send, Loader2, Info, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export function ProjectSubmissionForm() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [isEventLocked, setIsEventLocked] = useState(false)
    const [resubmissionAllowed, setResubmissionAllowed] = useState(true)
    const [submission, setSubmission] = useState({
        title: "",
        description: "",
        repoUrl: "",
        demoUrl: ""
    })

    useEffect(() => {
        fetchSubmission()
    }, [])

    const fetchSubmission = async () => {
        try {
            const res = await fetch("/api/hackathon/team/submission")
            if (res.ok) {
                const data = await res.json()
                if (data) {
                    setIsEventLocked(!data.isSubmissionEnabled)
                    setResubmissionAllowed(data.resubmissionAllowed ?? true)
                    if (data.id) {
                        setHasSubmitted(true)
                        setSubmission({
                            title: data.title || "",
                            description: data.description || "",
                            repoUrl: data.repoUrl || "",
                            demoUrl: data.demoUrl || ""
                        })
                    }
                }
            }
        } catch (error) {
            console.error("Fetch error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!submission.title) return toast.error("Project Title is required")

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/hackathon/team/submission", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submission)
            })
            if (!res.ok) throw new Error("Failed")
            toast.success("Submission updated successfully")
            fetchSubmission()
        } catch (error) {
            toast.error("Could not update submission")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Initialising Uplink...</p>
        </div>
    )

    const isFormDisabled = isEventLocked || (hasSubmitted && !resubmissionAllowed)

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-4 mb-8">
                {isEventLocked ? (
                    <div className="flex items-start gap-4 p-5 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                        <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-black text-rose-500 uppercase tracking-widest leading-none mb-2">Submission Locked</p>
                            <p className="text-[11px] text-rose-500/80 font-bold leading-relaxed">
                                Submission uplink is currently disabled by organizers. You can view your current record but modifications are prohibited.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex-1">
                            <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest leading-none mb-2">Final Deployment Active</p>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
                                    Submit your project details here. You can update these links at any time before the deadline.
                                </p>
                            </div>
                        </div>
                        {hasSubmitted && (
                            <div className="flex items-center gap-2 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-4 duration-500">
                                <CheckCircle2 className="w-4 h-4" />
                                Submission Status: Active
                            </div>
                        )}
                    </div>
                )}
            </div>

            {hasSubmitted && !resubmissionAllowed && (
                <div className="flex items-center gap-2 px-6 py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6">
                    <CheckCircle2 className="w-4 h-4" />
                    Final Submission Recorded — Resubmission Disabled
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Project Title</label>
                    <input
                        type="text"
                        value={submission.title}
                        readOnly={isFormDisabled}
                        onChange={(e) => setSubmission({ ...submission, title: e.target.value })}
                        placeholder="Project Alpha..."
                        className={`w-full h-12 px-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-xs font-bold focus:outline-none focus:border-indigo-500/50 transition-all ${isFormDisabled ? 'text-slate-500 cursor-not-allowed opacity-60' : 'text-slate-900 dark:text-white'}`}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Source Repository</label>
                    <div className="relative">
                        <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="url"
                            value={submission.repoUrl}
                            readOnly={isFormDisabled}
                            onChange={(e) => setSubmission({ ...submission, repoUrl: e.target.value })}
                            placeholder="https://github.com/..."
                            className={`w-full h-12 pl-11 pr-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-xs font-bold focus:outline-none focus:border-indigo-500/50 transition-all ${isFormDisabled ? 'text-slate-500 cursor-not-allowed opacity-60' : 'text-slate-900 dark:text-white'}`}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Drive Link</label>
                <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="url"
                        value={submission.demoUrl}
                        readOnly={isFormDisabled}
                        onChange={(e) => setSubmission({ ...submission, demoUrl: e.target.value })}
                        placeholder="https://drive.google.com"
                        className={`w-full h-12 pl-11 pr-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-xs font-bold focus:outline-none focus:border-indigo-500/50 transition-all ${isFormDisabled ? 'text-slate-500 cursor-not-allowed opacity-60' : 'text-slate-900 dark:text-white'}`}
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Project Description</label>
                <textarea
                    rows={4}
                    value={submission.description}
                    readOnly={isFormDisabled}
                    onChange={(e) => setSubmission({ ...submission, description: e.target.value })}
                    placeholder="Briefly describe your solution and technologies used..."
                    className={`w-full p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-xs font-bold focus:outline-none focus:border-indigo-500/50 transition-all resize-none ${isFormDisabled ? 'text-slate-500 cursor-not-allowed opacity-60' : 'text-slate-900 dark:text-white'}`}
                />
            </div>

            {!isFormDisabled && (
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            {hasSubmitted ? "Update Submission Uplink" : "Execute Submission Uplink"}
                        </>
                    )}
                </button>
            )}
        </form>
    )
}
