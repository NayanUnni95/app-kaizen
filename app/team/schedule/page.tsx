import { MapPin, Calendar, Sparkles, Clock, Activity, Zap, ChevronRight, Terminal } from "lucide-react"

export default async function TeamSchedulePage() {
    // Dummy Data for the reference feel
    const scheduleItems = [
        { id: '1', time: '15:00', name: 'Hackathon Genesis', venue: 'Alpha Sector - Main Hall', startsAt: '2026-02-20T15:00:00', endsAt: '2026-02-20T16:00:00', tag: 'Kick-off' },
        { id: '2', time: '17:30', name: 'Strategic Keynote: Future Systems', venue: 'Executive Auditorium', startsAt: '2026-02-20T17:30:00', endsAt: '2026-02-20T18:30:00', tag: 'Alpha' },
        { id: '3', time: '18:30', name: 'Operational Sync & Pulse', venue: 'Open Bridge Stage', startsAt: '2026-02-20T18:30:00', endsAt: '2026-02-20T20:00:00', tag: 'Networking' },
        { id: '4', time: '21:00', name: 'Logistics: Resource Refuel', venue: 'Dining Sector', startsAt: '2026-02-20T21:00:00', endsAt: '2026-02-20T22:30:00', tag: 'Energy' },
        { id: '5', time: '23:00', name: 'Hacking Shift Alpha', venue: 'Core Computing Arena', startsAt: '2026-02-20T23:00:00', endsAt: '2026-02-21T03:00:00', tag: 'Live' },
    ]

    const now = new Date()

    return (
        <div className="max-w-4xl mx-auto pb-32 pt-12 px-4 sm:px-6 kz-mesh-bg min-h-screen">
            {/* ─── Schedule Header ─────────────────────── */}
            <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 kz-animate-fade-in group">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white ring-8 ring-slate-50 group-hover:rotate-12 transition-transform duration-500">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tighter leading-none">Schedule</h1>
                            <span className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mt-2">Plan your day and stay on track</span>
                        </div>
                    </div>
                    <p className="text-slate-500 text-lg font-semibold max-w-sm leading-tight">
                        View the complete timeline of sessions and key event updates.
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em]">Live Timeline</span>
                </div>
            </header>

            {/* ─── High-Density Timeline Stream ──────────────────── */}
            <div className="relative">
                {/* The Telemetry "Stick" */}
                <div className="absolute left-[1.125rem] md:left-[1.375rem] top-4 bottom-4 w-[2px] bg-white/5 rounded-full" />

                <div className="space-y-12">
                    {scheduleItems.map((item, i) => {
                        const starts = new Date(item.startsAt)
                        const ends = new Date(item.endsAt)
                        const isNow = now >= starts && now <= ends
                        const isPast = now > ends

                        return (
                            <div
                                key={item.id}
                                className={`relative flex group kz-animate-slide-up ${isPast ? 'opacity-40 grayscale-[0.5]' : ''}`}
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                {/* Digital Marker */}
                                <div className="absolute left-0 top-8 -translate-x-1/2 z-10 flex items-center justify-center">
                                    <div className={`
                                        w-6 h-6 rounded-full border-2 transition-all duration-700 flex items-center justify-center
                                        ${isNow
                                            ? 'bg-indigo-600 border-indigo-400 ring-8 ring-indigo-500/10 scale-125 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                                            : isPast
                                                ? 'bg-slate-800 border-slate-700 ring-4 ring-white/5'
                                                : 'bg-slate-900 border-slate-800 ring-4 ring-white/5 group-hover:border-indigo-500/50'}
                                    `}>
                                        {isNow && <Zap className="w-2.5 h-2.5 text-white animate-pulse" />}
                                    </div>
                                </div>

                                {/* Event Feed Card */}
                                <div className="ml-14 md:ml-20 flex-1">
                                    <div className={`
                                        kz-card-rich p-5 sm:p-8 transition-all duration-700 group-hover:scale-[1.01]
                                        ${isNow
                                            ? 'bg-indigo-600/10 border-indigo-500/30 ring-1 ring-indigo-500/20'
                                            : 'bg-white/5 border-white/5'}
                                    `}>
                                        <div className="flex flex-col gap-5 sm:gap-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-2">
                                                    {/* Segment Time */}
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Clock className={`w-3.5 h-3.5 ${isNow ? 'text-blue-400' : 'text-slate-400'}`} />
                                                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${isNow ? 'text-blue-400' : 'text-slate-400'}`}>
                                                            {item.time} <span className="mx-1 opacity-50">-</span> {ends.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                        </span>
                                                    </div>

                                                    {/* Phase Name */}
                                                    <h3 className={`font-heading font-black text-xl sm:text-2xl md:text-3xl tracking-tighter leading-tight ${isNow ? 'text-white' : 'text-slate-100'}`}>
                                                        {item.name}
                                                    </h3>
                                                </div>

                                                {/* Meta Tag */}
                                                <div className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${isNow ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'bg-white/5 text-slate-400 border border-white/5'}`}>
                                                    {item.tag}
                                                </div>
                                            </div>

                                            {/* Venue & Status */}
                                            <div className="flex flex-col lg:flex-row flex-wrap items-start lg:items-center gap-4 sm:gap-6 pt-6 border-t border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isNow ? 'bg-indigo-600/20' : 'bg-white/5'}`}>
                                                        <MapPin className={`w-4 h-4 ${isNow ? 'text-indigo-400' : 'text-slate-500'}`} />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isNow ? 'text-indigo-400/60' : 'text-slate-500'}`}>Venue</span>
                                                        <span className={`text-[11px] font-bold tracking-tight truncate ${isNow ? 'text-white' : 'text-slate-300'}`}>
                                                            {item.venue}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isNow ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
                                                        <Zap className={`w-4 h-4 ${isNow ? 'text-emerald-400' : 'text-slate-500'}`} />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isNow ? 'text-emerald-500/60' : 'text-slate-500'}`}>Status</span>
                                                        <span className={`text-[11px] font-bold tracking-tight ${isNow ? 'text-emerald-400' : isPast ? 'text-slate-500' : 'text-indigo-400'}`}>
                                                            {isNow ? 'Live' : isPast ? 'Past' : 'Upcoming'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Hints Removed */}
                                        </div>
                                    </div>
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
