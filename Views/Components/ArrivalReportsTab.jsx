import { memo, useMemo } from 'react';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Badge from './ui/Badge';
import Button from './ui/Button';

const STATUS_BADGE = {
  pendiente:  { variant: 'amber',   label: 'Pendiente' },
  respondido: { variant: 'blue',    label: 'Respondido' },
};

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'respondido', label: 'Respondidos' },
];

/**
 * ArrivalReportsTab – Tab content showing cross-module arrival reports from Proyectos.
 * @param {{ reports: Array, filterStatus: string, onFilterChange: (v: string) => void, onOpenRespond: (report) => void }} props
 */
function ArrivalReportsTab({ reports, filterStatus, onFilterChange, onOpenRespond }) {
  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-600">Estado:</span>
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onFilterChange(opt.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filterStatus === opt.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
          <ClipboardDocumentListIcon className="mx-auto size-16 text-gray-200 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No hay reportes de llegada</h3>
          <p className="text-sm text-gray-400">Los reportes aparecerán cuando los supervisores reporten materiales faltantes.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50/80">
              <tr className="*:px-4 *:py-3 *:text-xs *:font-bold *:uppercase *:tracking-wider *:text-gray-500 *:text-left">
                <th className="w-16">ID</th>
                <th className="min-w-[200px]">Proyecto</th>
                <th className="w-48">Reportado por</th>
                <th className="w-32">Fecha</th>
                <th className="w-20 !text-center">Items</th>
                <th className="w-32 !text-center">Estado</th>
                <th className="w-28 !text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map(report => {
                const st = STATUS_BADGE[report.status] || STATUS_BADGE.pendiente;
                return (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-700 font-medium">#{report.id}</td>
                    <td className="px-4 py-3 text-gray-700">{report.project_name || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{report.reported_by_name || '—'}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {new Date(report.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{report.items?.length ?? '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant={report.status === 'pendiente' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => onOpenRespond(report)}
                      >
                        {report.status === 'pendiente' ? 'Responder' : 'Ver'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default memo(ArrivalReportsTab);
