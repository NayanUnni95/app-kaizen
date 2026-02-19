import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { sendLogToDiscord } from "@/lib/logger"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Google],
    trustHost: true,
    debug: false,
    logger: {
        error(error) {
            const errorData = {
                message: error.message,
                code: (error as any).code,
                name: error.name,
                cause: (error as any).cause?.err?.message || (error as any).cause || "Unknown cause",
            }
            sendLogToDiscord(error.name || "AuthError", errorData)
            console.error(error)
        },
        warn(code) {
            console.warn(code)
        },
        debug(code, ...message) {
            console.debug(code, ...message)
        }
    },
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id
                // Will be extended with role and teamId for hackathon platform
            }
            return session
        },
    },
})
