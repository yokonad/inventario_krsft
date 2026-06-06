import { ArrowLeftIcon } from '@heroicons/react/24/outline';

/**
 * PageHeader – Module header with back navigation, icon and title.
 * Mirrors the Proyectos PageHeader pattern exactly.
 */
export default function PageHeader({ title, subtitle, icon, children }) {
    return (
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                    <ArrowLeftIcon className="size-4" />
                    Volver
                </button>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-white">
                        {icon}
                    </span>
                    <span className="flex flex-col">
                        <span className="tracking-tight">{title}</span>
                        {subtitle && <span className="text-sm font-normal text-gray-500">{subtitle}</span>}
                    </span>
                </h1>
            </div>
            {children && <div className="flex items-center gap-3">{children}</div>}
        </header>
    );
}
