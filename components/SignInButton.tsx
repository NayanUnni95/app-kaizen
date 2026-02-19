"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Zap, Loader2 } from "lucide-react"

export function SignInButton() {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <button
            onClick={async () => {
                setIsLoading(true)
                try {
                    await signIn("google")
                } catch (error) {
                    setIsLoading(false)
                }
            }}
            disabled={isLoading}
            className="w-full sm:w-auto rounded-2xl transition-all flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-black gap-3 font-black italic uppercase tracking-tighter text-base h-16 px-10 hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-50"
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Zap className="w-5 h-5 fill-current" />
            )}
            {isLoading ? "Signing in..." : "Sign in with Google"}
        </button>
    )
}
