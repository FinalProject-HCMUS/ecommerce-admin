import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Size } from '../../types/size/Size';
import { useNavigate } from 'react-router-dom';
import { deleteSize } from '../../apis/sizeApi';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../common/DeleteConfirm';
import { useTranslation } from 'react-i18next';



interface SizeTableProps {
    refresh: () => void;
    sizes: Size[];
}

const SizeTable: React.FC<SizeTableProps> = ({ sizes, refresh }) => {
    const navigate = useNavigate();
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
    const { t } = useTranslation('size');
    const handleDeleteClick = (id: string) => {
        setSelectedSizeId(id);
        setIsDeleteConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        const response = await deleteSize(selectedSizeId!);
        if (!response.isSuccess) {
            toast.error(response.message, {
                autoClose: 1000, position: "top-right"
            });
            return;
        }
        toast.success(t('deleteSuccess'), {
            autoClose: 1000,
        });
        refresh();
        setIsDeleteConfirmOpen(false);
    };
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('nameSize')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('minHeight')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('maxHeight')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('minWeight')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('maxWeight')}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sizes.map((size) => (
                        <tr key={size.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{size.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{size.minHeight}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{size.maxHeight}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{size.minWeight}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{size.maxWeight}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => navigate(`/sizes/edit/${size.id}`)}
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(size.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isDeleteConfirmOpen && <DeleteConfirmationModal
                title={t('deleteSize')}
                isOpen={isDeleteConfirmOpen}
                onClose={() => { setIsDeleteConfirmOpen(false); }}
                onConfirm={handleConfirmDelete}
            />}
        </div>
    );
};

export default SizeTable;