"use client"

import { useEffect, useState, use } from "react"
import { ArrowLeft, CheckCircle2, Circle, Clock, FileUp, Send, Loader2, AlertCircle, Plus, X, ListTodo } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { EmptyState } from "@/components/ui/EmptyState"

export default function CheckpointDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [checkpoint, setCheckpoint] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newItem, setNewItem] = useState("")
    const [progressItems, setProgressItems] = useState<string[]>([])

    useEffect(() => {
        fetchCheckpointDetails()
    }, [id])

    const fetchCheckpointDetails = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/hackathon/team/checkpoints/${id}`)
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setCheckpoint(data)
            if (data.teamProgress?.items) {
                setProgressItems(data.teamProgress.items)
            }
        } catch {
            toast.error("Could not load milestone details")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddItem = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!newItem.trim()) return
        setProgressItems([...progressItems, newItem.trim()])
        setNewItem("")
    }

    const handleRemoveItem = (index: number) => {
        setProgressItems(progressItems.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (progressItems.length === 0) return toast.error("Please add at least one progress item")

        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/hackathon/team/checkpoints/${id}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: progressItems })
            })
            if (!res.ok) throw new Error("Submission failed")
            toast.success("Progress submitted successfully!")
            fetchCheckpointDetails()
        } catch {
            toast.error("Could not submit progress")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Accessing Secure Node</p>
        </div>
    )

    if (!checkpoint) return <EmptyState icon={AlertCircle} title="Not Found" description="This milestone does not exist." />

    const status = checkpoint.teamProgress?.status || 'PENDING'
    const isApproved = status === 'APPROVED'
    const isSubmitted = status === 'SUBMITTED'

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-32 pt-4 px-4 overflow-hidden">
            {/* Nav */}
            <Link
                href="/team/checkpoints"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-2"
            >
                <ArrowLeft className="w-3 h-3" /> Back to Milestones
            </Link>

            {/* Header */}
            <div className="kz-animate-fade-in relative space-y-4">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                        stage_0{checkpoint.order}
                    </div>
                    {isApproved ? (
                        <div className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                            Verified
                        </div>
                    ) : isSubmitted ? (
                        <div className="px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
                            Review_Pending
                        </div>
                    ) : (
                        <div className="px-3 py-1 rounded-md bg-slate-500/10 text-slate-600 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest border border-slate-500/20">
                            Operational
                        </div>
                    )}
                </div>
                <h1 className="font-heading font-black text-4xl sm:text-5xl text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
                    {checkpoint.title}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">
                    {checkpoint.description}
                </p>
            </div>

            {/* PROGRESS INPUT BAR - ONLY IF NOT SUBMITTED */}
            {!isSubmitted && !isApproved && (
                <form
                    onSubmit={handleAddItem}
                    className="flex items-center gap-4 p-3 pr-3 rounded-2xl bg-white dark:bg-[#0D0D12] border border-black/5 dark:border-white/5 shadow-sm hover:border-indigo-500/30 transition-all group kz-animate-slide-up"
                    style={{ animationDelay: '0.1s' }}
                >
                    <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-400 group-focus-within:bg-indigo-600 dark:group-focus-within:bg-indigo-500 group-focus-within:text-white transition-all duration-300">
                        <Plus className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Log your progress..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-400/50 dark:placeholder:text-slate-600 uppercase tracking-tight"
                    />
                    <button
                        type="submit"
                        className="px-6 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/5 dark:shadow-none"
                    >
                        Commit
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Requirements / Guidelines */}
                {/* <section className="space-y-6">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ListTodo className="w-4 h-4" /> Protocol
                    </h3>
                    <div className="space-y-3">
                        {checkpoint.requirements?.map((req: any, i: number) => (
                            <div
                                key={i}
                                className="px-6 py-4 rounded-xl bg-black/5 dark:bg-white/[0.05] border border-black/5 dark:border-white/10 flex items-start gap-4"
                            >
                                <div className="w-5 h-5 rounded-md bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-slate-500 dark:text-slate-400">{i + 1}</div>
                                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm">{req.text || req}</p>
                            </div>
                        ))}
                    </div>
                </section> */}

                {/* PROGRESS LIST */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execution Log</h3>
                        {isSubmitted && (
                            <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">Transmitted</span>
                        )}
                    </div>

                    <div className="space-y-3">
                        {progressItems.length === 0 ? (
                            <div className="py-16 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-2xl bg-black/[0.01] dark:bg-white/[0.01]">
                                <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-[10px]">Awaiting Log Entries</p>
                            </div>
                        ) : (
                            progressItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group relative p-5 rounded-2xl bg-white dark:bg-[#0D0D12] border border-black/5 dark:border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white font-black text-[11px] border border-black/5 dark:border-white/5">
                                            {idx + 1}
                                        </div>
                                        <p className="text-slate-900 dark:text-white font-bold text-sm tracking-tight uppercase leading-tight">{item}</p>
                                    </div>
                                    {!isSubmitted && !isApproved && (
                                        <button
                                            onClick={() => handleRemoveItem(idx)}
                                            className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 text-slate-400 dark:text-slate-600 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* SUBMIT BUTTON - FLOATING AT BOTTOM */}
            {!isSubmitted && !isApproved && progressItems.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[50] w-full max-w-xs px-4 kz-animate-slide-up">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full h-16 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black shadow-2xl shadow-black/10 dark:shadow-none flex items-center justify-center gap-3 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:-translate-y-1 transition-all"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span className="text-[11px] font-black uppercase tracking-widest">Transmit Record</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}
