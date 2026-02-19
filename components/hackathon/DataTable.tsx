"use client"

import { ReactNode } from "react"
import { Search, Filter, Loader2 } from "lucide-react"

interface Column<T> {
    header: string
    accessor: keyof T | ((item: T) => ReactNode)
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    isLoading?: boolean
    searchPlaceholder?: string
    onSearchChange?: (value: string) => void
    searchValue?: string
    actions?: (item: T) => ReactNode
}

export function DataTable<T extends { id: string }>({
    columns,
    data,
    isLoading,
    searchPlaceholder = "Search...",
    onSearchChange,
    searchValue,
    actions
}: DataTableProps<T>) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 h-12 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 h-12 bg-zinc-900 border border-white/5 rounded-2xl text-sm font-bold text-zinc-400 hover:text-white hover:border-white/10 transition-all">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                {columns.map((col, idx) => (
                                    <th key={idx} className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">
                                        {col.header}
                                    </th>
                                ))}
                                {actions && <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-20 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                                        <p className="text-zinc-500 text-sm mt-4 font-bold uppercase tracking-widest">Compiling Data...</p>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-20 text-center">
                                        <p className="text-zinc-600 text-sm font-black italic uppercase tracking-widest">No matching records found</p>
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                        {columns.map((col, idx) => (
                                            <td key={idx} className="px-6 py-5 text-sm font-medium text-zinc-300">
                                                {typeof col.accessor === "function" ? col.accessor(item) : (item[col.accessor] as ReactNode)}
                                            </td>
                                        ))}
                                        {actions && (
                                            <td className="px-6 py-5 text-right">
                                                {actions(item)}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
