import React from 'react'

export function DevLabel() {
    // Only show in development
    if (process.env.APP_ENV !== 'development') return null;

    return (
        <span className="px-2 py-0.5 bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm animate-pulse">
            DEV
        </span>
    );
}
