import { prisma } from "@/lib/prisma"
import { Calendar, Clock, MapPin, Zap } from "lucide-react"

export default async function TeamSchedulePage() {
    const events = await prisma.event.findMany({
        orderBy: { startsAt: 'asc' }
    })

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight">Timeline</h1>
                <p className="text-zinc-500 font-medium italic">Chronology of the hackathon event cycle.</p>
            </header>

            <div className="relative space-y-12">
                {/* Vertical Line */}
                <div className="absolute left-4 top-4 bottom-4 w-px bg-zinc-800" />

                {events.map((event, idx) => {
                    const starts = event.startsAt ? new Date(event.startsAt) : null
                    const isUpcoming = starts && starts > new Date()

                    return (
                        <div key={event.id} className="relative pl-12 group animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                            {/* Dot */}
                            <div className={`
                                absolute left-3 top-2 w-2.5 h-2.5 rounded-full border-2 border-black z-10 
                                ${isUpcoming ? 'bg-zinc-700' : 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]'}
                            `} />

                            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 transition-all hover:bg-zinc-900 shadow-xl">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ${isUpcoming ? 'text-zinc-600' : 'text-purple-500'}`}>
                                    {isUpcoming ? 'Scheduled' : 'Live Now'}
                                </span>
                                <h3 className="text-xl font-black mb-4">{event.name}</h3>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                        <div className="p-2 bg-zinc-800 rounded-lg">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <span>{starts ? starts.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'Date TBA'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                        <div className="p-2 bg-zinc-800 rounded-lg">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <span>{starts ? starts.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Time TBA'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                        <div className="p-2 bg-zinc-800 rounded-lg">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <span>Main Auditorium / Virtual</span>
                                    </div>
                                </div>

                                {event.description && (
                                    <p className="mt-6 text-zinc-500 text-sm leading-relaxed italic border-l-2 border-white/5 pl-4">
                                        {event.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    )
                })}

                {events.length === 0 && (
                    <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-white/5 rounded-3xl">
                        <Zap className="w-8 h-8 text-zinc-800 mx-auto mb-4" />
                        <p className="text-zinc-600 font-black italic uppercase tracking-widest">Event schedule is being finalized</p>
                    </div>
                )}
            </div>
        </div>
    )
}
