"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface NavItem {
    name: string
    href: string
    icon: React.ElementType
}

/**
 * FloatingNav — generic bottom floating navigation.
 * Pass `items` to customize nav links per role/layout.
 * Defaults to just Home if no items are passed.
 */
export function FloatingNav({
    items,
}: {
    items?: NavItem[]
}) {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [pendingPath, setPendingPath] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        setIsPending(false)
        setPendingPath(null)
    }, [pathname])

    if (!mounted) return null

    const navItems: NavItem[] = items ?? [
        { name: 'Home', href: '/', icon: Home },
    ]

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto">
            <nav className="flex items-center gap-1 p-1.5 bg-zinc-900/90 backdrop-blur-xl rounded-[28px] border border-zinc-800 shadow-[0_15px_30px_rgba(0,0,0,0.3)]">
                {navItems.map((item) => {
                    const isActive = item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href)
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => {
                                if (pathname !== item.href) {
                                    setIsPending(true)
                                    setPendingPath(item.href)
                                }
                            }}
                            className={`
                                relative flex items-center justify-center w-[46px] h-[46px] rounded-full transition-all duration-300
                                ${isActive
                                    ? 'bg-white text-zinc-950 shadow-md scale-105'
                                    : 'text-zinc-400 hover:text-zinc-100'}
                                ${isPending && pendingPath === item.href ? 'opacity-80' : ''}
                            `}
                        >
                            {isPending && pendingPath === item.href ? (
                                <Loader2 className="w-[18px] h-[18px] animate-spin" />
                            ) : (
                                <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                            )}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
