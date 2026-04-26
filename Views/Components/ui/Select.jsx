import clsx from 'clsx';

/**
 * Select — Standard select field with label.
 * Tailwind v4 compatible.
 */
function Select({
    label, name, value, onChange, options = [], placeholder = 'Seleccionar...', error, required = false, helper, className = '', children, ref, ...props
}) {
    return (
        <div className={className}>
            <label className="block">
                {label && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        {label}
                        {required && <span className="ml-1 text-red-500">*</span>}
                    </span>
                )}
                <select
                    ref={ref}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={clsx(
                        'w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors',
                        label && 'mt-1',
                        error
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20',
                    )}
                    {...props}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {children
                        ? children
                        : options.map((opt, i) => (
                            <option key={opt.value ?? i} value={opt.value}>{opt.label}</option>
                        ))
                    }
                </select>
            </label>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {helper && !error && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
        </div>
    );
}

Select.displayName = 'Select';
export default Select;