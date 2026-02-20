// components/SplashOverlay.tsx
"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

export function SplashOverlay() {
    const [visible, setVisible] = useState(false)
    const [hiding, setHiding] = useState(false)
    const [mounted, setMounted] = useState(false)
    const didShowRef = useRef<boolean>(false)
    const pathname = usePathname()

    const dismiss = useCallback(() => {
        setHiding(true)
        setTimeout(() => setVisible(false), 600)
        try {
            localStorage.setItem("kz_splash_seen_v3", "true")
            sessionStorage.setItem("kz_splash_shown_this_session", "true")
                ; (window as any).__kz_splash_shown = true
        } catch (e) {
            console.error("Storage error", e)
        }
    }, [])

    useEffect(() => {
        setMounted(true)

        // Safety: don't run if already shown in this SPA session
        if ((window as any).__kz_splash_shown) return

        try {
            const seen = localStorage.getItem("kz_splash_seen_v3")
            const shownThisSession = sessionStorage.getItem("kz_splash_shown_this_session")
            const globalFlag = (window as any).__kz_splash_shown

            // Only show if not previously seen and not shown this session (and not flagged globally)
            if (seen || shownThisSession || globalFlag) return

            // Only show on the home path by default (adjust if you want it to show on other first-load pages)
            const isHomePath = pathname === "/" || pathname === ""
            if (!isHomePath) return

            if (didShowRef.current) return
            didShowRef.current = true

            setVisible(true)

            const autoHide = setTimeout(dismiss, 5000)

            const handleKey = (e: KeyboardEvent) => {
                if (e.key === "Escape") dismiss()
            }
            document.addEventListener("keydown", handleKey)

            return () => {
                clearTimeout(autoHide)
                document.removeEventListener("keydown", handleKey)
            }
        } catch (e) {
            console.error("SplashOverlay read error", e)
        }
    }, [dismiss, pathname])

    if (!mounted || !visible) return null

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Kaizen welcome splash"
            className={`
        fixed inset-0 z-[9999] flex flex-col items-center justify-center
        bg-white dark:bg-[#080808] transition-opacity duration-700 ease-in-out
        ${hiding ? "opacity-0 invisible" : "opacity-100 visible"}
      `}
        >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/assets/grain.svg')]" />

            <div className={`relative z-10 flex flex-col items-center gap-8 ${hiding ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} transition-all duration-700 ease-out`}>
                <div className="relative group">
                    <Image
                        src="/assets/kaizen-asset.png"
                        alt="Kaizen"
                        width={120}
                        height={120}
                        unoptimized
                        priority
                        className="relative z-10 transition-transform duration-700 group-hover:scale-105"
                    />
                </div>

                <div className="text-center space-y-2">
                    <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight">
                        KAIZEN
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium uppercase tracking-widest">
                        Hackathon Management Platform
                    </p>
                </div>

                <div className="flex items-center gap-2 mt-4">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"
                        />
                    ))}
                </div>
            </div>

            <button
                onClick={dismiss}
                className="
          absolute bottom-12 left-1/2 -translate-x-1/2
          px-6 py-2.5 text-[11px] font-bold text-slate-400 dark:text-indigo-100/40 uppercase tracking-[0.2em]
          border border-black/5 dark:border-white/10 rounded-full
          hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white hover:border-black/10 dark:hover:border-white/20
          transition-all duration-300 kz-animate-fade-in
        "
                style={{ animationDelay: "1s" }}
                aria-label="Skip introduction"
            >
                Skip Entrance
            </button>

            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-slate-400 dark:text-white/20 font-medium uppercase tracking-widest">
                Press ESC to dismiss
            </span>
        </div>
    )
}
