import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    ctaLabel?: string
    ctaHref?: string
    onCta?: () => void
}

export function EmptyState({ icon: Icon, title, description, ctaLabel, ctaHref, onCta }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center rounded-2xl border border-dashed border-[#E6E9EE] bg-[#F8FAFC]">
            <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 text-[#2563EB]" />
            </div>
            <h3 className="font-heading font-semibold text-base text-[#0F172A] mb-1">{title}</h3>
            <p className="text-sm text-[#64748B] mb-5 max-w-xs leading-relaxed">{description}</p>
            {ctaLabel && (
                ctaHref ? (
                    <a
                        href={ctaHref}
                        className="kz-btn-primary text-sm px-5 py-2.5 rounded-xl font-semibold"
                    >
                        {ctaLabel}
                    </a>
                ) : (
                    <button
                        onClick={onCta}
                        className="kz-btn-primary text-sm px-5 py-2.5 rounded-xl font-semibold"
                    >
                        {ctaLabel}
                    </button>
                )
            )}
        </div>
    )
}
