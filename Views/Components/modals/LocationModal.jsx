/**
 * LocationModal – Assign ZNP location to reserved item (Tailwind, Modal UI).
 */
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ZONES, LEVELS, POSITIONS } from '../../utils/constants';
import { MapPinIcon } from '@heroicons/react/24/outline';

export default function LocationModal({
    selectedReservedItem,
    locationForm, updateLocationForm,
    computedReservedLocationCode,
    saveLocation, closeLocationModal,
}) {
    return (
        <Modal
            open={true}
            onClose={closeLocationModal}
            title="Asignar Ubicación ZNP"
            size="md"
            footer={
                <>
                    <Button variant="secondary" onClick={closeLocationModal}>Cancelar</Button>
                    <Button variant="primary" type="submit" form="location-form" className="gap-2">
                        <MapPinIcon className="size-4" /> Guardar Ubicación
                    </Button>
                </>
            }
        >
            {/* Material info card */}
            <div className="rounded-lg border border-primary-100 bg-primary-50 p-4 mb-4">
                <p className="text-xs font-semibold uppercase text-primary-700 mb-1">Material</p>
                <p className="text-sm font-bold text-gray-900">{selectedReservedItem?.nombre}</p>
                <p className="text-xs text-gray-600 mt-1">Proyecto: <strong>{selectedReservedItem?.nombre_proyecto}</strong></p>
            </div>

            <form onSubmit={saveLocation} id="location-form">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-3">Código de Ubicación (Sistema ZNP)</h3>
                <div className="rounded-lg border border-primary-100 bg-primary-50/50 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-0.5">Zona (A-E)</label>
                            <select value={locationForm.zona} onChange={(e) => updateLocationForm('zona', e.target.value)} required
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary">
                                <option value="">Seleccionar...</option>
                                {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-0.5">Nivel (1-4)</label>
                            <select value={locationForm.nivel} onChange={(e) => updateLocationForm('nivel', Number(e.target.value))} required
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary">
                                <option value="">Seleccionar...</option>
                                {LEVELS.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-0.5">Posición (1-8)</label>
                            <select value={locationForm.posicion} onChange={(e) => updateLocationForm('posicion', Number(e.target.value))} required
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary">
                                <option value="">Seleccionar...</option>
                                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="rounded bg-white border border-primary-200 p-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Código Final</p>
                        <p className="text-xl font-bold text-primary-700 font-mono">{computedReservedLocationCode}</p>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
