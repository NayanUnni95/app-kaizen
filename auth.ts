import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { sendLogToDiscord } from "@/lib/logger"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google,
        Credentials({
            name: "Team Login",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null

                const team = await prisma.team.findUnique({
                    where: { username: credentials.username as string },
                    include: { event: true }
                })

                if (!team || !team.passwordHash) return null

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    team.passwordHash
                )

                if (!isPasswordValid) return null

                // Return a user-like object for the session
                return {
                    id: team.id,
                    name: team.name,
                    email: team.email,
                    role: UserRole.TEAM,
                    teamId: team.id,
                    eventId: team.eventId
                }
            }
        })
    ],
    session: {
        strategy: "jwt", // Required for Credentials provider
    },
    pages: {
        signIn: "/user",
    },
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
        }
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
                token.teamId = (user as any).teamId || null
                token.eventId = (user as any).eventId || null
            } else if (!token.id && token.sub) {
                // Ensure token.id is always set (fallback to token.sub for OAuth users)
                token.id = token.sub
            }
            if (token.sub && !token.role) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.sub },
                    select: { role: true, id: true }
                })
                if (dbUser) {
                    token.role = dbUser.role
                }
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = (token.id as string) || token.sub || "";
                (session.user as any).role = token.role;
                (session.user as any).teamId = token.teamId;
                (session.user as any).eventId = token.eventId;
            }
            return session
        },
    },
})
