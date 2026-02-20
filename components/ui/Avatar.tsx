"use client"

interface AvatarProps {
    name: string
    size?: "xs" | "sm" | "md" | "lg" | "xl"
    className?: string
}

const PASTEL_PALETTES = [
    { bg: "#DBEAFE", text: "#1D4ED8" }, // blue
    { bg: "#D1FAE5", text: "#065F46" }, // green
    { bg: "#FCE7F3", text: "#9D174D" }, // pink
    { bg: "#FEF3C7", text: "#92400E" }, // amber
    { bg: "#E0E7FF", text: "#3730A3" }, // indigo
    { bg: "#CFFAFE", text: "#155E75" }, // cyan
    { bg: "#FEE2E2", text: "#991B1B" }, // red
    { bg: "#F3E8FF", text: "#6B21A8" }, // purple
    { bg: "#DCFCE7", text: "#166534" }, // emerald
    { bg: "#FFF7ED", text: "#9A3412" }, // orange
]

function hashName(name: string): number {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = (hash << 5) - hash + name.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase()
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const SIZE_CLASSES = {
    xs: "w-6 h-6 text-[9px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
}

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
    const index = hashName(name) % PASTEL_PALETTES.length
    const palette = PASTEL_PALETTES[index]
    const initials = getInitials(name)

    return (
        <div
            className={`${SIZE_CLASSES[size]} rounded-2xl flex items-center justify-center font-bold flex-shrink-0 select-none ${className}`}
            style={{ backgroundColor: palette.bg, color: palette.text }}
            aria-label={name}
            role="img"
        >
            {initials}
        </div>
    )
}
