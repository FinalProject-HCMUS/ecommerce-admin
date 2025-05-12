import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Color } from '../../types/color/Color';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../common/DeleteConfirm';
import { deleteColor } from '../../apis/colorApi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';



interface ColorTableProps {
    refresh: () => void;
    colors: Color[];
}

const ColorTable: React.FC<ColorTableProps> = ({ refresh, colors }) => {
    const naviate = useNavigate();
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
    const { t } = useTranslation('color');
    const handleDeleteClick = (id: string) => {
        setSelectedColorId(id);
        setIsDeleteConfirmOpen(true); // Open the confirmation dialog
    };
    const handleConfirmDelete = async () => {
        const response = await deleteColor(selectedColorId!);
        if (!response.isSuccess) {
            alert(response.message);
            return;
        }
        toast.success("Color deleted successfully", {
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('color')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('colorCode')}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {colors.map((color) => (
                        <tr key={color.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex">
                                    <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: color.code }}></div>
                                    <div className="mx-3 text-sm text-gray-900">{color.name}</div>

                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{color.code}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => naviate(`/colors/edit/${color.id}`)}
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(color.id)} // Open the confirmation dialog
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
                title='Delete Color'
                isOpen={isDeleteConfirmOpen}
                onClose={() => { setIsDeleteConfirmOpen(false); }}
                onConfirm={handleConfirmDelete}
            />}
        </div>
    );
};

export default ColorTable;