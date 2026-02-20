"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Zap, Loader2, User, Lock, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [loginType, setLoginType] = useState<"choice" | "team">("choice")

    // Team login state
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            await signIn("google", { callbackUrl: "/" })
        } catch (error) {
            toast.error("Google sign-in failed")
            setIsLoading(false)
        }
    }

    const handleTeamLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            })

            if (result?.error) {
                toast.error("Invalid team credentials")
                setIsLoading(false)
            } else {
                toast.success("Welcome back, Team!")
                router.push("/team")
                router.refresh()
            }
        } catch (error) {
            toast.error("Team login failed")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/10 blur-[140px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-slate-900/20 blur-[140px] rounded-full" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic text-white">Welcome Back</h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Entry Portal v2.6</p>
                </div>

                {loginType === "choice" ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full group relative flex items-center justify-center gap-3 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
                            )}
                            Continue with Google
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5" />
                            </div>
                            <div className="relative flex justify-center text-[9px] uppercase">
                                <span className="bg-[#0B0E14] px-4 text-slate-600 font-black tracking-[0.4em]">OR</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setLoginType("team")}
                            className="w-full flex items-center justify-center gap-3 h-14 bg-white/[0.02] border border-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all hover:bg-white/[0.05] hover:border-white/10"
                        >
                            <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                            Team Account Login
                        </button>

                        <p className="text-center text-slate-700 text-[9px] font-black uppercase tracking-[0.3em] pt-4">
                            Authorized personnel only
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleTeamLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-1">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input
                                    type="text"
                                    placeholder="TEAM USERNAME"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input
                                    type="password"
                                    placeholder="PASSWORD"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 h-14 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "SIGN IN TO DASHBOARD"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setLoginType("choice")}
                            className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Back to other options
                        </button>
                    </form>
                )}
            </div>

            <footer className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.3em]">Engineering Excellence</p>
            </footer>
        </div>
    )
}
