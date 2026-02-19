import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Image from "next/image"
import { DevLabel } from "@/components/DevLabel"
import { UserRole } from "@prisma/client"
import Link from "next/link"

export default async function Home() {
    const session = await auth()

    if (session?.user) {
        const role = (session.user as any).role
        if (role === UserRole.ADMIN) redirect("/admin")
        if (role === UserRole.ORGANIZER) redirect("/organizer")
        if (role === UserRole.TEAM) redirect("/team")
        // If they are just a regular USER, we stay on this page but show a dynamic button
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background gradient blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
                {/* Logo */}
                {/* <div className="relative w-20 h-20">
                    <Image src="/assets/favicon.png" alt="Logo" fill className="object-contain animate-pulse" />
                </div> */}

                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                            App Kaizen
                        </h1>
                        <DevLabel />
                    </div>
                    <p className="text-zinc-500 font-medium tracking-widest uppercase text-xs">Hackathon Management Platform</p>
                </div>

                <p className="text-zinc-400 text-base max-w-sm leading-relaxed">
                    A premium experience for organizers, teams, and attendees.
                </p>

                <div className="flex flex-col gap-4 w-full max-w-xs mt-4">
                    {session?.user ? (
                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Welcome, {session.user.name || session.user.email}</p>
                            <Link
                                href="/admin"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black italic uppercase tracking-tighter text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-blue-500/20"
                            >
                                Admin Dashboard
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href="/hackathon-login"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-black italic uppercase tracking-tighter text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
                        >
                            Enter Platform
                        </Link>
                    )}
                </div>
            </main>

            <footer className="absolute bottom-8 text-zinc-600 text-[10px] font-bold tracking-[0.2em] uppercase">
                © 2026 Sathwa • Engineering Excellence
            </footer>
        </div>
    )
}
