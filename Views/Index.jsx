/**
 * INVENTARIO — Index.jsx (Orchestrator, HyperUI layout)
 */
import {
    ArchiveBoxIcon, ClipboardDocumentListIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

import { useInventarioData } from './hooks/useInventarioData';

/* Feature components */
import PageHeader      from './Components/PageHeader';
import FilterBar       from './Components/FilterBar';
import InventarioTable from './Components/InventarioTable';
import ArrivalReportsTab from './Components/ArrivalReportsTab';

/* Modals */
import MaterialModal         from './Components/modals/MaterialModal';
import LocationModal         from './Components/modals/LocationModal';
import VerifyModal           from './Components/modals/VerifyModal';
import RespondArrivalReportModal from './Components/modals/RespondArrivalReportModal';
import ConfirmModal          from './Components/modals/ConfirmModal';

export default function InventarioIndex({ auth }) {
    const inv = useInventarioData(auth);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full px-12 py-4 space-y-6">

                {/* Header */}
                <PageHeader
                    title="INVENTARIO DE MATERIALES"
                    subtitle="Control de stock, ubicación ZNP y reportes"
                    icon={<ArchiveBoxIcon className="size-7" />}
                />

                {/* Tabs */}
                <div className="flex flex-wrap gap-8 border-b border-gray-200">
                    <button
                        role="tab"
                        aria-selected={inv.currentTab === 'inventario'}
                        onClick={() => inv.setCurrentTab('inventario')}
                        className={`inline-flex items-center gap-2 border-b-2 px-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors -mb-[1px] ${
                            inv.currentTab === 'inventario' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <ClipboardDocumentListIcon className="size-4" /> 
                        Inventario
                    </button>
                    {inv.permissions.respond_reports && (
                        <button
                            role="tab"
                            aria-selected={inv.currentTab === 'reportes'}
                            onClick={() => inv.setCurrentTab('reportes')}
                            className={`inline-flex items-center gap-2 border-b-2 px-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors -mb-[1px] ${
                                inv.currentTab === 'reportes' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <ExclamationTriangleIcon className="size-4" /> 
                            Reportes de Llegada
                            {inv.pendingArrivalCount > 0 && (
                                <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                                    {inv.pendingArrivalCount}
                                </span>
                            )}
                        </button>
                    )}
                </div>

                {/* Inventario Tab */}
                {inv.currentTab === 'inventario' && (
                    <div className="space-y-6">
                        <FilterBar
                            searchQuery={inv.searchQuery}  onSearchChange={inv.setSearchQuery}
                            filterCategory={inv.filterCategory}  onCategoryChange={inv.setFilterCategory}
                            filterStatus={inv.filterStatus}  onStatusChange={inv.setFilterStatus}
                            onAddClick={() => inv.openModal()}
                            canCreate={inv.permissions.create}
                        />
                        <InventarioTable
                            filteredItems={inv.filteredItems}
                            verifyProduct={inv.verifyProduct}
                            openModal={inv.openModal}  deleteProduct={inv.deleteProduct}
                            permissions={inv.permissions}
                        />
                    </div>
                )}

                {/* Reportes de Llegada Tab */}
                {inv.currentTab === 'reportes' && inv.permissions.respond_reports && (
                    <ArrivalReportsTab
                        reports={inv.filteredArrivalReports}
                        filterStatus={inv.filterArrivalStatus}
                        onFilterChange={inv.setFilterArrivalStatus}
                        onOpenRespond={inv.openRespondModal}
                    />
                )}
            </div>

            {/* Modals */}
            {inv.showModal && <MaterialModal form={inv.form} updateForm={inv.updateForm} computedLocationCode={inv.computedLocationCode} isEditing={inv.isEditing} saveMaterial={inv.saveMaterial} closeModal={inv.closeModal} />}
            {inv.showLocationModal && <LocationModal selectedReservedItem={inv.selectedReservedItem} locationForm={inv.locationForm} updateLocationForm={inv.updateLocationForm} computedReservedLocationCode={inv.computedReservedLocationCode} saveLocation={inv.saveLocation} closeLocationModal={inv.closeLocationModal} />}
            {inv.showVerifyModal && <VerifyModal verifyingProduct={inv.verifyingProduct} currentUserName={inv.currentUserName} confirmVerify={inv.confirmVerify} closeVerifyModal={inv.closeVerifyModal} />}
            <RespondArrivalReportModal
                open={inv.showRespondModal}
                onClose={inv.closeRespondModal}
                report={inv.selectedArrivalReport}
                onRespond={inv.respondArrivalReport}
            />

            <ConfirmModal
                open={inv.showDeleteModal}
                onClose={inv.cancelDeleteProduct}
                title="Eliminar material"
                message={`¿Estás seguro de eliminar "${inv.pendingDeleteItem?.material_type || inv.pendingDeleteItem?.nombre || ''}"? Esta acción no se puede deshacer.`}
                actionLabel="Eliminar"
                actionVariant="danger"
                onConfirm={inv.confirmDeleteProduct}
            />
        </div>
    );
}
