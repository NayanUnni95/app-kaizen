"use client"

import { useEffect, useState } from "react"
import { CheckpointCard } from "@/components/hackathon/CheckpointCard"
import { Loader2, Search } from "lucide-react"
import { toast } from "sonner"

export default function TeamCheckpointsPage() {
    const [checkpoints, setCheckpoints] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCheckpoint, setSelectedCheckpoint] = useState<any>(null)

    useEffect(() => {
        fetchCheckpoints()
    }, [])

    const fetchCheckpoints = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/team/checkpoints")
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setCheckpoints(data)
        } catch (error) {
            toast.error("Could not load milestones")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (checkpointId: string) => {
        // For now, we'll just send a generic submission
        // Real implementation would open a modal for links/files
        try {
            const res = await fetch("/api/hackathon/team/checkpoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    checkpointId,
                    submissionData: { url: "https://github.com/example/project" }
                })
            })
            if (!res.ok) throw new Error("Failed")
            toast.success("Progress submitted!")
            fetchCheckpoints() // Refresh
        } catch (error) {
            toast.error("Failed to submit")
        }
    }

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight">Milestones</h1>
                <p className="text-zinc-500 font-medium">Clear items for your project tracking.</p>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Syncing Track...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {checkpoints.map((cp) => (
                        <CheckpointCard
                            key={cp.id}
                            title={cp.title}
                            description={cp.description}
                            order={cp.order}
                            status={cp.status}
                            dueAt={cp.dueAt}
                            isRequired={cp.isRequired}
                            onAction={() => {
                                if (cp.status === 'PENDING' || cp.status === 'REJECTED') {
                                    handleSubmit(cp.id)
                                } else {
                                    toast.info("Submission already under review")
                                }
                            }}
                        />
                    ))}
                    {checkpoints.length === 0 && (
                        <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-white/5 rounded-3xl">
                            <p className="text-zinc-600 font-black italic uppercase tracking-widest">No milestones defined yet</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
