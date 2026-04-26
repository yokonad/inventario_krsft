import { memo, useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const STATUS_BADGE = {
  pendiente:  { variant: 'amber',   label: 'Pendiente' },
  respondido: { variant: 'blue',    label: 'Respondido' },
};

/**
 * RespondArrivalReportModal – Inventario staff views report items and types a response.
 * @param {{ open: boolean, onClose: () => void, report: object|null, onRespond: (reportId: number, respuesta: string) => Promise<void> }} props
 */
function RespondArrivalReportModal({ open, onClose, report, onRespond }) {
  const [respuesta, setRespuesta] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!report) return null;

  const items = report.items || [];
  const st = STATUS_BADGE[report.status] || STATUS_BADGE.pendiente;
  const alreadyResponded = report.status === 'respondido';

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      await onRespond(report.id, respuesta);
      setRespuesta('');
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    if (!processing) {
      setRespuesta('');
      onClose();
    }
  };

  return (
    <Modal 
      open={open} 
      onClose={handleClose} 
      size="lg" 
      title={
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 shadow-sm">
            <ChatBubbleLeftRightIcon className="size-5" />
          </span>
          <span>Respuesta a Reporte #{report.id}</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header info */}
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <Badge variant={st.variant}>{st.label}</Badge>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
            {report.project_name && (
              <span className="flex items-center gap-1.5">
                <span className="font-bold uppercase text-[10px] tracking-wider text-gray-400">Proyecto:</span>
                <span className="font-semibold text-gray-800">{report.project_name}</span>
              </span>
            )}
            {report.reported_by_name && (
              <span className="flex items-center gap-1.5">
                <span className="font-bold uppercase text-[10px] tracking-wider text-gray-400">Emisor:</span>
                <span className="font-semibold text-gray-800">{report.reported_by_name}</span>
              </span>
            )}
          </div>
        </div>

        {/* Supervisor notes */}
        {report.notas_supervisor && (
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Notas del Supervisor
            </h4>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm italic text-gray-600 text-sm leading-relaxed">
              "{report.notas_supervisor}"
            </div>
          </div>
        )}

        {/* Items table */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Materiales Reportados ({items.length})
          </h4>
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50/80 sticky top-0">
                  <tr className="*:px-4 *:py-2.5 *:text-[10px] *:font-bold *:uppercase *:tracking-wider *:text-gray-500 *:text-left">
                    <th>Material</th>
                    <th className="!text-center">Cant.</th>
                    <th>Tipo</th>
                    <th>Unidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2.5 font-medium text-gray-700">{item.description || '—'}</td>
                      <td className="px-4 py-2.5 text-center font-bold text-gray-900">{item.quantity ?? '—'}</td>
                      <td className="px-4 py-2.5 text-gray-500">{item.material_type || '—'}</td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs font-semibold">{item.unit || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Previous response (if already responded) */}
        {alreadyResponded && report.respuesta && (
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Respuesta de Inventario
              {report.respondido_por_name && (
                <span className="normal-case font-normal text-gray-400 ml-1">(Atendido por {report.respondido_por_name})</span>
              )}
            </h4>
            <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4 text-sm text-blue-900 leading-relaxed">
              {report.respuesta}
            </div>
          </div>
        )}

        {/* Response textarea */}
        {!alreadyResponded && (
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Tu Respuesta</label>
            <textarea
              value={respuesta}
              onChange={e => setRespuesta(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Escribe el estado de los materiales o acciones tomadas..."
              className="block w-full rounded-xl border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-all focus:border-primary focus:ring-primary placeholder:text-gray-300"
            />
          </div>
        )}
      </div>

      <footer className="mt-8 flex gap-3 justify-end">
        <Button variant="danger" onClick={handleClose} disabled={processing} className="px-8">Cancelar</Button>
        {!alreadyResponded && (
          <Button variant="primary" onClick={handleSubmit} disabled={!respuesta.trim() || processing} loading={processing} className="px-10 font-bold">
            {processing ? 'Enviando...' : 'Enviar Respuesta'}
          </Button>
        )}
      </footer>
    </Modal>
  );
}

export default memo(RespondArrivalReportModal);
