"use client"

import { useEffect, useState, useRef } from "react"
import { DataTable } from "@/components/hackathon/DataTable"
import { Plus, MoreHorizontal, User, Edit3, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { RegisterTeamModal } from "@/components/hackathon/RegisterTeamModal"
import { TeamDetailModal } from "@/components/hackathon/TeamDetailModal"

export default function TeamsPage() {
    const [teams, setTeams] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState<any>(null)
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchTeams()
    }, [])

    // Close action menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenuId(null)
            }
        }
        if (openMenuId) {
            document.addEventListener("mousedown", handleClickOutside)
            return () => document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [openMenuId])

    const fetchTeams = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/hackathon/admin/teams")
            if (!res.ok) throw new Error("Failed to fetch teams")
            const data = await res.json()
            setTeams(data)

            // Refresh selectedTeam if it's currently open
            if (selectedTeam) {
                const updatedTeam = data.find((t: any) => t.id === selectedTeam.id)
                if (updatedTeam) {
                    setSelectedTeam(updatedTeam)
                }
            }
        } catch (error) {
            toast.error("Could not load teams")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteTeam = async (teamId: string) => {
        if (!confirm("Are you sure you want to delete this team? This action cannot be undone.")) return
        setDeletingId(teamId)
        setOpenMenuId(null)
        try {
            const res = await fetch(`/api/hackathon/admin/teams?id=${teamId}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Failed")
            toast.success("Team deleted successfully")
            fetchTeams()
        } catch {
            toast.error("Failed to delete team")
        } finally {
            setDeletingId(null)
        }
    }

    const handleRowClick = (team: any) => {
        setSelectedTeam(team)
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
            header: "Event",
            accessor: (team: any) => (
                <span className="text-xs text-zinc-400 font-medium">
                    {team.event?.name || "—"}
                </span>
            )
        },
        {
            header: "Progress",
            accessor: (team: any) => {
                const total = team.event?._count?.checkpoints || 0
                const approved = team.progress?.filter((pr: any) => pr.status === 'APPROVED').length || 0

                return (
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${total > 0 ? (approved / total) * 100 : 0}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-black text-zinc-500 uppercase">
                            {approved}/{total}
                        </span>
                    </div>
                )
            }
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
                onRowClick={handleRowClick}
                actions={(team: any) => {
                    const isMenuOpen = openMenuId === team.id
                    const isDeleting = deletingId === team.id

                    return (
                        <div className="relative" ref={isMenuOpen ? menuRef : undefined}>
                            <button
                                onClick={() => setOpenMenuId(isMenuOpen ? null : team.id)}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                                ) : (
                                    <MoreHorizontal className="w-5 h-5 text-zinc-600 group-hover:text-white" />
                                )}
                            </button>

                            {/* Dropdown menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <button
                                        onClick={() => {
                                            setOpenMenuId(null)
                                            setSelectedTeam(team)
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4 text-blue-400" />
                                        Edit Team
                                    </button>
                                    <div className="h-px bg-white/5" />
                                    <button
                                        onClick={() => handleDeleteTeam(team.id)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Team
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                }}
            />

            {/* Register Team Modal */}
            <RegisterTeamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTeams}
            />

            {/* Team Detail Modal */}
            <TeamDetailModal
                isOpen={!!selectedTeam}
                onClose={() => setSelectedTeam(null)}
                onSuccess={fetchTeams}
                team={selectedTeam}
            />
        </div>
    )
}
