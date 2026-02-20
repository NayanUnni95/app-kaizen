"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Zap, Loader2, Sparkles, ArrowRight, Shield, Globe } from "lucide-react"

export default function UserPortalPage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            await signIn("google", { callbackUrl: "/" })
        } catch (error) {
            console.error("Google sign-in failed")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Elite Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[140px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-slate-500/5 blur-[140px] rounded-full" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="flex flex-col items-center mb-12">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group transition-all duration-700 hover:border-indigo-500/30">
                        <Globe className="w-7 h-7 text-indigo-400 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter mb-3 uppercase italic text-white text-center">User Portal</h1>
                    <p className="text-slate-500 text-[10px] font-mono-tech font-bold uppercase tracking-[0.4em]">Satellite_Link: Operational</p>
                </div>

                <div className="kz-card-rich p-8 bg-white/[0.02] border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-lg font-heading font-black text-white uppercase tracking-tight">Access Frequency</h2>
                            <p className="text-[12px] text-slate-500 font-semibold leading-relaxed">
                                Universal authentication for attendees, mentors, and guests. Sync your profile to enter the ecosystem.
                            </p>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full group relative flex items-center justify-center gap-3 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
                            )}
                            Continue with Google
                        </button>

                        <div className="flex items-center gap-4 pt-4 grayscale opacity-40">
                            <div className="px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                                <Shield className="w-3 h-3 text-slate-400" />
                                <span className="text-[9px] font-mono-tech font-bold uppercase tracking-widest text-slate-400">Secure_TLS</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-slate-400" />
                                <span className="text-[9px] font-mono-tech font-bold uppercase tracking-widest text-slate-400">Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <footer className="absolute bottom-12 left-0 right-0 text-center">
                <p className="text-white/10 text-[10px] font-mono-tech font-bold uppercase tracking-[0.5em]">2026_SATHWA_KAIA_PROTOCOL</p>
            </footer>
        </div>
    )
}
