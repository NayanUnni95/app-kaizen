import { prisma } from "@/lib/prisma"
import { Calendar, Clock, MapPin, Zap } from "lucide-react"
import { EmptyState } from "@/components/ui/EmptyState"

export default async function TeamSchedulePage() {
    const events = await prisma.event.findMany({
        orderBy: { startsAt: 'asc' }
    })

    const now = new Date()

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <header className="kz-animate-fade-in">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#0F172A]">Schedule</h1>
                <p className="text-[#64748B] text-sm mt-1">Hackathon timeline — all key events</p>
            </header>

            {events.length === 0 ? (
                <div className="kz-animate-slide-up">
                    <EmptyState
                        icon={Calendar}
                        title="Schedule not published"
                        description="The full hackathon schedule will appear here once finalized. Check back soon!"
                    />
                </div>
            ) : (
                /* Vertical timeline */
                <div className="relative kz-animate-slide-up">
                    {/* Left timeline line */}
                    <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-[#E6E9EE]" />

                    <div className="space-y-4">
                        {events.map((event, idx) => {
                            const starts = event.startsAt ? new Date(event.startsAt) : null
                            const ends = event.endsAt ? new Date(event.endsAt) : null
                            const isNow = starts && ends
                                ? (now >= starts && now <= ends)
                                : (starts ? Math.abs(now.getTime() - starts.getTime()) < 3600000 : false)
                            const isPast = starts ? starts < now : false
                            const isNext = !isNow && !isPast

                            return (
                                <div
                                    key={event.id}
                                    className="relative flex gap-5 items-start pl-1 kz-animate-slide-up"
                                    style={{ animationDelay: `${idx * 0.07}s` }}
                                >
                                    {/* Timeline dot */}
                                    <div className="flex-shrink-0 mt-4 relative z-10">
                                        <div className={`
                                            w-10 h-10 rounded-xl flex items-center justify-center border-2
                                            ${isNow
                                                ? "bg-[#2563EB] border-[#2563EB] shadow-lg shadow-[#2563EB]/30"
                                                : isPast
                                                    ? "bg-[#D1FAE5] border-[#A7F3D0]"
                                                    : "bg-white border-[#E6E9EE]"
                                            }
                                        `}>
                                            {isNow ? (
                                                <Zap className="w-4 h-4 text-white" />
                                            ) : isPast ? (
                                                <Calendar className="w-4 h-4 text-[#16A34A]" />
                                            ) : (
                                                <Calendar className="w-4 h-4 text-[#94A3B8]" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Card */}
                                    <div className={`
                                        flex-1 kz-card p-4 sm:p-5
                                        ${isNow ? "border-[#BFDBFE] bg-[#EFF6FF]" : ""}
                                        ${isPast ? "opacity-70" : ""}
                                    `}>
                                        {/* Status + time row */}
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            {isNow && (
                                                <span className="kz-badge bg-[#2563EB] text-white text-[10px]">
                                                    🔴 Live Now
                                                </span>
                                            )}
                                            {isPast && !isNow && (
                                                <span className="kz-badge bg-[#D1FAE5] text-[#065F46] text-[10px]">
                                                    Completed
                                                </span>
                                            )}
                                            {isNext && (
                                                <span className="kz-badge bg-[#F8FAFC] text-[#64748B] text-[10px] border border-[#E6E9EE]">
                                                    Upcoming
                                                </span>
                                            )}
                                            {starts && (
                                                <span className="text-xs font-bold text-[#2563EB]">
                                                    {starts.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-heading font-semibold text-base text-[#0F172A] mb-3">
                                            {event.name}
                                        </h3>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-[#64748B]">
                                                <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-[#94A3B8]" />
                                                <span>
                                                    {starts
                                                        ? starts.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                                                        : "Date TBA"
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[#64748B]">
                                                <Clock className="w-3.5 h-3.5 flex-shrink-0 text-[#94A3B8]" />
                                                <span>
                                                    {starts
                                                        ? starts.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                                        : "Time TBA"
                                                    }
                                                    {ends && ` — ${ends.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[#64748B]">
                                                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#94A3B8]" />
                                                <span>Main Hall / Virtual</span>
                                            </div>
                                        </div>

                                        {event.description && (
                                            <p className="mt-3 text-sm text-[#64748B] leading-relaxed border-l-2 border-[#BFDBFE] pl-3">
                                                {event.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
