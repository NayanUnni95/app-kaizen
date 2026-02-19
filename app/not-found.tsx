'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const messages = [
    "Oops! Page not found",
    "This page doesn't exist"
];

export default function NotFound() {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    // Cycle through messages
    useEffect(() => {
        const messageInterval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        }, 3000);

        return () => clearInterval(messageInterval);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 p-4">
            <div className="max-w-md w-full">
                {/* Animated 404 */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        {/* Glowing effect */}
                        <div className="absolute inset-0 blur-2xl opacity-30">
                            <div className="text-9xl font-bold bg-gradient-to-r from-blue-500 to-purple-600">
                                404
                            </div>
                        </div>
                        {/* Main 404 */}
                        <h1 className="relative text-9xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                            404
                        </h1>
                    </div>
                </div>

                {/* Error Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
                    {/* Animated Message */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 transition-all duration-500 ease-in-out min-h-[2rem]">
                            {messages[currentMessageIndex]}
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            The page you're looking for doesn't exist or has been moved
                        </p>
                    </div>

                    {/* Decorative divider */}
                    <div className="mb-6">
                        <div className="h-1 bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent rounded-full"></div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 text-center"
                        >
                            Go to Homepage
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
                        >
                            Go Back
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center" style={{ minHeight: '1.5rem' }}>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '100ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
