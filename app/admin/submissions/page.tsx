"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/hackathon/DataTable"
import { CheckCircle2, XCircle, Clock, ExternalLink, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { StatusBadge } from "@/components/hackathon/StatusBadge"

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchSubmissions()
    }, [])

    const fetchSubmissions = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/admin/submissions")
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setSubmissions(data)
        } catch (error) {
            toast.error("Could not load submissions")
        } finally {
            setIsLoading(false)
        }
    }

    const handleReview = async (id: string, status: string) => {
        try {
            const res = await fetch("/api/hackathon/admin/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            })
            if (!res.ok) throw new Error("Review failed")
            toast.success(`Submission ${status.toLowerCase()}ed`)
            fetchSubmissions()
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const columns = [
        {
            header: "Team/Event",
            accessor: (sub: any) => (
                <div>
                    <p className="font-bold text-white">{sub.team.name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{sub.event.name}</p>
                </div>
            )
        },
        {
            header: "Milestone",
            accessor: (sub: any) => (
                <div className="flex items-center gap-2">
                    <span className="text-zinc-400 font-medium">{sub.checkpoint.title}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: (sub: any) => (
                <StatusBadge status={sub.status} />
            )
        },
        {
            header: "Deliverable",
            accessor: (sub: any) => (
                <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Link
                </button>
            )
        }
    ]

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter">Submissions Queue</h1>
                <p className="text-zinc-500 font-medium italic">Reviewing and validating participant progress.</p>
            </header>

            <DataTable
                columns={columns}
                data={submissions}
                isLoading={isLoading}
                searchPlaceholder="Search submissions..."
                actions={(sub: any) => (
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => handleReview(sub.id, 'REJECTED')}
                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                            title="Reject/Needs Revision"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handleReview(sub.id, 'APPROVED')}
                            className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                            title="Approve"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                        </button>
                    </div>
                )}
            />
        </div>
    )
}
