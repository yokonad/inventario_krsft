import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { CheckCircleIcon, UserIcon } from '@heroicons/react/24/outline';

export default function VerifyModal({ verifyingProduct, currentUserName, confirmVerify, closeVerifyModal }) {
    return (
        <Modal open={true} onClose={closeVerifyModal} size="sm">
            <div className="text-center py-4">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircleIcon className="size-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Verificar Material</h3>
                <p className="text-sm text-gray-500 mb-2">¿Confirmas la verificación de:</p>
                <p className="text-sm font-bold text-gray-900 mb-3">{verifyingProduct?.nombre}</p>
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600 mb-5">
                    <UserIcon className="size-4" /> {currentUserName}
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={closeVerifyModal} className="flex-1">Cancelar</Button>
                    <Button variant="success" onClick={confirmVerify} className="flex-1 gap-2">
                        <CheckCircleIcon className="size-4" /> Verificar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
