"use client"

import { useEffect, useMemo, useState } from "react"

interface CountdownTimerProps {
    startsAt?: Date | string | null
    endsAt?: Date | string | null
}

function pad(n: number) {
    return n.toString().padStart(2, "0")
}

export function CountdownTimer({ startsAt, endsAt }: CountdownTimerProps) {
    const start = useMemo(
        () => (startsAt ? new Date(startsAt) : null),
        [startsAt]
    )

    const end = useMemo(
        () => (endsAt ? new Date(endsAt) : null),
        [endsAt]
    )

    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })
    const [progress, setProgress] = useState(0)
    const [ended, setEnded] = useState(false)

    useEffect(() => {
        if (!end) return

        const endTime = end.getTime()
        const startTime = start?.getTime()

        const calc = () => {
            const now = Date.now()
            const diff = endTime - now

            if (diff <= 0) {
                setEnded(true)
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 })
                setProgress(100)
                return
            }

            if (startTime) {
                const totalMs = endTime - startTime
                const elapsed = now - startTime
                const percent = (elapsed / totalMs) * 100
                setProgress(Math.min(100, Math.max(0, percent)))
            }

            const d = Math.floor(diff / 86400000)
            const h = Math.floor((diff % 86400000) / 3600000)
            const m = Math.floor((diff % 3600000) / 60000)
            const s = Math.floor((diff % 60000) / 1000)

            setTimeLeft({ d, h, m, s })
        }

        calc()
        const id = setInterval(calc, 1000)

        return () => clearInterval(id)
    }, [start, end])

    if (!end) return <div>Timer not set</div>

    return (
        <div>
            {ended
                ? "Ended"
                : `${pad(timeLeft.d)}d ${pad(timeLeft.h)}h ${pad(
                    timeLeft.m
                )}m ${pad(timeLeft.s)}s`}
            <div>{Math.round(progress)}%</div>
        </div>
    )
}
