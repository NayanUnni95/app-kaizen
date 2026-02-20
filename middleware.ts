import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    const isApiHackathonRoute = nextUrl.pathname.startsWith("/api/hackathon")
    const isPublicRoute = nextUrl.pathname === "/" || nextUrl.pathname === "/hackathon-login" || nextUrl.pathname === "/user"
    const isAuthRoute = nextUrl.pathname === "/hackathon-login" || nextUrl.pathname === "/user"

    // 1. Allow API Auth routes always
    if (isApiAuthRoute) return NextResponse.next()

    // 2. Handle Login Redirection
    if (isAuthRoute) {
        if (isLoggedIn) {
            // Redirect based on role if already logged in
            const role = (req.auth?.user as any)?.role
            if (role === 'ADMIN') return NextResponse.redirect(new URL("/admin", nextUrl))
            if (role === 'ORGANIZER') return NextResponse.redirect(new URL("/organizer", nextUrl))
            if (role === 'TEAM') return NextResponse.redirect(new URL("/team", nextUrl))
            return NextResponse.redirect(new URL("/", nextUrl))
        }
        return NextResponse.next()
    }

    // 3. Protected Routes
    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL("/hackathon-login", nextUrl))
    }

    // 4. Role Guards
    if (isLoggedIn) {
        const role = (req.auth?.user as any)?.role

        if (nextUrl.pathname.startsWith("/admin")) {
            if (role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", nextUrl))
            }
        }

        if (nextUrl.pathname.startsWith("/organizer")) {
            if (role !== "ORGANIZER" && role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", nextUrl))
            }
        }

        if (nextUrl.pathname.startsWith("/team")) {
            if (role !== "TEAM") {
                return NextResponse.redirect(new URL("/", nextUrl))
            }
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
