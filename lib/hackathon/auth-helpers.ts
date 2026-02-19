import { auth } from "@/auth"
import { UserRole } from "@prisma/client"
import { redirect } from "next/navigation"

export async function getSession() {
    return await auth()
}

export async function getCurrentUser() {
    const session = await getSession()
    return session?.user
}

export async function isAdmin() {
    const user = await getCurrentUser()
    return user?.role === UserRole.ADMIN || (user as any)?.isAdmin === true
}

export async function isOrganizer() {
    const user = await getCurrentUser()
    return user?.role === UserRole.ORGANIZER || user?.role === UserRole.ADMIN || (user as any)?.isAdmin === true
}

export async function isTeam() {
    const user = await getCurrentUser()
    return user?.role === UserRole.TEAM
}

export async function getTeamId() {
    const user = await getCurrentUser()
    return (user as any)?.teamId as string | undefined
}

export async function getEventId() {
    const user = await getCurrentUser()
    return (user as any)?.eventId as string | undefined
}

/**
 * Server-side protection helper for use in Server Components or Server Actions.
 */
export async function protect(roles?: UserRole[]) {
    const session = await auth()
    if (!session) redirect("/hackathon-login")

    if (roles && roles.length > 0) {
        const userRole = (session.user as any).role as UserRole
        if (!roles.includes(userRole)) {
            redirect("/")
        }
    }

    return session
}
