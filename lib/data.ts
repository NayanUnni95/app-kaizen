import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

// Cache tag constants — extend as needed for hackathon models
export const CACHE_TAGS = {
    USER: (userId: string) => `user-${userId}`,
    ALL_USERS: 'all-users',
}

/**
 * Fetch a single user by ID (cached, 1 hour).
 */
export async function getCachedUser(userId: string) {
    if (!userId) return null
    const cachedFn = unstable_cache(
        async () => {
            return await prisma.user.findUnique({
                where: { id: userId },
            })
        },
        [`user-${userId}`],
        {
            tags: [CACHE_TAGS.USER(userId)],
            revalidate: 3600,
        }
    )
    return cachedFn()
}

/**
 * Fetch all users (cached, 1 hour). Used by admin.
 */
export const getAllUsersCached = unstable_cache(
    async () => {
        return await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
            }
        })
    },
    ['all-users-list'],
    {
        tags: [CACHE_TAGS.ALL_USERS],
        revalidate: 3600,
    }
)
