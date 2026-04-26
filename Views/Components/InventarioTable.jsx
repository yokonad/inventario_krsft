/**
 * InventarioTable – Tabla de inventario con expansión de uso por proyecto.
 */
import { useState, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { formatDate, getProjectPillStyle } from '../utils/helpers';
import {
    PencilSquareIcon,
    TrashIcon,
    MapPinIcon,
    Bars3Icon,
    CheckCircleIcon,
    XMarkIcon,
    ChevronRightIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Badge from './ui/Badge';

const STATUS_VARIANT = { activo: 'emerald', pendiente: 'amber', rechazado: 'red' };
const STATUS_LABEL = { activo: 'Aprobado', pendiente: 'Sin Aprobar', rechazado: 'Rechazado' };

function ActionDropdown({ item, onEdit, onDelete, onVerify, isOpen, onToggle, onClose, permissions = {} }) {
    const actions = [
        permissions.update ? {
            label: 'Editar Material',
            description: 'Modificar datos del material',
            icon: <PencilSquareIcon className="size-6" />,
            onClick: () => { onEdit(item); onClose(); },
            iconBg: 'bg-blue-100 text-blue-600',
            border: 'border-blue-100 hover:border-blue-300 hover:bg-blue-50/50',
        } : null,
        permissions.verify ? {
            label: 'Verificar',
            description: 'Marcar como verificado',
            icon: <CheckCircleIcon className="size-6" />,
            onClick: () => { onVerify(item); onClose(); },
            iconBg: 'bg-emerald-100 text-emerald-600',
            border: 'border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50',
        } : null,
    ].filter(Boolean);

    const showHamburger = actions.length > 0;
    const showTrash = permissions.delete;

    if (!showHamburger && !showTrash) {
        return <span className="text-sm text-gray-400">—</span>;
    }

    return (
        <div className="flex items-center justify-center gap-1.5">
            {showHamburger && (
                <button
                    onClick={onToggle}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors shadow-sm"
                    title="Más opciones"
                >
                    <Bars3Icon className="size-4" />
                </button>
            )}

            {showTrash && (
                <button
                    onClick={() => onDelete(item)}
                    className="inline-flex items-center justify-center rounded-lg border border-red-100 bg-red-50 p-1.5 text-red-500 hover:bg-red-100 transition-colors shadow-sm"
                    title="Eliminar"
                >
                    <TrashIcon className="size-4" />
                </button>
            )}

            {isOpen && showHamburger && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border-2 border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <div>
                                <h2 className="text-base font-bold text-gray-900">Acciones del Material</h2>
                                <p className="text-xs text-gray-500 truncate max-w-[240px]" title={item.nombre}>{item.nombre}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <XMarkIcon className="size-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-3">
                            {actions.map((action) => (
                                <button
                                    key={action.label}
                                    onClick={action.onClick}
                                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${action.border}`}
                                >
                                    <span className={`flex size-11 items-center justify-center rounded-xl shrink-0 ${action.iconBg}`}>
                                        {action.icon}
                                    </span>
                                    <div className="min-w-0">
                                        <span className="block text-sm font-bold text-gray-900">{action.label}</span>
                                        <span className="block text-xs text-gray-500 truncate">{action.description}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body,
            )}
        </div>
    );
}

/**
 * @param {{
 *   filteredItems: Array,
 *   verifyProduct: Function,
 *   openModal: Function,
 *   deleteProduct: Function,
 * }} props
 */
export default function InventarioTable({
    filteredItems,
    verifyProduct,
    openModal,
    deleteProduct,
    permissions = {},
}) {
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [expandedRows, setExpandedRows] = useState(new Set());

    const toggleRow = (itemId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    if (filteredItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border-2 border-dashed border-gray-200 bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-16 text-gray-200 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Sin materiales registrados</h3>
                <p className="text-sm text-gray-400">No se encontraron resultados con los filtros actuales.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full min-w-[1200px] table-fixed divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50/80">
                    <tr className="*:px-4 *:py-3 *:text-xs *:font-bold *:uppercase *:tracking-wider *:text-gray-500 *:text-left">
                        <th className="w-[170px]">Tipo de Material</th>
                        <th className="w-[200px]">Especificación Técnica</th>
                        <th className="w-[130px]">Categoría</th>
                        <th className="w-20 !text-center">Cant.</th>
                        <th className="w-24 !text-right">P. Unit.</th>
                        <th className="w-[130px] !text-center">Disponibilidad</th>
                        <th className="w-[140px]">Proyecto Origen</th>
                        <th className="w-[110px]">Ubicación</th>
                        <th className="w-[110px] !text-center">Estado</th>
                        <th className="w-[110px] !text-center">Verificación</th>
                        <th className="w-20 !text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {filteredItems.map((item) => {
                        const isExpanded = expandedRows.has(item.id);
                        const hasUsage = item.usage && item.usage.length > 0;
                        
                        return (
                            <Fragment key={item.id}>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    {/* Tipo de Material */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {hasUsage && (
                                                <button
                                                    onClick={() => toggleRow(item.id)}
                                                    className="shrink-0 rounded p-1 hover:bg-gray-200 transition-colors"
                                                    title={isExpanded ? 'Ocultar uso' : 'Ver uso por proyecto'}
                                                >
                                                    {isExpanded ? (
                                                        <ChevronDownIcon className="size-4 text-gray-600" />
                                                    ) : (
                                                        <ChevronRightIcon className="size-4 text-gray-600" />
                                                    )}
                                                </button>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{item.nombre || '—'}</p>
                                                <p className="text-xs text-gray-500 truncate">{item.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Especificación Técnica */}
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-700 truncate" title={item.descripcion}>{item.descripcion || '—'}</p>
                                    </td>
                            <td className="px-4 py-3 text-sm text-gray-700 truncate">{item.categoria}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-center">
                                <span className="font-mono text-sm font-semibold text-gray-800">{item.cantidad}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                {(() => {
                                    const precio = parseFloat(item.precio) || 0;
                                    const qty = parseInt(item.cantidad) || 1;
                                    const unitPrice = parseFloat(item.precio_unitario) || (precio > 0 && qty > 0 ? precio / qty : 0);
                                    return unitPrice > 0 ? (
                                        <span className="font-mono text-sm text-gray-700">S/ {unitPrice.toFixed(2)}</span>
                                    ) : (
                                        <span className="text-sm text-gray-400">-</span>
                                    );
                                })()}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-center">
                                {item.apartado ? (
                                    <Badge variant="cyan" icon={<MapPinIcon className="size-3.5" />}>Apartado</Badge>
                                ) : (
                                    <Badge variant="emerald" icon={<CheckCircleIcon className="size-3.5" />}>Disponible</Badge>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                {item.nombre_proyecto ? (
                                    <span
                                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                                        style={getProjectPillStyle(item)}
                                    >
                                        {item.nombre_proyecto}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-400">—</span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                {item.ubicacion ? (
                                    <span className="inline-flex items-center rounded bg-primary-50 px-2 py-0.5 font-mono text-xs font-semibold text-primary-700">
                                        {item.ubicacion}
                                    </span>
                                ) : item.apartado ? (
                                    <Badge variant="amber">Pendiente</Badge>
                                ) : (
                                    <span className="text-sm text-gray-400">-</span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <Badge variant={STATUS_VARIANT[item.estado] || 'gray'}>
                                    {STATUS_LABEL[item.estado] || item.estado}
                                </Badge>
                            </td>
                            <td className="px-4 py-3 text-center">
                                {item.verificado_at ? (
                                    <span
                                        className="text-xs text-emerald-600 font-medium"
                                        title={`Verificado por: ${item.verificado_por}`}
                                    >
                                        {formatDate(item.verificado_at)}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-400">-</span>
                                )}
                            </td>
                            <td className="px-2 py-3 text-center">
                                <ActionDropdown
                                    item={item}
                                    onEdit={openModal}
                                    onDelete={deleteProduct}
                                    onVerify={verifyProduct}
                                    isOpen={openDropdownId === item.id}
                                    onToggle={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                                    onClose={() => setOpenDropdownId(null)}
                                    permissions={permissions}
                                />
                            </td>
                        </tr>
                        
                        {/* Fila expandida mostrando uso por proyecto */}
                        {isExpanded && hasUsage && (
                            <tr key={`${item.id}-usage`} className="bg-gray-50">
                                <td colSpan="11" className="px-4 py-3">
                                    <div className="sm:ml-8 space-y-2">
                                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Uso por Proyecto:</h4>
                                        <div className="space-y-1.5">
                                            {item.usage.map((uso, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2"
                                                >
                                                    <span className="text-sm text-gray-800 font-medium">
                                                        {uso.proyecto}
                                                    </span>
                                                    <span className="font-mono text-sm font-semibold text-primary-600">
                                                        {uso.cantidad} unidades
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </Fragment>
                    );
                    })}
                </tbody>
            </table>
        </div>
    );
}
