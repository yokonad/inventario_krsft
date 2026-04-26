import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { CATEGORIES, ZONES, LEVELS, POSITIONS } from '../../utils/constants';
import { ArchiveBoxIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function MaterialModal({
    form, updateForm, computedLocationCode,
    isEditing, saveMaterial, closeModal,
}) {
    return (
        <Modal
            open={true}
            onClose={closeModal}
            title={
                <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <ArchiveBoxIcon className="size-5" />
                    </span>
                    <span>{isEditing ? 'Editar Material' : 'Nuevo Material'}</span>
                </div>
            }
            size="lg"
            hideClose
            footer={
                <div className="flex items-center justify-end gap-3 w-full">
                    <Button variant="danger" onClick={closeModal} className="px-8">
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" form="material-form" className="px-8 font-bold">
                        Guardar Material
                    </Button>
                </div>
            }
        >
            <div className="mb-6 rounded-xl border border-blue-50 bg-blue-50/30 p-4">
                <p className="text-sm leading-relaxed text-blue-700/80">
                    Registra o modifica materiales para el control de stock. Asegúrate de asignar la ubicación correcta en el sistema ZNP para facilitar su búsqueda posterior.
                </p>
            </div>

            <form onSubmit={saveMaterial} id="material-form" className="space-y-8">
                {/* Información General */}
                <section className="space-y-4">
                    <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Información General
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-5">
                        <Input
                            label="Tipo de Material"
                            placeholder="Ej: bridas s.o., codos sw, válvulas"
                            value={form.nombre}
                            onChange={(e) => updateForm('nombre', e.target.value)}
                            required
                        />
                        <Input
                            label="Especificación Técnica"
                            placeholder='Ej: bridas s.o. de 2" x 150 lb.'
                            value={form.descripcion}
                            onChange={(e) => updateForm('descripcion', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Select
                            label="Categoría"
                            value={form.categoria}
                            onChange={(e) => updateForm('categoria', e.target.value)}
                            required
                            options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                            placeholder="Seleccionar categoría..."
                        />
                        <Input
                            label="Unidad de Medida"
                            placeholder="UND, KG, M, LT"
                            value={form.unidad}
                            onChange={(e) => updateForm('unidad', e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Input
                            label="Cantidad Stock"
                            type="number"
                            min="0"
                            value={form.cantidad}
                            onChange={(e) => updateForm('cantidad', Number(e.target.value))}
                            required
                        />
                        <div className="space-y-1.5">
                            <Input
                                label="Precio Total (S/)"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={form.precio}
                                onChange={(e) => updateForm('precio', e.target.value)}
                            />
                            {form.precio > 0 && (
                                <div className="rounded-lg bg-gray-50 px-3 py-1.5 border border-gray-100 flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">P. Unitario</span>
                                    <span className="text-sm font-bold text-primary tracking-tight">
                                        S/ {(form.precio / (form.cantidad || 1)).toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Ubicación ZNP */}
                <section className="space-y-4">
                    <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
                        <MapPinIcon className="size-3.5 text-primary" />
                        Ubicación (Sistema ZNP)
                    </h3>
                    
                    <div className="rounded-2xl border border-primary-100 bg-primary-50/30 p-6 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <Select
                                label="Zona"
                                value={form.zona}
                                onChange={(e) => updateForm('zona', e.target.value)}
                                options={ZONES.map(z => ({ value: z, label: z }))}
                            />
                            <Select
                                label="Nivel"
                                value={form.nivel}
                                onChange={(e) => updateForm('nivel', Number(e.target.value))}
                                options={LEVELS.map(n => ({ value: n, label: n.toString() }))}
                            />
                            <Select
                                label="Posición"
                                value={form.posicion}
                                onChange={(e) => updateForm('posicion', Number(e.target.value))}
                                options={POSITIONS.map(p => ({ value: p, label: p.toString() }))}
                            />
                        </div>
                        
                        <div className="flex flex-col items-center justify-center rounded-xl bg-white border border-primary-200 p-4 shadow-sm">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Identificador de Ubicación</span>
                            <span className="text-3xl font-black text-primary font-mono tracking-tighter">{computedLocationCode}</span>
                        </div>
                    </div>
                </section>
            </form>
        </Modal>
    );
}
