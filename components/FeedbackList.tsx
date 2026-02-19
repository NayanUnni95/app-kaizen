"use client"

import { useState } from "react"
import { Eye, X } from "lucide-react"

interface Feedback {
    id: string
    email: string
    description: string
    createdAt: Date
}

export function FeedbackList({ feedbackList }: { feedbackList: Feedback[] }) {
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    return (
        <>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {feedbackList.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No feedback submissions yet
                                    </td>
                                </tr>
                            ) : (
                                feedbackList.map((feedback) => (
                                    <tr key={feedback.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm">
                                            {feedback.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm max-w-md">
                                            <div className="truncate">
                                                {feedback.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(feedback.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => setSelectedFeedback(feedback)}
                                                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedFeedback && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in zoom-in duration-200">
                    <div className="relative w-full max-w-2xl rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
                        <button
                            onClick={() => setSelectedFeedback(null)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Feedback Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Email
                                </label>
                                <p className="text-base">{selectedFeedback.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Submitted On
                                </label>
                                <p className="text-base">{formatDate(selectedFeedback.createdAt)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Description
                                </label>
                                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-md p-4 border border-zinc-200 dark:border-zinc-700">
                                    <p className="text-base whitespace-pre-wrap">{selectedFeedback.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setSelectedFeedback(null)}
                                className="px-4 py-2 text-sm font-medium bg-black text-white dark:bg-white dark:text-black rounded-md hover:bg-black/90 dark:hover:bg-white/90 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
