"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Timer, AlertCircle, X, ChevronUp, ChevronDown } from "lucide-react"

export default function TimerPage() {
    const [maxTime, setMaxTime] = useState(180) // Default 3 minutes
    const [timeLeft, setTimeLeft] = useState(maxTime)
    const [isActive, setIsActive] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [halfTimeReached, setHalfTimeReached] = useState(false)
    const [inputMinutes, setInputMinutes] = useState(3)
    const [inputSeconds, setInputSeconds] = useState(0)

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const playBeep = () => {
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)()
            const oscillator = context.createOscillator()
            const gainNode = context.createGain()

            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(880, context.currentTime) // A5
            gainNode.gain.setValueAtTime(0.1, context.currentTime)

            oscillator.connect(gainNode)
            gainNode.connect(context.destination)

            oscillator.start()
            oscillator.stop(context.currentTime + 0.5)
        } catch (e) {
            console.error("Audio beep failed", e)
        }
    }

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    const nextValue = prev - 1
                    const halfPoint = Math.floor(maxTime / 2)

                    // Half-time auto stop logic
                    if (!halfTimeReached && nextValue === halfPoint && maxTime > 1) {
                        setIsActive(false)
                        setHalfTimeReached(true)
                        playBeep()
                        if (timerRef.current) clearInterval(timerRef.current)
                        return nextValue
                    }

                    if (nextValue <= 0) {
                        setIsActive(false)
                        setShowAlert(true)
                        playBeep() // Final beep
                        if (timerRef.current) clearInterval(timerRef.current)
                        return 0
                    }
                    return nextValue
                })
            }, 1000)
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isActive, timeLeft, halfTimeReached, maxTime])

    const handleStart = () => {
        if (timeLeft === 0) {
            // If they click start at 0, reset to max and start
            const totalSeconds = inputMinutes * 60 + inputSeconds
            if (totalSeconds === 0) return
            setTimeLeft(totalSeconds)
            setMaxTime(totalSeconds)
        }
        setIsActive(true)
        setShowAlert(false)
    }

    const handleStop = () => {
        setIsActive(false)
    }

    const handleReset = () => {
        setIsActive(false)
        const totalSeconds = inputMinutes * 60 + inputSeconds
        setTimeLeft(totalSeconds)
        setMaxTime(totalSeconds)
        setShowAlert(false)
        setHalfTimeReached(false)
    }

    const handleUpdate = () => {
        const totalSeconds = inputMinutes * 60 + inputSeconds
        setMaxTime(totalSeconds)
        setTimeLeft(totalSeconds)
        setIsActive(false)
        setShowAlert(false)
        setHalfTimeReached(false)
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const quickSets = [
        { label: "30s", val: 30 },
        { label: "1m", val: 60 },
        { label: "3m", val: 180 },
        { label: "5m", val: 300 },
        { label: "10m", val: 600 }
    ]

    return (
        <div className="min-h-screen bg-[#080809] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Premium Aesthetic Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-900/20 blur-[120px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            <main className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8 md:gap-16">
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Timer className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
                            KAIZEN<span className="text-indigo-500">_</span>TIMER
                        </h1>
                    </div>
                    <p className="text-zinc-600 text-[10px] font-mono-tech font-bold uppercase tracking-[0.4em] select-none">
                        Protocol_Status: {isActive ? 'Running' : 'Ready'} // V2.6
                    </p>
                </div>

                {/* Main Timer Display */}
                <div className={`relative transition-all duration-700 ${isActive ? 'scale-105 md:scale-110' : 'scale-100'}`}>
                    <div className={`absolute -inset-20 bg-indigo-500/10 blur-[100px] rounded-full transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                    <div className="text-[6rem] sm:text-[10rem] md:text-[14rem] font-black tracking-tight leading-none font-mono tabular-nums select-none flex items-center justify-center relative drop-shadow-[0_0_80px_rgba(99,102,241,0.15)]">
                        <span className={timeLeft < 10 && isActive ? 'text-red-500 animate-pulse' : 'text-white transition-colors duration-500'}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                {/* Control Panel */}
                <div className="w-full max-w-xl flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="flex items-center gap-4">
                        {!isActive ? (
                            <button
                                onClick={handleStart}
                                className="flex-1 h-20 md:h-24 bg-white text-black hover:bg-zinc-200 rounded-3xl md:rounded-[2rem] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <Play className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                                <span className="font-black uppercase tracking-[0.2em] text-sm md:text-base">Start Sequence</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleStop}
                                className="flex-1 h-20 md:h-24 bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800 rounded-3xl md:rounded-[2rem] flex items-center justify-center gap-4 transition-all active:scale-95 group"
                            >
                                <Pause className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                                <span className="font-black uppercase tracking-[0.2em] text-sm md:text-base">Halt Protocol</span>
                            </button>
                        )}

                        <button
                            onClick={handleReset}
                            className="w-20 h-20 md:w-24 md:h-24 bg-zinc-900/50 border border-white/5 hover:border-white/20 rounded-3xl md:rounded-[2rem] flex items-center justify-center transition-all active:scale-90 group"
                            title="Reset Timer"
                        >
                            <RotateCcw className="w-6 h-6 md:w-8 md:h-8 text-zinc-500 group-hover:text-white group-hover:rotate-180 transition-all duration-700" />
                        </button>
                    </div>

                    {/* Interaction Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Time Input */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Adjust Duration</span>
                                <button
                                    onClick={handleUpdate}
                                    className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    Apply Changes
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-2 flex items-center gap-2 group focus-within:border-indigo-500/30 transition-colors">
                                    <input
                                        type="number"
                                        value={inputMinutes}
                                        onChange={(e) => setInputMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full bg-transparent text-center font-mono text-2xl font-bold focus:outline-none placeholder-zinc-800"
                                        placeholder="00"
                                    />
                                    <span className="text-[10px] font-bold text-zinc-700 uppercase">Min</span>
                                </div>
                                <div className="text-zinc-800 font-bold">:</div>
                                <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-2 flex items-center gap-2 group focus-within:border-indigo-500/30 transition-colors">
                                    <input
                                        type="number"
                                        value={inputSeconds}
                                        onChange={(e) => setInputSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                                        className="w-full bg-transparent text-center font-mono text-2xl font-bold focus:outline-none placeholder-zinc-800"
                                        placeholder="00"
                                    />
                                    <span className="text-[10px] font-bold text-zinc-700 uppercase">Sec</span>
                                </div>
                            </div>
                        </div>

                        {/* Presets */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Quick Presets</span>
                            <div className="grid grid-cols-3 gap-2">
                                {quickSets.map((q) => (
                                    <button
                                        key={q.val}
                                        onClick={() => {
                                            const m = Math.floor(q.val / 60)
                                            const s = q.val % 60
                                            setInputMinutes(m)
                                            setInputSeconds(s)
                                            setMaxTime(q.val)
                                            setTimeLeft(q.val)
                                            setIsActive(false)
                                            setShowAlert(false)
                                            setHalfTimeReached(false)
                                        }}
                                        className={`py-3 rounded-xl text-[11px] font-black uppercase tracking-tighter transition-all relative overflow-hidden active:scale-95 ${timeLeft === q.val ? 'bg-indigo-600 text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                                    >
                                        {q.label}
                                    </button>
                                ))}
                                <div className="flex items-center justify-center p-2 opacity-50 grayscale">
                                    <div className="w-1 h-1 rounded-full bg-white mx-0.5" />
                                    <div className="w-1 h-1 rounded-full bg-white mx-0.5" />
                                    <div className="w-1 h-1 rounded-full bg-white mx-0.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Big Red Alert Overlay */}
            {showAlert && (
                <div className="fixed inset-0 z-[999] bg-red-600 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
                    {/* Visual Warning Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden flex flex-col rotate-12 scale-150">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="whitespace-nowrap font-black text-6xl md:text-9xl tracking-tighter text-white">
                                WARNING TERMINATE WARNING TERMINATE WARNING TERMINATE WARNING TERMINATE WARNING TERMINATE WARNING TERMINATE
                            </div>
                        ))}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />

                    <div className="relative z-10 flex flex-col items-center gap-12 text-center max-w-lg">
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-[8px] md:border-[12px] border-white flex items-center justify-center animate-pulse shadow-[0_0_80px_rgba(255,255,255,0.4)]">
                            <AlertCircle className="w-16 h-16 md:w-24 md:h-24 text-white" strokeWidth={2.5} />
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-7xl md:text-9xl font-black tracking-tight text-white uppercase italic leading-[0.85] drop-shadow-2xl">
                                TIME IS<br /><span className="text-white">UP</span>
                            </h2>
                            <p className="text-base md:text-xl font-bold text-white/90 uppercase tracking-[0.6em] animate-pulse">
                                Immediate_Cessation_Required
                            </p>
                        </div>

                        <button
                            onClick={() => setShowAlert(false)}
                            className="group mt-8 w-24 h-24 bg-white text-red-600 hover:scale-110 active:scale-95 rounded-full flex items-center justify-center transition-all shadow-2xl relative"
                        >
                            <X className="w-10 h-10 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
                        </button>
                    </div>

                    {/* Atmospheric effects */}
                    <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150" />
                </div>
            )}

            <footer className="absolute bottom-12 flex flex-col items-center gap-2">
                <div className="w-8 h-px bg-zinc-800" />
                <p className="text-zinc-800 text-[9px] font-black uppercase tracking-[0.6em]">
                    Sathwa // Kaizen Protocol
                </p>
            </footer>
        </div>
    )
}
