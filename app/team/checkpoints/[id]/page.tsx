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
            <Loader2 className="w-12 h-12 animate-spin text-black" />
            <p className="text-black font-black uppercase tracking-[0.2em] text-[10px]">Accessing Secure Node</p>
        </div>
    )

    if (!checkpoint) return <EmptyState icon={AlertCircle} title="Not Found" description="This milestone does not exist." />

    const status = checkpoint.teamProgress?.status || 'PENDING'
    const isApproved = status === 'APPROVED'
    const isSubmitted = status === 'SUBMITTED'

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-32 pt-4 px-4 overflow-hidden">
            {/* Nav */}
            <Link
                href="/team/checkpoints"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black transition-colors mb-4"
            >
                <ArrowLeft className="w-3 h-3" /> Back to Map
            </Link>

            {/* Header */}
            <div className="kz-animate-fade-in relative">
                <div className="flex items-center gap-4 mb-6">
                    <div className="px-5 py-2 rounded-full bg-black text-[10px] font-black text-white uppercase tracking-[0.2em]">
                        Checkpoint {checkpoint.order}
                    </div>
                    {isApproved ? (
                        <div className="px-5 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
                            Verified
                        </div>
                    ) : isSubmitted ? (
                        <div className="px-5 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100">
                            Under Review
                        </div>
                    ) : (
                        <div className="px-5 py-2 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100">
                            Active
                        </div>
                    )}
                </div>
                <h1 className="font-heading font-black text-5xl text-black tracking-tighter leading-none mb-6">
                    {checkpoint.title}
                </h1>
                <p className="text-[#64748B] text-xl font-medium leading-relaxed max-w-2xl">
                    {checkpoint.description}
                </p>
            </div>

            {/* PROGRESS INPUT BAR - ONLY IF NOT SUBMITTED */}
            {!isSubmitted && !isApproved && (
                <form
                    onSubmit={handleAddItem}
                    className="flex items-center gap-4 p-4 rounded-[2.5rem] bg-white border-2 border-slate-100 shadow-sm hover:border-black transition-all group kz-animate-slide-up"
                    style={{ animationDelay: '0.1s' }}
                >
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:bg-black group-focus-within:text-white transition-colors">
                        <Plus className="w-6 h-6" />
                    </div>
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Enter your progress..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium text-black placeholder:text-slate-300"
                    />
                    <button
                        type="submit"
                        className="px-8 h-12 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                    >
                        Enter
                    </button>
                </form>
            )}

            {/* Requirements / Guidelines */}
            <section className="space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <ListTodo className="w-4 h-4" /> Protocol Requirements
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    {checkpoint.requirements?.map((req: any, i: number) => (
                        <div
                            key={i}
                            className="px-8 py-6 rounded-[2rem] bg-slate-50 border border-slate-100/50 flex items-start gap-4"
                        >
                            <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[10px] font-black">{i + 1}</div>
                            <p className="text-slate-600 font-medium leading-relaxed text-sm">{req.text || req}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* PROGRESS LIST */}
            <section className="space-y-6 pb-20">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Execution Record</h3>
                    {isSubmitted && (
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Encrypted & Transmitted</span>
                    )}
                </div>

                <div className="space-y-4">
                    {progressItems.length === 0 ? (
                        <div className="py-20 text-center border-4 border-dashed border-slate-50 rounded-[3rem]">
                            <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Awaiting Progress Entry</p>
                        </div>
                    ) : (
                        progressItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="group relative p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 hover:border-black transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-black font-black">
                                        {idx + 1}
                                    </div>
                                    <p className="text-black font-black text-xl tracking-tight leading-tight">{item}</p>
                                </div>
                                {!isSubmitted && !isApproved && (
                                    <button
                                        onClick={() => handleRemoveItem(idx)}
                                        className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all transform hover:rotate-90"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* SUBMIT BUTTON - FLOATING AT BOTTOM */}
            {!isSubmitted && !isApproved && progressItems.length > 0 && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[50] w-full max-w-sm px-4 kz-animate-slide-up">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full h-20 rounded-[2.5rem] bg-black text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-6 h-6" />
                                <span className="text-xs font-black uppercase tracking-[0.3em]">Submit Progress</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}
