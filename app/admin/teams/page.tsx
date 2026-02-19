"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/hackathon/DataTable"
import { Plus, MoreHorizontal, User, Mail, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { RegisterTeamModal } from "@/components/hackathon/RegisterTeamModal"

export default function TeamsPage() {
    const [teams, setTeams] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetchTeams()
    }, [])

    const fetchTeams = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/admin/teams")
            if (!res.ok) throw new Error("Failed to fetch teams")
            const data = await res.json()
            setTeams(data)
        } catch (error) {
            toast.error("Could not load teams")
        } finally {
            setIsLoading(false)
        }
    }

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(search.toLowerCase()) ||
        team.username.toLowerCase().includes(search.toLowerCase())
    )

    const columns = [
        {
            header: "Team Name",
            accessor: (team: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 font-bold italic">
                        {team.name[0]}
                    </div>
                    <div>
                        <p className="font-bold text-white">{team.name}</p>
                        <p className="text-xs text-zinc-500">ID: {team.id.substring(0, 8)}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Username",
            accessor: (team: any) => (
                <div className="flex items-center gap-2 text-zinc-400">
                    <User className="w-3 h-3" />
                    <span className="text-xs font-medium">{team.username}</span>
                </div>
            )
        },
        {
            header: "Members",
            accessor: (team: any) => (
                <div className="flex -space-x-2">
                    {[...Array(team._count?.members || 0)].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center">
                            <User className="w-3 h-3 text-zinc-500" />
                        </div>
                    ))}
                    {(team._count?.members || 0) === 0 && <span className="text-xs text-zinc-600 font-bold italic">Unassigned</span>}
                </div>
            )
        },
        {
            header: "Created",
            accessor: (team: any) => new Date(team.createdAt).toLocaleDateString()
        }
    ]

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black tracking-tighter">Team Management</h1>
                    <p className="text-zinc-500 font-medium italic">Directory of registered squads and their members.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-8 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    Register Team
                </button>
            </header>

            <DataTable
                columns={columns}
                data={filteredTeams}
                isLoading={isLoading}
                searchPlaceholder="Search by name or username..."
                searchValue={search}
                onSearchChange={setSearch}
                actions={(team) => (
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
                        <MoreHorizontal className="w-5 h-5 text-zinc-600 group-hover:text-white" />
                    </button>
                )}
            />

            <RegisterTeamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTeams}
            />
        </div>
    )
}
