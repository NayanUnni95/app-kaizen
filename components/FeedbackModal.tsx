"use client"

import { useState } from "react"
import { MessageSquarePlus, X } from "lucide-react"
import { toast } from "sonner"

export function FeedbackModal({ children }: { children?: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, description }),
            })
            if (!res.ok) throw new Error("Failed")
            toast.success("Feedback submitted successfully!")
            setIsOpen(false)
            setEmail("")
            setDescription("")
        } catch (error) {
            toast.error("Failed to submit feedback")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {children ? (
                <div onClick={() => setIsOpen(true)} className="cursor-pointer w-full h-full">
                    {children}
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 bg-black text-white dark:bg-white dark:text-black"
                >
                    <MessageSquarePlus className="h-5 w-5" />
                    <span className="font-medium">Connect / Support</span>
                </button>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in zoom-in duration-200">
                    <div className="relative w-full max-w-md rounded-lg bg-background p-6 shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Connect with us</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Have a question, feedback, or facing an issue? Let us know below.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-transparent border-zinc-300 dark:border-zinc-700"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium mb-1">
                                    Description / Issue
                                </label>
                                <textarea
                                    id="description"
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-transparent border-zinc-300 dark:border-zinc-700"
                                    placeholder="Tell us what's on your mind..."
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium bg-black text-white dark:bg-white dark:text-black rounded-md hover:bg-black/90 dark:hover:bg-white/90 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? "Sending..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
