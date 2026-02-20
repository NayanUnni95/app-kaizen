"use client"

import { useState, useEffect } from "react"
import {
    X,
    User,
    Mail,
    Calendar,
    Edit3,
    Trash2,
    UserPlus,
    Shield,
    Loader2,
    Save,
    Lock,
    Hash,
    Clock,
    Users,
    ChevronRight,
    CheckSquare,
    ClipboardCheck,
    MessageSquare,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    Github
} from "lucide-react"
import { toast } from "sonner"

interface TeamDetailModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    team: any
}

export function TeamDetailModal({ isOpen, onClose, onSuccess, team }: TeamDetailModalProps) {
    // Team edit state
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    // Members state
    const [members, setMembers] = useState<any[]>([])
    const [isLoadingMembers, setIsLoadingMembers] = useState(false)

    // Add member state
    const [showAddMember, setShowAddMember] = useState(false)
    const [newMemberName, setNewMemberName] = useState("")
    const [newMemberRole, setNewMemberRole] = useState("MEMBER")
    const [isAddingMember, setIsAddingMember] = useState(false)

    // Delete member state
    const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null)

    // Edit member state
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
    const [editMemberName, setEditMemberName] = useState("")
    const [editMemberRole, setEditMemberRole] = useState("MEMBER")
    const [editMemberIsAccepted, setEditMemberIsAccepted] = useState(false)
    const [editMemberPhone, setEditMemberPhone] = useState("")
    const [editMemberEmail, setEditMemberEmail] = useState("")
    const [editMemberLinkedin, setEditMemberLinkedin] = useState("")
    const [editMemberGithub, setEditMemberGithub] = useState("")
    const [isUpdatingMember, setIsUpdatingMember] = useState(false)

    // Checkpoints state
    const [checkpoints, setCheckpoints] = useState<any[]>([])
    const [isLoadingCheckpoints, setIsLoadingCheckpoints] = useState(false)
    const [updatingCheckpointId, setUpdatingCheckpointId] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && team) {
            setName(team.name || "")
            setUsername(team.username || "")
            setEmail(team.email || "")
            setPassword("")
            setIsEditing(false)
            setShowAddMember(false)
            setNewMemberName("")
            setNewMemberRole("MEMBER")
            fetchMembers()
            fetchCheckpoints()
        }
    }, [isOpen, team])

    const fetchMembers = async () => {
        if (!team?.id) return
        setIsLoadingMembers(true)
        try {
            const res = await fetch(`/api/hackathon/admin/teams/members?teamId=${team.id}`)
            if (!res.ok) throw new Error("Failed")
            const data = await res.json()
            setMembers(data)
        } catch {
            // Use team.members fallback if API fails
            setMembers(team.members || [])
        } finally {
            setIsLoadingMembers(false)
        }
    }

    const handleSaveTeam = async () => {
        setIsSaving(true)
        try {
            const payload: any = { id: team.id, name, username, email }
            if (password.trim()) payload.password = password

            const res = await fetch("/api/hackathon/admin/teams", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Failed")
            }
            toast.success("Team updated successfully!")
            setIsEditing(false)
            setPassword("")
            onSuccess()
        } catch (error: any) {
            toast.error(error.message || "Failed to update team")
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddMember = async () => {
        if (!newMemberName.trim()) {
            toast.error("Enter a member name")
            return
        }
        setIsAddingMember(true)
        try {
            const res = await fetch("/api/hackathon/admin/teams/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teamId: team.id,
                    name: newMemberName.trim(),
                    role: newMemberRole,
                }),
            })
            if (!res.ok) throw new Error("Failed")
            toast.success("Member added!")
            setNewMemberName("")
            setNewMemberRole("MEMBER")
            setShowAddMember(false)
            fetchMembers()
            onSuccess()
        } catch {
            toast.error("Failed to add member")
        } finally {
            setIsAddingMember(false)
        }
    }

    const handleDeleteMember = async (memberId: string) => {
        if (!confirm("Remove this member from the team?")) return
        setDeletingMemberId(memberId)
        try {
            const res = await fetch(`/api/hackathon/admin/teams/members?id=${memberId}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Failed")
            toast.success("Member removed")
            fetchMembers()
            onSuccess()
        } catch {
            toast.error("Failed to remove member")
        } finally {
            setDeletingMemberId(null)
        }
    }

    const handleUpdateMember = async (memberId: string) => {
        setIsUpdatingMember(true)
        try {
            const res = await fetch("/api/hackathon/admin/teams/members", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: memberId,
                    name: editMemberName,
                    role: editMemberRole,
                    isAccepted: editMemberIsAccepted,
                    meta: {
                        phone: editMemberPhone,
                        email: editMemberEmail,
                        linkedin: editMemberLinkedin,
                        github: editMemberGithub,
                    }
                }),
            })
            if (!res.ok) throw new Error("Failed")
            toast.success("Member updated")
            setEditingMemberId(null)
            fetchMembers()
            onSuccess()
        } catch {
            toast.error("Failed to update member")
        } finally {
            setIsUpdatingMember(false)
        }
    }

    const toggleCheckIn = async (member: any) => {
        try {
            const res = await fetch("/api/hackathon/admin/teams/members", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: member.id,
                    isAccepted: !member.isAccepted,
                }),
            })
            if (!res.ok) throw new Error("Failed")
            toast.success(member.isAccepted ? "Marked as not checked-in" : "Marked as checked-in")
            fetchMembers()
            onSuccess()
        } catch {
            toast.error("Failed to update status")
        }
    }

    const fetchCheckpoints = async () => {
        if (!team?.id) return
        setIsLoadingCheckpoints(true)
        try {
            const res = await fetch(`/api/hackathon/admin/teams/checkpoints?teamId=${team.id}`)
            if (!res.ok) throw new Error("Failed")
            const data = await res.json()
            setCheckpoints(data)
        } catch {
            toast.error("Failed to load checkpoints")
        } finally {
            setIsLoadingCheckpoints(false)
        }
    }

    const handleUpdateCheckpoint = async (checkpointId: string, status: string, notes?: string) => {
        setUpdatingCheckpointId(checkpointId)
        try {
            const res = await fetch("/api/hackathon/admin/teams/checkpoints", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teamId: team.id,
                    checkpointId,
                    status,
                    reviewerNotes: notes
                }),
            })
            if (!res.ok) throw new Error("Failed")
            toast.success(`Milestone ${status.toLowerCase()}!`)
            fetchCheckpoints()
            onSuccess()
        } catch {
            toast.error("Failed to update milestone")
        } finally {
            setUpdatingCheckpointId(null)
        }
    }

    if (!isOpen || !team) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 font-black text-xl italic">
                                {team.name?.[0] || "T"}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1">
                                    Team Details
                                </p>
                                <h3 className="text-2xl font-black text-white">
                                    {team.name}
                                </h3>
                            </div>
                        </div>

                        {/* Quick info pills */}
                        <div className="flex flex-wrap gap-2">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 text-xs text-zinc-400">
                                <Hash className="w-3 h-3" />
                                {team.id?.substring(0, 8)}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 text-xs text-zinc-400">
                                <Calendar className="w-3 h-3" />
                                {team.event?.name || "No event"}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 text-xs text-zinc-400">
                                <Clock className="w-3 h-3" />
                                {new Date(team.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* ─── Team Info Section ───── */}
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Team Information
                            </h4>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all"
                                >
                                    <Edit3 className="w-3 h-3" />
                                    Edit
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false)
                                            setName(team.name)
                                            setUsername(team.username)
                                            setEmail(team.email || "")
                                            setPassword("")
                                        }}
                                        className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveTeam}
                                        disabled={isSaving}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Save className="w-3 h-3" />
                                        )}
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 space-y-4">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">
                                    Team Name
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full h-11 bg-zinc-800 border border-white/5 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm font-bold text-white px-1">{team.name}</p>
                                )}
                            </div>

                            {/* Username */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">
                                    Username
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full h-11 bg-zinc-800 border border-white/5 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm text-zinc-400 px-1">{team.username}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">
                                    Email
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Optional"
                                            className="w-full h-11 bg-zinc-800 border border-white/5 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm text-zinc-400 px-1">
                                        {team.email || <span className="italic text-zinc-600">Not set</span>}
                                    </p>
                                )}
                            </div>

                            {/* Password (only in edit) */}
                            {isEditing && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">
                                        New Password (leave blank to keep current)
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-11 bg-zinc-800 border border-white/5 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ─── Members Section ───── */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Team Members
                                <span className="ml-1 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[9px]">
                                    {members.length}
                                </span>
                            </h4>
                            <button
                                onClick={() => setShowAddMember(!showAddMember)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest hover:bg-purple-500/20 transition-all"
                            >
                                <UserPlus className="w-3 h-3" />
                                {showAddMember ? "Cancel" : "Add Member"}
                            </button>
                        </div>

                        {/* Add member form */}
                        {showAddMember && (
                            <div className="bg-zinc-900/50 border border-purple-500/10 rounded-2xl p-4 mb-4 animate-in slide-in-from-top-2 duration-200">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="text"
                                            value={newMemberName}
                                            onChange={(e) => setNewMemberName(e.target.value)}
                                            placeholder="Member name"
                                            className="w-full h-11 bg-zinc-800 border border-white/5 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                            onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                                        />
                                    </div>
                                    <select
                                        value={newMemberRole}
                                        onChange={(e) => setNewMemberRole(e.target.value)}
                                        className="h-11 bg-zinc-800 border border-white/5 rounded-xl px-3 text-sm text-zinc-400 focus:outline-none focus:border-purple-500/50 transition-colors appearance-none"
                                    >
                                        <option value="MEMBER">Member</option>
                                        <option value="LEADER">Leader</option>
                                    </select>
                                    <button
                                        onClick={handleAddMember}
                                        disabled={isAddingMember}
                                        className="h-11 px-5 rounded-xl bg-purple-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center gap-2 justify-center"
                                    >
                                        {isAddingMember ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <UserPlus className="w-3.5 h-3.5" />
                                                Add
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Members list */}
                        {isLoadingMembers ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                            </div>
                        ) : members.length === 0 ? (
                            <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                                    <Users className="w-6 h-6 text-zinc-600" />
                                </div>
                                <p className="text-sm text-zinc-500 font-bold">No members yet</p>
                                <p className="text-xs text-zinc-600 mt-1">Add team members using the button above</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {members.map((member: any) => {
                                    const isEditingMember = editingMemberId === member.id

                                    if (isEditingMember) {
                                        return (
                                            <div
                                                key={member.id}
                                                className="bg-zinc-900 border border-purple-500/30 rounded-2xl p-4 animate-in fade-in duration-200"
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        <div className="flex-1 space-y-1.5">
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Name</label>
                                                            <input
                                                                type="text"
                                                                value={editMemberName}
                                                                onChange={(e) => setEditMemberName(e.target.value)}
                                                                className="w-full h-10 bg-zinc-800 border border-white/5 rounded-xl px-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                                            />
                                                        </div>
                                                        <div className="w-full sm:w-32 space-y-1.5">
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Role</label>
                                                            <select
                                                                value={editMemberRole}
                                                                onChange={(e) => setEditMemberRole(e.target.value)}
                                                                className="w-full h-10 bg-zinc-800 border border-white/5 rounded-xl px-2 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50 appearance-none"
                                                            >
                                                                <option value="MEMBER">Member</option>
                                                                <option value="LEADER">Leader</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Phone</label>
                                                            <input
                                                                type="text"
                                                                value={editMemberPhone}
                                                                onChange={(e) => setEditMemberPhone(e.target.value)}
                                                                placeholder="Member Phone"
                                                                className="w-full h-10 bg-zinc-800 border border-white/5 rounded-xl px-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Contact Email</label>
                                                            <input
                                                                type="email"
                                                                value={editMemberEmail}
                                                                onChange={(e) => setEditMemberEmail(e.target.value)}
                                                                placeholder="Personal Email"
                                                                className="w-full h-10 bg-zinc-800 border border-white/5 rounded-xl px-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">LinkedIn Profile</label>
                                                            <input
                                                                type="text"
                                                                value={editMemberLinkedin}
                                                                onChange={(e) => setEditMemberLinkedin(e.target.value)}
                                                                placeholder="https://linkedin.com/in/..."
                                                                className="w-full h-10 bg-zinc-800 border border-white/5 rounded-xl px-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">GitHub Profile</label>
                                                            <input
                                                                type="text"
                                                                value={editMemberGithub}
                                                                onChange={(e) => setEditMemberGithub(e.target.value)}
                                                                placeholder="https://github.com/..."
                                                                className="w-full h-10 bg-zinc-800 border border-white/5 rounded-xl px-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className="relative">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={editMemberIsAccepted}
                                                                    onChange={(e) => setEditMemberIsAccepted(e.target.checked)}
                                                                    className="sr-only"
                                                                />
                                                                <div className={`w-10 h-5 rounded-full transition-colors ${editMemberIsAccepted ? "bg-emerald-500" : "bg-zinc-700"}`} />
                                                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${editMemberIsAccepted ? "translate-x-5" : ""}`} />
                                                            </div>
                                                            <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                                                Checked In (Accepted)
                                                            </span>
                                                        </label>

                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => setEditingMemberId(null)}
                                                                className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateMember(member.id)}
                                                                disabled={isUpdatingMember}
                                                                className="flex items-center gap-2 px-4 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                                                            >
                                                                {isUpdatingMember ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                                                Update
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                    return (
                                        <div
                                            key={member.id}
                                            className="group flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-900/40 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all gap-4"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5 flex items-center justify-center flex-shrink-0">
                                                    <User className="w-5 h-5 text-purple-400/70" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm text-white truncate max-w-[150px] sm:max-w-none">
                                                        {member.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${member.role === 'LEADER' ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-800 text-zinc-500'}`}>
                                                            {member.role}
                                                        </span>
                                                        {member.isAccepted ? (
                                                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                                                                <div className="w-1 h-1 rounded-full bg-emerald-400" />
                                                                Checked-In
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-400/70">
                                                                <div className="w-1 h-1 rounded-full bg-amber-400/50" />
                                                                Not Checked-In
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end gap-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                                                <button
                                                    onClick={() => toggleCheckIn(member)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${member.isAccepted
                                                        ? "bg-amber-500/5 text-amber-500/50 hover:bg-amber-500/10 hover:text-amber-500"
                                                        : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                                        }`}
                                                >
                                                    {member.isAccepted ? "Revert" : "Check-In"}
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setEditingMemberId(member.id)
                                                        setEditMemberName(member.name)
                                                        setEditMemberRole(member.role)
                                                        setEditMemberIsAccepted(member.isAccepted)
                                                        const meta = (member.meta as any) || {}
                                                        setEditMemberPhone(meta.phone || "")
                                                        setEditMemberEmail(meta.email || "")
                                                        setEditMemberLinkedin(meta.linkedin || "")
                                                        setEditMemberGithub(meta.github || "")
                                                    }}
                                                    className="p-2 rounded-xl text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                                                    title="Edit Member"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteMember(member.id)}
                                                    disabled={deletingMemberId === member.id}
                                                    className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                    title="Delete Member"
                                                >
                                                    {deletingMemberId === member.id ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </section>

                    {/* ─── Checkpoints Section ───── */}
                    <section className="mt-8 pt-8 border-t border-white/5 pb-10">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                <ClipboardCheck className="w-4 h-4" />
                                Milestone Tracker
                                <span className="ml-1 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[9px]">
                                    {checkpoints.length}
                                </span>
                            </h4>
                        </div>

                        {isLoadingCheckpoints ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                            </div>
                        ) : checkpoints.length === 0 ? (
                            <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                                    <CheckSquare className="w-6 h-6 text-zinc-600" />
                                </div>
                                <p className="text-sm text-zinc-500 font-bold">No milestones defined</p>
                                <p className="text-xs text-zinc-600 mt-1">Milestones must be defined in the Event settings</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {checkpoints.map((cp: any) => {
                                    const progress = cp.teamProgress
                                    const status = progress?.status || 'PENDING'
                                    const isUpdating = updatingCheckpointId === cp.id

                                    return (
                                        <div
                                            key={cp.id}
                                            className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-black text-white">
                                                            {cp.order}
                                                        </div>
                                                        <h5 className="font-bold text-white truncate">{cp.title}</h5>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 leading-relaxed max-w-md">
                                                        {cp.description || "No description provided for this milestone."}
                                                    </p>

                                                    {/* Submission Data display if any */}
                                                    {progress?.submissionData?.items && Array.isArray(progress.submissionData.items) && (
                                                        <div className="mt-4 p-4 rounded-xl bg-zinc-950 border border-white/5">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-2 flex items-center gap-1.5">
                                                                <MessageSquare className="w-3 h-3" /> Team Submission
                                                            </p>
                                                            <ul className="space-y-1.5">
                                                                {progress.submissionData.items.map((item: any, idx: number) => (
                                                                    <li key={idx} className="text-xs text-zinc-400 flex gap-2">
                                                                        <span className="text-zinc-600">•</span>
                                                                        {typeof item === 'string' ? item : (item.text || JSON.stringify(item))}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[180px]">
                                                    <div className="flex items-center justify-between md:justify-end gap-2">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                                                            status === 'SUBMITTED' ? 'bg-blue-500/10 text-blue-400' :
                                                                status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                                                                    'bg-zinc-800 text-zinc-500'
                                                            }`}>
                                                            {status}
                                                        </span>
                                                        {isUpdating && <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            onClick={() => handleUpdateCheckpoint(cp.id, 'APPROVED', progress?.reviewerNotes)}
                                                            disabled={isUpdating || status === 'APPROVED'}
                                                            className="flex items-center justify-center gap-1.5 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/20 disabled:opacity-50 transition-all"
                                                        >
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateCheckpoint(cp.id, 'REJECTED', progress?.reviewerNotes)}
                                                            disabled={isUpdating || status === 'REJECTED'}
                                                            className="flex items-center justify-center gap-1.5 h-9 rounded-xl bg-red-500/10 text-red-400 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 disabled:opacity-50 transition-all"
                                                        >
                                                            <AlertCircle className="w-3 h-3" />
                                                            Reject
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => handleUpdateCheckpoint(cp.id, 'PENDING', progress?.reviewerNotes)}
                                                        disabled={isUpdating || status === 'PENDING'}
                                                        className="w-full h-9 rounded-xl bg-zinc-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                                                    >
                                                        <RotateCcw className="w-3 h-3" />
                                                        Reset
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Reviewer Notes Field */}
                                            <div className="mt-6 pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">
                                                        Reviewer Notes
                                                    </label>
                                                </div>
                                                <textarea
                                                    value={progress?.reviewerNotes || ""}
                                                    onChange={(e) => {
                                                        const newCheckpoints = [...checkpoints]
                                                        const idx = newCheckpoints.findIndex(c => c.id === cp.id)
                                                        if (idx !== -1) {
                                                            if (!newCheckpoints[idx].teamProgress) {
                                                                newCheckpoints[idx].teamProgress = { status: 'PENDING' }
                                                            }
                                                            newCheckpoints[idx].teamProgress.reviewerNotes = e.target.value
                                                            setCheckpoints(newCheckpoints)
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (e.target.value !== (cp.teamProgress?.reviewerNotes || "")) {
                                                            handleUpdateCheckpoint(cp.id, status, e.target.value)
                                                        }
                                                    }}
                                                    placeholder="Add feedback for the team..."
                                                    className="w-full h-16 bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </div >
        </div >
    )
}
