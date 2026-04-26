import { CACHE_PREFIX, PROJECT_COLORS } from './constants';

// ============= CACHE HELPERS (per js-cache-function-results) =============
export const saveToCache = (key, data) => {
    try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (e) { console.warn('Cache save error:', e); }
};

export const loadFromCache = (key) => {
    try {
        const cached = localStorage.getItem(CACHE_PREFIX + key);
        if (cached) return JSON.parse(cached).data;
    } catch (e) { console.warn('Cache load error:', e); }
    return null;
};

export const arraysEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ============= UTILITY HELPERS (per js-early-exit) =============
import { formatDate as _fmtDate } from '@/services/DateTimeService';

export const formatDate = (dateString) => {
    if (!dateString) return '-';
    return _fmtDate(dateString);
};

export const getProjectPillStyle = (item) => {
    if (!item) return {};
    const projectId = item.project_id ?? item.proyecto_id ?? item.id_proyecto ?? null;
    let color = null;

    if (typeof projectId === 'number') {
        color = PROJECT_COLORS[projectId % PROJECT_COLORS.length];
    }

    if (!color && item.nombre_proyecto) {
        let hash = 0;
        const name = item.nombre_proyecto;
        for (let i = 0; i < name.length; i += 1) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        color = PROJECT_COLORS[Math.abs(hash) % PROJECT_COLORS.length];
    }

    return color ? { backgroundColor: color, color: '#ffffff' } : {};
};

export const getCsrfToken = () =>
    document.querySelector('meta[name="csrf-token"]')?.content || '';

export const fetchJson = async (url, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': getCsrfToken(),
        ...options.headers,
    };
    const res = await fetch(url, { ...options, headers });
    return res.json();
};
