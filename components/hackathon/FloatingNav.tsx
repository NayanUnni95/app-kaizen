"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Calendar,
    CheckSquare,
    Upload,
    Bell,
    User,
    LogOut,
    Menu,
    X
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"

interface NavItem {
    name: string
    href: string
    icon: any
}

interface FloatingNavProps {
    role: 'ADMIN' | 'ORGANIZER' | 'TEAM'
}

export function FloatingNav({ role }: FloatingNavProps) {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const adminItems: NavItem[] = [
        { name: "Dash", href: "/admin", icon: LayoutDashboard },
        { name: "Teams", href: "/admin/teams", icon: Users },
        { name: "Events", href: "/admin/events", icon: Calendar },
        { name: "Miles", href: "/admin/checkpoints", icon: CheckSquare },
        { name: "Subs", href: "/admin/submissions", icon: Upload },
        { name: "Alerts", href: "/admin/notifications", icon: Bell },
    ]

    const organizerItems: NavItem[] = [
        { name: "Dash", href: "/organizer", icon: LayoutDashboard },
        { name: "Events", href: "/organizer/events", icon: Calendar },
        { name: "Miles", href: "/organizer/checkpoints", icon: CheckSquare },
        { name: "Alerts", href: "/organizer/notifications", icon: Bell },
    ]

    const teamItems: NavItem[] = [
        { name: "Home", href: "/team", icon: LayoutDashboard },
        { name: "Miles", href: "/team/checkpoints", icon: CheckSquare },
        { name: "Sched", href: "/team/schedule", icon: Calendar },
        { name: "Alerts", href: "/team/notifications", icon: Bell },
        { name: "Me", href: "/team/profile", icon: User },
    ]

    const navItems = role === 'ADMIN' ? adminItems : role === 'ORGANIZER' ? organizerItems : teamItems

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-fit px-4">
            <nav className={`
                flex items-center gap-1 p-2 rounded-full border border-white/10 shadow-2xl transition-all duration-300
                ${scrolled ? 'bg-black/60 backdrop-blur-2xl scale-95' : 'bg-zinc-900/80 backdrop-blur-xl'}
            `}>
                {navItems.map((item) => {
                    const isActive = item.href === `/${role.toLowerCase()}`
                        ? pathname === item.href
                        : pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                relative flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 group
                                ${isActive
                                    ? "bg-white text-black font-black"
                                    : "text-zinc-500 hover:text-white"}
                            `}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                            {isActive && (
                                <span className="text-xs uppercase tracking-tighter hidden md:block">
                                    {item.name}
                                </span>
                            )}

                            {/* Hover Tooltip (Mobile/Inactive) */}
                            {!isActive && (
                                <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/5 whitespace-nowrap">
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    )
                })}

                <div className="w-px h-6 bg-white/10 mx-2" />

                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="p-3 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all group relative"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Exit
                    </span>
                </button>
            </nav>
        </div>
    )
}
