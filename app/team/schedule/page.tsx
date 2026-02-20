import { MapPin, Calendar, Sparkles, Clock, Activity, Zap, ChevronRight, Terminal } from "lucide-react"

export default async function TeamSchedulePage() {
    // Real schedule (IST) — no venue fields included, end times only where provided
    const scheduleItems = [
        // Day 1 — 21 Feb 2026
        { id: '1', time: '10:00 AM', name: 'Inauguration Ceremony', startsAt: '2026-02-21T10:00:00+05:30', tag: 'Opening' },
        { id: '2', time: '10:45 AM', name: 'Rules & Guidelines Briefing', startsAt: '2026-02-21T10:45:00+05:30', tag: 'Briefing' },
        { id: '3', time: '11:00 AM', name: 'HACKATHON BEGINS', startsAt: '2026-02-21T11:00:00+05:30', tag: 'Live' },
        { id: '4', time: '01:00 PM – 02:00 PM', name: 'Lunch Break', startsAt: '2026-02-21T13:00:00+05:30', endsAt: '2026-02-21T14:00:00+05:30', tag: 'Break' },
        { id: '5', time: '04:30 PM', name: 'Evening Refreshment', startsAt: '2026-02-21T16:30:00+05:30', tag: 'Refresh' },
        { id: '6', time: '06:00 PM', name: 'First Evaluation', startsAt: '2026-02-21T18:00:00+05:30', tag: 'Review' },
        { id: '7', time: '08:30 PM – 09:30 PM', name: 'Dinner & Entertainment', startsAt: '2026-02-21T20:30:00+05:30', endsAt: '2026-02-21T21:30:00+05:30', tag: 'Fun' },
        { id: '8', time: '09:30 PM onwards', name: 'Overnight Hack', startsAt: '2026-02-21T21:30:00+05:30', endsAt: '2026-02-22T09:00:00+05:30', tag: 'Overnight' },

        // Day 2 — 22 Feb 2026
        { id: '9', time: '06:00 AM', name: 'Second Evaluation', startsAt: '2026-02-22T06:00:00+05:30', tag: 'Review' },
        { id: '10', time: '09:00 AM', name: 'Breakfast & Tea', startsAt: '2026-02-22T09:00:00+05:30', tag: 'Refresh' },
        { id: '11', time: '10:30 AM', name: 'HACKATHON ENDS', startsAt: '2026-02-22T10:30:00+05:30', tag: 'Finish' },
        { id: '12', time: '10:30 AM – 02:00 PM', name: 'Project Presentations', startsAt: '2026-02-22T10:30:00+05:30', endsAt: '2026-02-22T14:00:00+05:30', tag: 'Demo' },
        { id: '13', time: '02:00 PM', name: 'Event Conclusion', startsAt: '2026-02-22T14:00:00+05:30', tag: 'Closing' },
    ]

    // IST-aligned "now"
    const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    )

    return (
        <div className="max-w-none mx-auto pb-32 pt-12 px-4 sm:px-6 kz-mesh-bg min-h-screen">
            {/* ─── Schedule Header ─────────────────────── */}
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 kz-animate-fade-in group">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-400">
                            <Calendar className="w-4.5 h-4.5" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tighter leading-none uppercase">Event Telemetry</h1>
                            <span className="text-[10px] font-mono-tech font-bold text-slate-500 uppercase tracking-widest mt-2">SYS_CLOCK: REAL_TIME_STATUS_MONITOR</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-mono-tech font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">LIVE_CONNECTION</span>
                </div>
            </header>

            {/* ─── High-Density Timeline Stream ──────────────────── */}
            <div className="relative">
                {/* The Telemetry "Stick" */}
                <div className="absolute left-[1.125rem] md:left-[1.375rem] top-4 bottom-4 w-[2px] bg-black/5 dark:bg-white/5 rounded-full" />

                <div className="space-y-24">
                    {/* Day Grouping Logic */}
                    {['2026-02-21', '2026-02-22'].map((day, dayIndex) => {
                        const dayItems = scheduleItems.filter(item => item.startsAt.startsWith(day))
                        const dayLabel = dayIndex === 0 ? "Day 1" : "Day 2"
                        const dayDate = dayIndex === 0 ? "21 Feb" : "22 Feb"

                        return (
                            <div key={day} className="space-y-12">
                                {/* Day Header */}
                                <div className="sticky top-20 z-20 flex items-center gap-4 bg-white/80 dark:bg-[#080808]/80 backdrop-blur-sm py-4 -mx-4 px-4">
                                    <div className="px-3 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm">
                                        <span className="text-[10px] lg:text-[13px] font-mono-tech font-bold text-slate-900 dark:text-white uppercase tracking-widest">{dayLabel}</span>
                                    </div>
                                    <div className="h-[1px] flex-1 bg-black/5 dark:bg-white/5" />
                                    <span className="text-[10px] lg:text-[14px] font-mono-tech font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{dayDate}_OP_WINDOW</span>
                                </div>

                                <div className="space-y-12">
                                    {dayItems.map((item, i) => {
                                        const starts = new Date(item.startsAt)
                                        const ends = item.endsAt ? new Date(item.endsAt) : null

                                        const isNow = ends
                                            ? now >= starts && now <= ends
                                            : now >= starts

                                        const isPast = ends
                                            ? now > ends
                                            : false

                                        return (
                                            <div
                                                key={item.id}
                                                className={`relative flex group kz-animate-slide-up ${isPast ? 'opacity-40 grayscale-[0.5]' : ''}`}
                                                style={{ animationDelay: `${i * 100}ms` }}
                                            >
                                                {/* Digital Marker */}
                                                <div className="absolute left-0 top-8 -translate-x-1/2 z-10 flex items-center justify-center">
                                                    <div className={`
                                                        w-5 h-5 rounded-full border-2 transition-all duration-700 flex items-center justify-center
                                                        ${isNow
                                                            ? 'bg-indigo-600 border-indigo-400 ring-4 ring-indigo-500/10 scale-110'
                                                            : isPast
                                                                ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                                                                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 group-hover:border-indigo-500/50'}
                                                    `}>
                                                        {isNow && <Zap className="w-2 h-2 text-white animate-pulse" />}
                                                    </div>
                                                </div>

                                                {/* Event Feed Card */}
                                                <div className="ml-14 md:ml-20 flex-1">
                                                    <div className={`
                                                        kz-card-rich p-5 sm:p-7 transition-all duration-700
                                                        ${isNow
                                                            ? 'bg-indigo-600/5 dark:bg-indigo-600/5 border-indigo-500/20'
                                                            : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'}
                                                    `}>
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <Clock className={`w-3.5 h-3.5 ${isNow ? 'text-indigo-400' : 'text-slate-500'}`} strokeWidth={1.5} />
                                                                        <span className={`text-[10px] lg:text-[13px] font-mono-tech font-bold uppercase tracking-widest ${isNow ? 'text-indigo-400' : 'text-slate-500'}`}>
                                                                            {item.time}
                                                                            {ends ? (
                                                                                <span className="mx-1 opacity-50"> {"->"} </span>
                                                                            ) : null}
                                                                            {ends ? ends.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true }) : null}
                                                                        </span>
                                                                    </div>

                                                                    <h3 className={`font-heading font-semibold text-lg sm:text-xl tracking-tight leading-tight ${isNow ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                                        {item.name}
                                                                    </h3>
                                                                </div>

                                                                <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${isNow ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent' : 'bg-black/5 dark:bg-white/5 text-slate-500 border-black/5 dark:border-white/5'}`}>
                                                                    {item.tag}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4 pt-4 border-t border-black/5 dark:border-white/5">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-1.5 h-1.5 rounded-full ${isNow ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isPast ? 'bg-slate-700' : 'bg-indigo-500/40'}`} />
                                                                    <span className={`text-[9px] font-mono-tech font-bold uppercase tracking-widest ${isNow ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                                        {isNow ? 'MISSION_LIVE' : isPast ? 'OP_CONCLUDED' : 'PENDING_DEPLOY'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ─── End of Schedule ────────────────────────────────── */}
            <div className="mt-24 text-center">
                <div className="inline-flex flex-col items-center gap-4">
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">You've reached the end</p>
                </div>
            </div>
        </div>
    )
}
