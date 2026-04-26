/**
 * FilterBar – Search + Category/Status filters + New button.
 * Extended layout, slim profile, no wrapper card.
 */
import { PlusIcon } from '@heroicons/react/24/outline';
import { CATEGORIES } from '../utils/constants';
import SearchInput from './ui/SearchInput';
import Button from './ui/Button';
import Select from './ui/Select';

export default function FilterBar({
    searchQuery, onSearchChange,
    filterCategory, onCategoryChange,
    filterStatus, onStatusChange,
    onAddClick,
    canCreate,
}) {
    return (
        <div className="flex flex-wrap items-end gap-4">
            {/* Search — grows to fill available space */}
            <div className="min-w-[220px] flex-1">
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Buscar por nombre, SKU o especificación..."
                />
            </div>

            {/* Filters — fixed widths, right-aligned group */}
            <div className="flex flex-wrap items-end gap-3">
                <div className="w-48">
                    <Select
                        value={filterCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        placeholder="Todas las categorías"
                    >
                        {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </Select>
                </div>
                <div className="w-44">
                    <Select
                        value={filterStatus}
                        onChange={(e) => onStatusChange(e.target.value)}
                        placeholder="Todos los estados"
                    >
                        <option value="activo">Aprobado</option>
                        <option value="pendiente">Sin Aprobar</option>
                        <option value="rechazado">Rechazado</option>
                    </Select>
                </div>
                {canCreate && (
                    <Button
                        variant="primary"
                        onClick={() => onAddClick()}
                        className="gap-2 px-6 font-bold"
                    >
                        <PlusIcon className="size-4" />
                        Nuevo Material
                    </Button>
                )}
            </div>
        </div>
    );
}
