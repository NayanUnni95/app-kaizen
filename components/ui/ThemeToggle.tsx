"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5" />
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 rounded-xl bg-white/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-center justify-center text-slate-500 hover:text-indigo-500 hover:border-indigo-500/20 transition-all duration-300 group relative overflow-hidden"
            aria-label="Toggle theme"
        >
            <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors duration-500" />

            {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5 relative z-10 animate-in zoom-in-50 duration-500" />
            ) : (
                <Moon className="w-4.5 h-4.5 relative z-10 animate-in zoom-in-50 duration-500" />
            )}
        </button>
    )
}
