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
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[140px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[140px] rounded-full" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="relative w-16 h-16 mb-4">
                        <Image src="/assets/favicon.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Entry Portal</p>
                </div>

                {loginType === "choice" ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full group relative flex items-center justify-center gap-3 h-14 bg-white text-black rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
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
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-black px-2 text-zinc-600 font-bold tracking-widest">OR</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setLoginType("team")}
                            className="w-full flex items-center justify-center gap-3 h-14 bg-zinc-900 border border-white/10 text-white rounded-2xl font-bold transition-all hover:bg-zinc-800 hover:border-white/20"
                        >
                            <Zap className="w-5 h-5 text-purple-400 fill-purple-400" />
                            Team Account Login
                        </button>

                        <p className="text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest pt-4">
                            Authorized personnel only
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleTeamLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-1">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Team Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full h-14 bg-zinc-900 border border-white/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full h-14 bg-zinc-900 border border-white/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 h-14 bg-purple-600 text-white rounded-2xl font-bold transition-all hover:bg-purple-500 active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in to Dashboard"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setLoginType("choice")}
                            className="w-full text-zinc-500 text-sm font-medium hover:text-white transition-colors"
                        >
                            Back to other options
                        </button>
                    </form>
                )}
            </div>

            <footer className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">Engineering Excellence</p>
            </footer>
        </div>
    )
}
