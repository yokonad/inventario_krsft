import clsx from 'clsx';

/**
 * StatsCard — HyperUI Stat Card (patrón 3.4 con icono grande).
 */
export default function StatsCard({
    title,
    value,
    icon,
    iconBg = 'bg-blue-100',
    iconColor = 'text-blue-600',
    className = '',
}) {
    return (
        <article
            className={clsx(
                'flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6',
                className,
            )}
        >
            <span className={clsx('rounded-full p-4', iconBg, iconColor, '[&>svg]:size-8')}>
                {icon}
            </span>
            <div>
                <p className="text-2xl font-medium text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
        </article>
    );
}
