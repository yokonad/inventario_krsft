// ============= CONSTANTS (hoisted per rerender-memo-with-default-value) =============
export const POLLING_INTERVAL_MS = 3000;
export const CACHE_PREFIX = 'inventario_cache_';

export const CATEGORIES = [
    'Electrónica', 'Químicos', 'Mobiliario', 'EPP',
    'Accesorios', 'Herramientas', 'Materiales Comprados', 'Otros',
];

export const ZONES = ['A', 'B', 'C', 'D', 'E'];
export const LEVELS = [1, 2, 3, 4];
export const POSITIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export const PROJECT_COLORS = [
    '#0AA4A4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#ef4444', '#06b6d4', '#6366f1', '#84cc16',
];

export const INITIAL_FORM = {
    id: null, nombre: '', descripcion: '', categoria: '', unidad: '', cantidad: 1,
    precio: '',
    zona: 'A', nivel: 1, posicion: 1,
};

export const INITIAL_LOCATION_FORM = { zona: 'A', nivel: 1, posicion: 1 };
