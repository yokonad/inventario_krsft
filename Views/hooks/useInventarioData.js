import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { hasPermission } from '@/utils/permissions';
import { POLLING_INTERVAL_MS, INITIAL_FORM, INITIAL_LOCATION_FORM } from '../utils/constants';
import { fetchJson, loadFromCache, saveToCache, arraysEqual, formatDate } from '../utils/helpers';

/**
 * Custom hook encapsulating ALL inventory business logic.
 * Manages state, data fetching, polling, CRUD, and computed values.
 * Per rerender-move-effect-to-event — minimal effects, logic in callbacks.
 */
export function useInventarioData(auth) {
    // ========== STATE ==========
    const [products, setProducts] = useState(() => loadFromCache('products') || []);
    const [reservedItems, setReservedItems] = useState(() => loadFromCache('reservedItems') || []);
    const [arrivalReports, setArrivalReports] = useState([]);
    const [filterArrivalStatus, setFilterArrivalStatus] = useState('');
    const [showRespondModal, setShowRespondModal] = useState(false);
    const [selectedArrivalReport, setSelectedArrivalReport] = useState(null);
    const [currentTab, setCurrentTab] = useState('inventario');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pendingDeleteItem, setPendingDeleteItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedReservedItem, setSelectedReservedItem] = useState(null);
    const [verifyingProduct, setVerifyingProduct] = useState(null);
    const [form, setForm] = useState(INITIAL_FORM);
    const [locationForm, setLocationForm] = useState(INITIAL_LOCATION_FORM);

    // Refs for polling and stable references (per rerender-use-ref-transient-values)
    const pollingRef = useRef(null);
    const productsRef = useRef(products);
    const reservedRef = useRef(reservedItems);
    productsRef.current = products;
    reservedRef.current = reservedItems;

    const currentUserName = useMemo(() => auth?.user?.name || 'Usuario', [auth]);

    // ========== FORM HELPERS (per rerender-functional-setstate) ==========
    const updateForm = useCallback((field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const updateLocationForm = useCallback((field, value) => {
        setLocationForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    // ========== COMPUTED / MEMOIZED VALUES ==========
    const filteredItems = useMemo(() => {
        const allItems = [...products, ...reservedItems];
        const q = searchQuery.toLowerCase();
        return allItems.filter((item) => {
            const matchSearch = !q || item.nombre?.toLowerCase().includes(q) || item.sku?.toLowerCase().includes(q) || item.material_type?.toLowerCase().includes(q);
            const matchCat = !filterCategory || item.categoria === filterCategory;
            const matchStatus = !filterStatus || item.estado === filterStatus;
            return matchSearch && matchCat && matchStatus;
        });
    }, [products, reservedItems, searchQuery, filterCategory, filterStatus]);

    const computedLocationCode = useMemo(
        () => `${form.zona}-${form.nivel}-${form.posicion}`,
        [form.zona, form.nivel, form.posicion],
    );

    const computedReservedLocationCode = useMemo(
        () => `${locationForm.zona}-${locationForm.nivel}-${locationForm.posicion}`,
        [locationForm.zona, locationForm.nivel, locationForm.posicion],
    );

    const filteredArrivalReports = useMemo(() => {
        if (!filterArrivalStatus) return arrivalReports;
        return arrivalReports.filter((r) => r.status === filterArrivalStatus);
    }, [arrivalReports, filterArrivalStatus]);

    const pendingArrivalCount = useMemo(
        () => arrivalReports.filter((r) => r.status === 'pendiente').length,
        [arrivalReports],
    );

    // ========== DATA FETCHING (per async-parallel) ==========
    const fetchProducts = useCallback(async () => {
        try {
            const data = await fetchJson('/api/inventariokrsft/list');
            if (data.success) {
                const newProducts = data.products || [];
                if (!arraysEqual(productsRef.current, newProducts)) {
                    setProducts(newProducts);
                    saveToCache('products', newProducts);
                }
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, []);

    const fetchReservedItems = useCallback(async () => {
        try {
            const data = await fetchJson('/api/inventariokrsft/reserved-items');
            if (data.success) {
                const newItems = data.reserved_items || [];
                if (!arraysEqual(reservedRef.current, newItems)) {
                    setReservedItems(newItems);
                    saveToCache('reservedItems', newItems);
                }
            }
        } catch (error) {
            console.error('Error fetching reserved items:', error);
        }
    }, []);

    const fetchArrivalReports = useCallback(async () => {
        try {
            const data = await fetchJson('/api/inventariokrsft/arrival-reports');
            if (data.success) {
                setArrivalReports(data.reports || []);
            }
        } catch (error) {
            console.error('Error fetching arrival reports:', error);
        }
    }, []);

    const fetchAll = useCallback(() => {
        Promise.all([
            fetchProducts(),
            fetchReservedItems(),
            fetchArrivalReports(),
        ]);
    }, [fetchProducts, fetchReservedItems, fetchArrivalReports]);

    // ========== NAVIGATION ==========
    const goBack = useCallback(() => {
        window.location.href = '/';
    }, []);

    // ========== MODAL: Material ==========
    const openModal = useCallback((item = null) => {
        setIsEditing(!!item);
        if (item) {
            const parts = item.ubicacion ? item.ubicacion.split('-') : ['A', '1', '1'];
            setForm({
                id: item.id,
                nombre: item.nombre || '',
                descripcion: item.descripcion || '',
                categoria: item.categoria,
                unidad: item.unidad,
                cantidad: item.cantidad,
                precio: item.precio || '',
                zona: parts[0] || 'A',
                nivel: parseInt(parts[1]) || 1,
                posicion: parseInt(parts[2]) || 1,
            });
        } else {
            setForm(INITIAL_FORM);
        }
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => setShowModal(false), []);

    // ========== MODAL: Location ==========
    const openLocationModal = useCallback((item) => {
        setSelectedReservedItem(item);
        setLocationForm(INITIAL_LOCATION_FORM);
        setShowLocationModal(true);
    }, []);

    const closeLocationModal = useCallback(() => {
        setShowLocationModal(false);
        setSelectedReservedItem(null);
    }, []);

    // ========== CRUD: Save Material ==========
    const saveMaterial = useCallback(async (e) => {
        e.preventDefault();
        if (!form.categoria || !form.unidad) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }
        try {
            const ubicacion = `${form.zona}-${form.nivel}-${form.posicion}`;
            const url = isEditing ? `/api/inventariokrsft/${form.id}` : '/api/inventariokrsft/create';
            const method = isEditing ? 'PUT' : 'POST';

            const data = await fetchJson(url, {
                method,
                body: JSON.stringify({
                    nombre: form.nombre,
                    material_type: form.nombre || null,
                    descripcion: form.descripcion,
                    sku: `SKU-${Date.now()}`,
                    categoria: form.categoria,
                    unidad: form.unidad,
                    cantidad: form.cantidad,
                    precio: parseFloat(form.precio) || 0,
                    moneda: 'PEN',
                    estado: 'activo',
                    ubicacion,
                }),
            });

            if (data.success) {
                alert(`✓ Material ${isEditing ? 'actualizado' : 'creado'} correctamente`);
                closeModal();
                fetchProducts();
            } else {
                alert(`❌ Error: ${data.message || 'No se pudo guardar'}`);
            }
        } catch (error) {
            console.error('Error al guardar material:', error);
            alert('Error al guardar el material');
        }
    }, [form, isEditing, closeModal, fetchProducts]);

    // ========== CRUD: Delete Product ==========
    const deleteProduct = useCallback((item) => {
        setPendingDeleteItem(item);
        setShowDeleteModal(true);
    }, []);

    const cancelDeleteProduct = useCallback(() => {
        setShowDeleteModal(false);
        setPendingDeleteItem(null);
    }, []);

    const confirmDeleteProduct = useCallback(async () => {
        if (!pendingDeleteItem) return;
        try {
            const data = await fetchJson(`/api/inventariokrsft/${pendingDeleteItem.id}`, { method: 'DELETE' });
            if (data.success) {
                cancelDeleteProduct();
                fetchProducts();
                fetchReservedItems();
            } else {
                alert(`❌ Error: ${data.message || 'No se pudo eliminar'}`);
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('Error al eliminar el producto');
        }
    }, [pendingDeleteItem, cancelDeleteProduct, fetchProducts, fetchReservedItems]);

    // ========== CRUD: Save Location ==========
    const saveLocation = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedReservedItem) {
            alert('Error: No hay item seleccionado');
            return;
        }
        try {
            const data = await fetchJson('/api/inventariokrsft/assign-location', {
                method: 'POST',
                body: JSON.stringify({
                    product_id: selectedReservedItem.id,
                    zona: locationForm.zona,
                    nivel: locationForm.nivel,
                    posicion: locationForm.posicion,
                }),
            });
            if (data.success) {
                alert(`✓ Ubicación ${data.location} asignada correctamente`);
                closeLocationModal();
                fetchReservedItems();
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error('Error al asignar ubicación:', error);
            alert('Error al asignar ubicación');
        }
    }, [selectedReservedItem, locationForm, closeLocationModal, fetchReservedItems]);

    // ========== VERIFICATION ==========
    const verifyProduct = useCallback((item) => {
        setVerifyingProduct(item);
        setShowVerifyModal(true);
    }, []);

    const closeVerifyModal = useCallback(() => {
        setShowVerifyModal(false);
        setVerifyingProduct(null);
    }, []);

    const confirmVerify = useCallback(async () => {
        if (!verifyingProduct) return;
        try {
            const data = await fetchJson(`/api/inventariokrsft/verify/${verifyingProduct.id}`, {
                method: 'POST',
                body: JSON.stringify({ usuario: currentUserName }),
            });
            if (data.success) {
                closeVerifyModal();
                fetchProducts();
                fetchReservedItems();
            } else {
                alert(`❌ Error: ${data.message || 'No se pudo verificar'}`);
            }
        } catch (error) {
            console.error('Error al verificar producto:', error);
            alert('Error al verificar el producto');
        }
    }, [verifyingProduct, currentUserName, closeVerifyModal, fetchProducts, fetchReservedItems]);

    // ========== ARRIVAL REPORTS ==========
    const openRespondModal = useCallback(async (report) => {
        try {
            const data = await fetchJson(`/api/inventariokrsft/arrival-reports/${report.id}`);
            if (data.success) {
                setSelectedArrivalReport(data.report);
            } else {
                setSelectedArrivalReport(report);
            }
        } catch {
            setSelectedArrivalReport(report);
        }
        setShowRespondModal(true);
    }, []);

    const closeRespondModal = useCallback(() => {
        setShowRespondModal(false);
        setSelectedArrivalReport(null);
    }, []);

    const respondArrivalReport = useCallback(async (reportId, respuesta) => {
        if (!respuesta.trim()) {
            alert('Por favor escribe una respuesta');
            return;
        }
        try {
            const data = await fetchJson(`/api/inventariokrsft/arrival-reports/${reportId}/respond`, {
                method: 'PUT',
                body: JSON.stringify({ respuesta }),
            });
            if (data.success) {
                closeRespondModal();
                fetchArrivalReports();
            } else {
                alert(`❌ Error: ${data.message || 'No se pudo responder'}`);
            }
        } catch (error) {
            console.error('Error al responder reporte:', error);
            alert('Error al responder el reporte');
        }
    }, [closeRespondModal, fetchArrivalReports]);

    // ========== EFFECTS ==========
    // Fetch data + polling (per rerender-move-effect-to-event — minimal effect)
    useEffect(() => {
        fetchAll();
        pollingRef.current = setInterval(fetchAll, POLLING_INTERVAL_MS);
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [fetchAll]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (!e.target.closest('.action-menu-wrapper')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    // ========== PERMISSIONS ==========
    const permissions = useMemo(() => ({
        create:          hasPermission(auth, 'module.inventariokrsft.create'),
        update:          hasPermission(auth, 'module.inventariokrsft.update'),
        delete:          hasPermission(auth, 'module.inventariokrsft.delete'),
        verify:          hasPermission(auth, 'module.inventariokrsft.verify'),
        respond_reports: hasPermission(auth, 'module.inventariokrsft.view'),
    }), [auth]);

    // ========== RETURN ==========
    return {
        // State
        products, reservedItems,
        currentTab, setCurrentTab,
        searchQuery, setSearchQuery,
        filterCategory, setFilterCategory,
        filterStatus, setFilterStatus,
        openMenuId, setOpenMenuId,
        showModal, showLocationModal, showVerifyModal,
        isEditing, selectedReservedItem, verifyingProduct,
        form, locationForm, currentUserName,

        // Arrival reports
        arrivalReports, filteredArrivalReports, pendingArrivalCount,
        filterArrivalStatus, setFilterArrivalStatus,
        showRespondModal, selectedArrivalReport,

        // Computed
        filteredItems, computedLocationCode, computedReservedLocationCode,

        // Form helpers
        updateForm, updateLocationForm,

        // Delete confirm modal
        showDeleteModal, pendingDeleteItem, cancelDeleteProduct, confirmDeleteProduct,

        // Actions
        goBack, openModal, closeModal, openLocationModal, closeLocationModal,
        saveMaterial, deleteProduct, saveLocation,
        verifyProduct, closeVerifyModal, confirmVerify,
        openRespondModal, closeRespondModal, respondArrivalReport,

        // Permissions
        permissions,
    };
}
