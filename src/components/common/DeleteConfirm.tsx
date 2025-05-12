import React from 'react';
import { X } from 'lucide-react';
import MotionModalWrapper from './MotionModal';
import { useTranslation } from 'react-i18next';

interface DeleteConfirmationModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title }) => {
    const { t } = useTranslation('delete');
    if (!isOpen) return null;
    return (
        <MotionModalWrapper>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-md mx-4">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-6">
                        <p>{t('deleteConfirm')}</p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                {t('delete')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MotionModalWrapper>
    );
};

export default DeleteConfirmationModal;