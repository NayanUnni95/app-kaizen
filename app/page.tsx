import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Image from "next/image"
import { DevLabel } from "@/components/DevLabel"
import { UserRole } from "@prisma/client"
import Link from "next/link"
import { getTeamBySession } from "@/lib/hackathon/teams"

export default async function Home() {
    const session = await auth()

    if (session?.user) {
        const role = (session.user as any).role

        // Admin & Organizer are fine to redirect immediately
        if (role === UserRole.ADMIN) redirect("/admin")
        if (role === UserRole.ORGANIZER) redirect("/organizer")

        // TEAM role MUST verify actual team existence
        if (role === UserRole.TEAM) {
            const team = await getTeamBySession(session.user)

            if (team) {
                redirect("/team")
            } else {
                redirect("/team/join") // onboarding instead of looping
            }
        }
        // Regular USER continues to homepage UI
    }

    return (
        <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background gradient blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-900/20 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">
                            KAIZEN<span className="text-indigo-500">.</span>
                        </h1>
                        <DevLabel />
                    </div>
                    <p className="text-slate-500 font-black tracking-[0.3em] uppercase text-[10px]">
                        Management Protocol v2.6
                    </p>
                </div>

                <p className="text-slate-400 text-sm max-w-sm leading-relaxed font-bold uppercase tracking-tight">
                    Engineering a premium experience for organizers, teams, and attendees.
                </p>

                <div className="flex flex-col gap-4 w-full max-w-xs mt-4">
                    {session?.user ? (
                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">
                                Authenticated as {(session.user as any).role}
                            </p>
                            <Link
                                href="/team"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.02] border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-white/[0.05] transition-all shadow-2xl"
                            >
                                Access Control
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href="/user"
                            className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-indigo-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Enter Platform
                        </Link>
                    )}
                </div>
            </main>

            <footer className="absolute bottom-8 text-slate-700 text-[10px] font-black tracking-[0.3em] uppercase">
                © 2026 Sathwa • Engineering Excellence
            </footer>
        </div>
    )
}
