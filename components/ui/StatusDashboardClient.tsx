"use client"

import { useState, useEffect, useMemo } from "react"
import { Clock, Users, Timer, Laptop, ChevronRight, User } from "lucide-react"

interface Member {
    id: string
    name: string
    role: string
}

interface Team {
    id: string
    name: string
    members: Member[]
}

export function StatusDashboardClient({ initialTeams }: { initialTeams: Team[] }) {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [activeTeamIndex, setActiveTeamIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    // Hackathon Window: Feb 21 10:00 AM IST - Feb 22 10:00 AM IST
    const startsAt = useMemo(() => new Date("2026-02-21T10:00:00+05:30"), [])
    const endsAt = useMemo(() => new Date("2026-02-22T10:00:00+05:30"), [])

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (initialTeams.length === 0) return

        const interval = setInterval(() => {
            setIsVisible(false)
            setTimeout(() => {
                setActiveTeamIndex((prev) => (prev + 1) % initialTeams.length)
                setIsVisible(true)
            }, 800)
        }, 8000)

        return () => clearInterval(interval)
    }, [initialTeams.length])

    // Progress Calculation
    const progressPct = useMemo(() => {
        const total = endsAt.getTime() - startsAt.getTime()
        const elapsed = currentTime.getTime() - startsAt.getTime()
        const pct = Math.round((elapsed / total) * 1000) / 10 // One decimal place for premium feel
        return Math.max(0, Math.min(100, pct))
    }, [currentTime, startsAt, endsAt])

    // Analog Clock Degrees
    const seconds = currentTime.getSeconds()
    const minutes = currentTime.getMinutes()
    const hours = currentTime.getHours() % 12
    const secondDegrees = (seconds / 60) * 360
    const minuteDegrees = ((minutes + seconds / 60) / 60) * 360
    const hourDegrees = ((hours + minutes / 60) / 12) * 360

    // Countdown
    const t = useMemo(() => {
        const total = endsAt.getTime() - currentTime.getTime()
        const secs = Math.floor((total / 1000) % 60)
        const mins = Math.floor((total / 1000 / 60) % 60)
        const hrs = Math.floor((total / (1000 * 60 * 60)) % 24)
        return {
            total,
            hours: hrs < 0 ? 0 : hrs,
            minutes: mins < 0 ? 0 : mins,
            seconds: secs < 0 ? 0 : secs
        }
    }, [currentTime, endsAt])

    const currentTeam = initialTeams[activeTeamIndex]

    return (
        <div className="h-screen bg-[#020203] text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)]" />

            <div className="relative z-10 px-8 py-6 h-full flex flex-col gap-6 max-w-[1700px] mx-auto">
                {/* Header Section - More Compact */}
                <header className="flex items-center justify-between py-2 border-b border-white/5">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <Laptop className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-indigo-400/80">Innovation in Motion</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tightest uppercase italic leading-none">
                            KAIZEN <span className="text-white/20">STATUS</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] mb-1">Event Runtime</span>
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-black font-mono tracking-tighter tabular-nums">{progressPct}%</span>
                                <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden">
                    {/* Left & Time Section (Cols 1-7) - Expanded */}
                    <div className="lg:col-span-7 space-y-12 flex flex-col justify-center">
                        <div className="flex flex-col xl:flex-row items-center gap-10">
                            {/* Larger Analog Clock */}
                            <div className="relative shrink-0">
                                <div className="absolute -inset-12 bg-indigo-500/[0.04] blur-[80px] rounded-full" />
                                <svg width="320" height="320" viewBox="0 0 220 220" className="relative z-10 drop-shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                                    <circle cx="110" cy="110" r="105" fill="#050507" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                                    {[...Array(12)].map((_, i) => (
                                        <line
                                            key={i}
                                            x1="110" y1="15" x2="110" y2="24"
                                            transform={`rotate(${i * 30}, 110, 110)`}
                                            stroke={i % 3 === 0 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)"}
                                            strokeWidth={i % 3 === 0 ? "3" : "1.5"}
                                            strokeLinecap="round"
                                        />
                                    ))}

                                    {/* Hour Hand */}
                                    <line
                                        x1="110" y1="110" x2="110" y2="65"
                                        transform={`rotate(${hourDegrees}, 110, 110)`}
                                        stroke="white"
                                        strokeWidth="5"
                                        strokeLinecap="round"
                                        className="transition-transform duration-1000 ease-in-out"
                                    />

                                    {/* Minute Hand */}
                                    <line
                                        x1="110" y1="110" x2="110" y2="45"
                                        transform={`rotate(${minuteDegrees}, 110, 110)`}
                                        stroke="rgba(255,255,255,0.5)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        className="transition-transform duration-1000 ease-in-out"
                                    />

                                    {/* Second Hand */}
                                    <g transform={`rotate(${secondDegrees}, 110, 110)`}>
                                        <line x1="110" y1="120" x2="110" y2="30" stroke="#6366F1" strokeWidth="1.5" />
                                        <circle cx="110" cy="110" r="3" fill="#6366F1" />
                                    </g>
                                </svg>
                            </div>

                            <div className="space-y-12 flex-1">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Clock className="w-4 h-4 text-white/20" />
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em]">Current Time</span>
                                    </div>
                                    <div className="text-7xl font-black font-mono tracking-tighter text-white/95 leading-none">
                                        {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <Timer className="w-4 h-4 text-indigo-400/60" />
                                        <span className="text-[10px] font-bold text-indigo-400/60 uppercase tracking-[0.5em]">Time Remaining</span>
                                    </div>
                                    <div className="flex flex-wrap gap-10">
                                        {[
                                            { val: t.hours, label: 'HRS' },
                                            { val: t.minutes, label: 'MIN' },
                                            { val: t.seconds, label: 'SEC' }
                                        ].map((unit, i) => (
                                            <div key={i} className="flex flex-col min-w-[100px]">
                                                <span className="text-8xl font-black tracking-tighter tabular-nums text-indigo-500 leading-none">
                                                    {unit.val.toString().padStart(2, '0')}
                                                </span>
                                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em] mt-3">{unit.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">
                                        Deadline: 10:00 AMIST, Feb 22
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Spotlight Section (Cols 8-12) - Narrower */}
                    <div className="lg:col-span-5 flex items-center h-full py-4">
                        <div className={`w-full h-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isVisible ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-[0.98] blur-xl translate-y-4'}`}>
                            {currentTeam ? (
                                <div className="relative group h-full">
                                    <div className="relative z-10 bg-white/[0.02] border border-white/10 rounded-[2.5rem] px-10 py-8 backdrop-blur-3xl overflow-hidden h-full flex flex-col gap-6 shadow-2xl">
                                        {/* Card Header */}
                                        <div className="flex items-start justify-between shrink-0">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Users className="w-3 h-3 text-indigo-400" />
                                                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-[0.4em]">Featured Team</span>
                                                </div>
                                                <h2 className="text-5xl font-black tracking-tighter uppercase leading-none truncate max-w-xl">
                                                    {currentTeam.name}
                                                </h2>
                                            </div>
                                            <div className="hidden md:flex flex-col items-end">
                                                <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] mb-1">Display</span>
                                                <span className="text-3xl font-black font-mono text-white/10">
                                                    {(activeTeamIndex + 1).toString().padStart(2, '0')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Members Grid - More Compact Scrollable if needed */}
                                        <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {currentTeam.members.map((member, idx) => (
                                                    <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group/member">
                                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-white/40 font-mono text-xs group-hover/member:bg-indigo-500 group-hover/member:text-white transition-colors">
                                                            {idx + 1}
                                                        </div>
                                                        <div className="space-y-0.5 truncate">
                                                            <div className="text-sm font-bold uppercase tracking-tight text-white/90 truncate">{member.name}</div>
                                                            <div className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">{member.role || "Team Member"}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {currentTeam.members.length === 0 && (
                                                    <div className="col-span-full py-10 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl text-white/20">
                                                        <User className="w-6 h-6 mb-3 stroke-1" />
                                                        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">No registered members</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Footer Area inside Card */}
                                        <div className="shrink-0 flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex gap-1.5">
                                                {initialTeams.slice(0, 10).map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`h-1 rounded-full transition-all duration-700 ${idx === activeTeamIndex ? 'w-6 bg-indigo-500' : 'w-1.5 bg-white/10'}`}
                                                    />
                                                ))}
                                                {initialTeams.length > 10 && <span className="text-[8px] text-white/20 font-bold">...</span>}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                                <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.3em]">System Rotation Active</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Background Glow */}
                                    <div className="absolute -inset-4 bg-indigo-500/5 blur-[80px] rounded-full -z-10" />
                                </div>
                            ) : (
                                <div className="w-full h-full rounded-[2.5rem] border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center gap-6 text-white/20">
                                    <Users className="w-10 h-10 stroke-1" />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.3em]">No teams found</span>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <footer className="shrink-0 flex items-center justify-between py-2 text-white/20 border-t border-white/5">
                    <div className="flex items-center gap-4">
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Official Status Dashboard</span>
                        <div className="w-4 h-[1px] bg-white/10" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Control Node Active</span>
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.4em]">
                        POWERED BY <span className="text-white/40">KAIZEN 26 Team</span>
                    </div>
                </footer>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
                
                :root {
                    --font-heading: 'Space Grotesk', sans-serif;
                }

                .font-heading {
                    font-family: var(--font-heading);
                }

                body {
                    background-color: #020203;
                    margin: 0;
                    letter-spacing: -0.02em;
                    overflow: hidden;
                }

                ::-webkit-scrollbar {
                    width: 0px;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.2);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    )
}
