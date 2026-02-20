import { auth, signOut } from "@/auth"
import { getTeamById } from "@/lib/hackathon/teams"
import { Avatar } from "@/components/ui/Avatar"
import { EmptyState } from "@/components/ui/EmptyState"
import {
    User, Mail, Shield, LogOut, Users, CheckSquare,
    Phone, Linkedin, ExternalLink, Upload, Github, Info
} from "lucide-react"

const STATUS_BADGE_MAP: Record<string, { label: string, cls: string }> = {
    active: { label: "Active", cls: "bg-[#D1FAE5] text-[#065F46]" },
    paused: { label: "Paused", cls: "bg-[#FEF3C7] text-[#92400E]" },
    submitted: { label: "Submitted", cls: "bg-[#EFF6FF] text-[#1D4ED8]" },
}

export default async function TeamProfilePage() {
    const session = await auth()
    const teamId = (session?.user as any)?.teamId
    const team = teamId ? await getTeamById(teamId) : null

    if (!team) return (
        <div className="p-6 text-center text-[#64748B]">
            <p className="font-semibold">Team not found</p>
        </div>
    )

    const isActive = team.isActive
    const statusKey = isActive ? "active" : "paused"
    const statusBadge = STATUS_BADGE_MAP[statusKey]

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <header className="kz-animate-fade-in">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#0F172A]">Team Profile</h1>
                <p className="text-[#64748B] text-sm mt-1">Your squad details and project status</p>
            </header>

            {/* ─── Team Card ─────────────────────────────── */}
            <section className="kz-card p-6 kz-animate-slide-up" style={{ animationDelay: "0.05s" }}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    {/* Large team avatar */}
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)", color: "white" }}
                    >
                        {team.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h2 className="font-heading font-bold text-xl text-[#0F172A]">{team.name}</h2>
                            <span className={`kz-badge text-[10px] ${statusBadge.cls}`}>
                                {statusBadge.label}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-[#64748B]">
                            <span className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                                @{team.username}
                            </span>
                            {team.email && (
                                <span className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                                    {team.email}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E6E9EE] text-[#64748B]">
                                {team.event.name}
                            </span>
                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E6E9EE] text-[#64748B]">
                                {team.members.length} members
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Members List ───────────────────────────── */}
            <section className="kz-animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-heading font-semibold text-base text-[#0F172A] flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#2563EB]" />
                        Squad Members
                    </h2>
                    <span className="text-xs text-[#94A3B8] font-medium">{team.members.length} members</span>
                </div>

                {team.members.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No members yet"
                        description="Team members added by the organizer will appear here."
                    />
                ) : (
                    <div className="kz-card overflow-hidden divide-y divide-[#E6E9EE]">
                        {team.members.map((member: any) => {
                            const isLeader = member.role === 'LEADER'
                            const meta = member.meta as any ?? {}

                            return (
                                <div key={member.id} className="flex items-center gap-4 p-4 hover:bg-[#F8FAFC] transition-colors">
                                    {/* Avatar */}
                                    <Avatar name={member.name} size="md" className="flex-shrink-0" />

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-sm text-[#0F172A]">{member.name}</p>
                                            {isLeader && (
                                                <span className="kz-badge bg-[#EFF6FF] text-[#1D4ED8] text-[10px]">
                                                    <Shield className="w-2.5 h-2.5" />
                                                    Leader
                                                </span>
                                            )}
                                            <span className={`flex items-center gap-1 text-[10px] font-semibold ${member.isAccepted ? "text-[#16A34A]" : "text-[#EF4444]"}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${member.isAccepted ? "bg-[#16A34A]" : "bg-[#EF4444]"}`} />
                                                {member.isAccepted ? "Checked in" : "Not Checked-in"}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-3 mt-1">
                                            {meta?.phone && (
                                                <span className="flex items-center gap-1 text-[11px] text-[#64748B]">
                                                    <Phone className="w-3 h-3" /> {meta.phone}
                                                </span>
                                            )}
                                            {meta?.email && (
                                                <span className="flex items-center gap-1 text-[11px] text-[#64748B]">
                                                    <Mail className="w-3 h-3" /> {meta.email}
                                                </span>
                                            )}
                                            {meta?.linkedin && (
                                                <a
                                                    href={meta.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-[11px] text-[#2563EB] hover:underline"
                                                >
                                                    <Linkedin className="w-3 h-3" /> LinkedIn
                                                </a>
                                            )}
                                            {meta?.github && (
                                                <a
                                                    href={meta.github.startsWith('http') ? meta.github : `https://github.com/${meta.github}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-[11px] text-[#0F172A] hover:underline"
                                                >
                                                    <Github className="w-3 h-3" /> GitHub
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* ─── Project Status Form ─────────────────────── */}
            <section className="kz-animate-slide-up" style={{ animationDelay: "0.15s" }}>
                <div className="flex items-center gap-2 mb-3">
                    <h2 className="font-heading font-semibold text-base text-[#0F172A] flex items-center gap-2">
                        <Upload className="w-4 h-4 text-[#2563EB]" />
                        Project Submission
                    </h2>
                </div>

                <div className="kz-card p-5">
                    {/* Info banner — admin unlock required */}
                    <div className="flex items-start gap-3 p-4 bg-[#FEF3C7] rounded-xl border border-[#FCD34D] mb-5">
                        <Info className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-[#92400E]">Submission not yet open</p>
                            <p className="text-xs text-[#B45309] mt-0.5">
                                Project submission will be enabled by admins at the end of the hackathon.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 opacity-50 pointer-events-none select-none">
                        {/* Repo URL */}
                        <div>
                            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">
                                Repository URL
                            </label>
                            <div className="relative">
                                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                                <input
                                    type="url"
                                    disabled
                                    placeholder="https://github.com/your-team/project"
                                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E6E9EE] text-sm bg-[#F8FAFC] text-[#64748B]"
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        <div>
                            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">
                                Project Summary
                            </label>
                            <textarea
                                disabled
                                placeholder="Describe your project..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-[#E6E9EE] text-sm resize-none bg-[#F8FAFC] text-[#64748B]"
                            />
                        </div>

                        {/* Tech stack */}
                        <div>
                            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">
                                Tech Stack
                            </label>
                            <input
                                type="text"
                                disabled
                                placeholder="React, Node.js, PostgreSQL..."
                                className="w-full h-11 px-4 rounded-xl border border-[#E6E9EE] text-sm bg-[#F8FAFC] text-[#64748B]"
                            />
                        </div>

                        {/* PPT upload */}
                        <div>
                            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">
                                Presentation (PPT/PDF)
                            </label>
                            <div className="border-2 border-dashed border-[#E6E9EE] rounded-xl p-6 text-center bg-[#F8FAFC]">
                                <Upload className="w-6 h-6 text-[#94A3B8] mx-auto mb-2" />
                                <p className="text-sm text-[#94A3B8]">Drop file here or click to upload</p>
                                <p className="text-xs text-[#CBD5E1] mt-1">PPTX or PDF, max 50MB</p>
                            </div>
                        </div>

                        <button disabled className="kz-btn-primary w-full py-3 text-sm opacity-50 cursor-not-allowed">
                            Submit Project
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── Quick Actions ───────────────────────────── */}
            <section className="kz-animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="grid grid-cols-2 gap-3">
                    <a
                        href="/team/checkpoints"
                        className="flex flex-col items-center gap-2 p-4 kz-card text-center hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition-all"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                            <CheckSquare className="w-5 h-5 text-[#2563EB]" />
                        </div>
                        <span className="text-sm font-semibold text-[#0F172A]">Checkpoints</span>
                    </a>
                    <button
                        disabled
                        className="flex flex-col items-center gap-2 p-4 kz-card text-center opacity-50 cursor-not-allowed"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center">
                            <ExternalLink className="w-5 h-5 text-[#94A3B8]" />
                        </div>
                        <span className="text-sm font-semibold text-[#64748B]">Submit Project</span>
                    </button>
                </div>
            </section>

            {/* ─── Logout ─────────────────────────────────── */}
            <section className="kz-animate-slide-up" style={{ animationDelay: "0.25s" }}>
                <form
                    action={async () => {
                        "use server"
                        await signOut({ redirectTo: "/" })
                    }}
                >
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 h-12 bg-[#FEE2E2] text-[#DC2626] rounded-xl font-semibold text-sm hover:bg-[#DC2626] hover:text-white transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out Team Account
                    </button>
                </form>
            </section>
        </div>
    )
}
