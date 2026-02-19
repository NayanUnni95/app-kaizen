"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/hackathon/DataTable"
import { Plus, MoreHorizontal, CheckSquare, Clock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { CreateCheckpointModal } from "@/components/hackathon/CreateCheckpointModal"

export default function CheckpointsPage() {
    const [checkpoints, setCheckpoints] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetchCheckpoints()
    }, [])

    const fetchCheckpoints = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/admin/checkpoints")
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setCheckpoints(data)
        } catch (error) {
            toast.error("Could not load checkpoints")
        } finally {
            setIsLoading(false)
        }
    }

    const filteredCheckpoints = checkpoints.filter((cp: any) =>
        cp.title.toLowerCase().includes(search.toLowerCase()) ||
        cp.event?.name.toLowerCase().includes(search.toLowerCase())
    )

    const columns = [
        {
            header: "Milestone",
            accessor: (cp: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center text-green-400 font-bold text-xs">
                        {cp.order}
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">{cp.title}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{cp.event?.name || 'No Event'}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Deadline",
            accessor: (cp: any) => (
                <div className="flex items-center gap-2 text-zinc-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">{cp.dueAt ? new Date(cp.dueAt).toLocaleDateString() : 'No deadline'}</span>
                </div>
            )
        },
        {
            header: "Requirement",
            accessor: (cp: any) => (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${cp.isRequired ? 'bg-red-500/10 text-red-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    {cp.isRequired ? 'Mandatory' : 'Optional'}
                </span>
            )
        }
    ]

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black tracking-tighter">Event Milestones</h1>
                    <p className="text-zinc-500 font-medium italic">Defining the critical path for participant success.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-8 h-12 bg-white text-black rounded-xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add Checkpoint
                </button>
            </header>

            <DataTable
                columns={columns}
                data={filteredCheckpoints}
                isLoading={isLoading}
                searchPlaceholder="Search milestones..."
                searchValue={search}
                onSearchChange={setSearch}
                actions={(cp) => (
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
                        <MoreHorizontal className="w-5 h-5 text-zinc-600 group-hover:text-white" />
                    </button>
                )}
            />

            <CreateCheckpointModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchCheckpoints}
            />
        </div>
    )
}
