import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * SearchInput – Slim search field with icon and clear button.
 * Tailwind v4 — uses `outline` for focus instead of deprecated ring utilities.
 */
export default function SearchInput({ value, onChange, placeholder = 'Buscar...', className = '' }) {
    return (
        <div className={`flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 ${className}`}>
            <MagnifyingGlassIcon className="size-4 shrink-0 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="min-w-0 flex-1 border-none bg-transparent p-0 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-0"
            />
            {value && (
                <button type="button" onClick={() => onChange('')} className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                    <XMarkIcon className="size-4" />
                </button>
            )}
        </div>
    );
}
