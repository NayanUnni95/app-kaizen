// app/team/schedule/page.tsx
import { MapPin, Calendar, Sparkles } from "lucide-react"

export default async function TeamSchedulePage() {
    // Dummy Data for the reference feel
    const scheduleItems = [
        { id: '1', time: '3:00 PM', name: 'Hackathon Starts', venue: 'Main Hall', startsAt: '2026-02-20T15:00:00', endsAt: '2026-02-20T16:00:00' },
        { id: '2', time: '5:30 PM', name: 'Inauguration', venue: 'Auditorium', startsAt: '2026-02-20T17:30:00', endsAt: '2026-02-20T18:30:00' },
        { id: '3', time: '6:30 PM', name: 'Entertainment Session', venue: 'Open Stage', startsAt: '2026-02-20T18:30:00', endsAt: '2026-02-20T20:00:00' },
        { id: '4', time: '9:00 PM', name: 'Dinner', venue: 'Dining Hall', startsAt: '2026-02-20T21:00:00', endsAt: '2026-02-20T22:30:00' },
        { id: '5', time: '11:00 PM', name: 'Late Night Hacking', venue: 'Coding Arena', startsAt: '2026-02-20T23:00:00', endsAt: '2026-02-21T03:00:00' },
    ]

    const now = new Date()

    return (
        <div className="max-w-3xl mx-auto pb-20 pt-8 px-4">
            {/* Header */}
            <header className="mb-16 flex items-end justify-between px-2 kz-animate-fade-in">
                <div>
                    <h1 className="font-heading font-black text-5xl text-[#0F172A] tracking-tighter leading-none mb-4">Timeline</h1>
                    <p className="text-[#64748B] text-lg font-medium max-w-md">
                        The heartbeat of the event. Every milestone recorded in real-time.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Live Sync active</span>
                </div>
            </header>

            {/* Timeline Container */}
            <div className="relative">
                {/* The "Stick" (Vertical Line) */}
                <div className="absolute left-[1.125rem] top-2 bottom-2 w-[2px] bg-slate-100" />

                <div className="space-y-4">
                    {scheduleItems.map((item, i) => {
                        const starts = new Date(item.startsAt)
                        const ends = new Date(item.endsAt)
                        const isNow = now >= starts && now <= ends
                        const isPast = now > ends

                        return (
                            <div
                                key={item.id}
                                className="relative flex group kz-animate-slide-up"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {/* Circle on the Stick */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                                    <div className={`
                                        w-[2.25rem] h-[2.25rem] rounded-full border-4 bg-white flex items-center justify-center transition-all duration-500
                                        ${isNow
                                            ? 'border-black scale-110 shadow-lg shadow-black/10'
                                            : isPast ? 'border-slate-200' : 'border-slate-100'}
                                    `}>
                                        {isNow && <div className="w-2 h-2 rounded-full bg-black animate-pulse" />}
                                    </div>
                                </div>

                                {/* Event Card */}
                                <div className="ml-16 flex-1">
                                    <div className={`
                                        relative p-8 rounded-[2.5rem] border-2 transition-all duration-700
                                        ${isNow
                                            ? 'bg-black text-white border-black shadow-[0_30px_60px_rgba(0,0,0,0.15)] -translate-y-1'
                                            : 'bg-white text-slate-400 border-slate-50 hover:border-slate-200 hover:shadow-md'}
                                    `}>
                                        <div className="space-y-4">
                                            {/* Time */}
                                            <span className={`text-xs font-black uppercase tracking-[0.2em] ${isNow ? 'text-white/50' : 'text-slate-300'}`}>
                                                {item.time}
                                            </span>

                                            {/* Name */}
                                            <h3 className={`font-heading font-black text-3xl tracking-tighter leading-none ${isNow ? 'text-white' : 'text-black'}`}>
                                                {item.name}
                                            </h3>

                                            {/* Venue */}
                                            <div className="flex items-center gap-2">
                                                <MapPin className={`w-4 h-4 ${isNow ? 'text-white/40' : 'text-slate-300'}`} />
                                                <span className={`text-sm font-bold tracking-tight ${isNow ? 'text-white/60' : 'text-slate-400'}`}>
                                                    {item.venue}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Tag for Active */}
                                        {isNow && (
                                            <div className="absolute top-8 right-8 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Happening Now</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-20 text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">End of Transmission</p>
            </div>
        </div>
    )
}
