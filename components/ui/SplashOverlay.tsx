"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"

export function SplashOverlay() {
    const [visible, setVisible] = useState(true)
    const [hiding, setHiding] = useState(false)

    const dismiss = useCallback(() => {
        setHiding(true)
        setTimeout(() => setVisible(false), 600)
    }, [])

    useEffect(() => {
        // Auto-hide after 5 seconds
        const autoHide = setTimeout(dismiss, 5000)

        // Esc key to dismiss
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") dismiss()
        }
        document.addEventListener("keydown", handleKey)

        return () => {
            clearTimeout(autoHide)
            document.removeEventListener("keydown", handleKey)
        }
    }, [dismiss])

    if (!visible) return null

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Kaizen welcome splash"
            className={`
                fixed inset-0 z-[9999] flex flex-col items-center justify-center
                bg-[#0F172A] transition-opacity duration-700 ease-in-out
                ${hiding ? "opacity-0 invisible" : "opacity-100 visible"}
            `}
        >
            {/* Background cinematic aura */}
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    background: "radial-gradient(circle at 50% 50%, #1E3A8A 0%, transparent 70%)",
                }}
            />

            {/* Animated grain overlay for texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Logo + Text Content */}
            <div className={`relative z-10 flex flex-col items-center gap-8 ${hiding ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} transition-all duration-700 ease-out`}>
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 group">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors duration-1000" />
                    <Image
                        src="/assets/kaizen-asset.png"
                        alt="Kaizen Logo"
                        fill
                        className="object-contain relative z-10 drop-shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                        priority
                    />
                </div>

                <div className="text-center space-y-2">
                    <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        KAIZEN
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-blue-500/50" />
                        <p className="text-blue-100/60 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em]">
                            Hackathon Management Platform
                        </p>
                        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-blue-500/50" />
                    </div>
                </div>

                {/* Refined loading indicator */}
                <div className="flex items-center gap-2 mt-4">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-blue-400"
                            style={{
                                animation: "kz-pulse-dot 1.5s ease-in-out infinite",
                                animationDelay: `${i * 0.3}s`,
                                opacity: 0.6,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Premium Skip CTA */}
            <button
                onClick={dismiss}
                className="
                    absolute bottom-12 left-1/2 -translate-x-1/2
                    px-6 py-2.5 text-[11px] font-bold text-blue-100/40 uppercase tracking-[0.2em]
                    border border-white/10 rounded-full
                    hover:bg-white/5 hover:text-white hover:border-white/20
                    transition-all duration-300 kz-animate-fade-in
                "
                style={{ animationDelay: "1s" }}
                aria-label="Skip introduction"
            >
                Skip Entrance
            </button>

            {/* Keyboard hint */}
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-white/20 font-medium uppercase tracking-widest">
                Press ESC to dismiss
            </span>
        </div>
    )
}
