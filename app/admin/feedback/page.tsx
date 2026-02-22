import { prisma } from "@/lib/prisma"
import { FeedbackList } from "@/components/FeedbackList"
import { MessageSquare } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminFeedbackPage() {
    const feedbackList = await prisma.appFeedback.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-indigo-400">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">System Protocol</span>
                </div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Feedback Terminal</h1>
                <p className="text-zinc-500 text-sm font-medium max-w-2xl">
                    Monitor user experiences, bug reports, and suggestions from the field agents.
                </p>
            </div>

            <FeedbackList feedbackList={feedbackList} />
        </div>
    )
}
