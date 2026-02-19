import { auth, signOut } from "@/auth"
import { getTeamById } from "@/lib/hackathon/teams"
import { User, Mail, Shield, LogOut, Trash2, Plus } from "lucide-react"

export default async function TeamProfilePage() {
    const session = await auth()
    const teamId = (session?.user as any).teamId
    const team = await getTeamById(teamId)

    if (!team) return <div>Team not found</div>

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight">Team Profile</h1>
                <p className="text-zinc-500 font-medium italic">Manage your squad and credentials.</p>
            </header>

            {/* Team Info */}
            <section className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center text-3xl font-black italic shadow-2xl shadow-purple-500/20">
                        {team.name[0]}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black">{team.name}</h2>
                        <div className="flex items-center gap-4 mt-1 text-zinc-500 text-sm font-medium">
                            <span className="flex items-center gap-1.5 ring-1 ring-white/10 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-tighter">
                                <User className="w-3 h-3" />
                                {team.username}
                            </span>
                            {team.email && (
                                <span className="flex items-center gap-1.5">
                                    <Mail className="w-3 h-3" />
                                    {team.email}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Members List */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Squad Members</h3>
                </div>

                <div className="grid gap-3">
                    {team.members.map((member) => (
                        <div key={member.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-white">{member.name}</p>
                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest leading-none mt-1">{member.role}</p>
                                </div>
                            </div>
                            {member.role === 'LEADER' && (
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <Shield className="w-4 h-4 text-green-500" />
                                </div>
                            )}
                        </div>
                    ))}
                    <button className="w-full flex items-center justify-center gap-2 h-14 bg-zinc-900/30 border border-dashed border-white/10 text-zinc-600 rounded-2xl font-bold hover:text-zinc-400 hover:border-white/20 transition-all">
                        <Plus className="w-4 h-4" />
                        Invite Subscriptions
                    </button>
                </div>
            </section>

            {/* Settings/Danger Zone */}
            <section className="pt-6 border-t border-white/5">
                <form
                    action={async () => {
                        "use server"
                        await signOut({ redirectTo: "/" })
                    }}
                >
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 h-14 bg-red-500/10 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Log Out Team Account
                    </button>
                </form>
            </section>
        </div>
    )
}
