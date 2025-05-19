import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Category } from '../../types/category/Category';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../common/DeleteConfirm';
import { toast } from 'react-toastify';
import { deleteCategory } from '../../apis/categoryApi';
import { useTranslation } from 'react-i18next';


interface CategoryTableProps {
    categories: Category[];
    refresh: () => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, refresh }) => {
    const navigate = useNavigate();
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const { t } = useTranslation('category');
    const handleDeleteClick = (id: string) => {
        setSelectedCategoryId(id);
        setIsDeleteConfirmOpen(true); // Open the confirmation dialog
    };

    const handleConfirmDelete = async () => {
        const response = await deleteCategory(selectedCategoryId!);
        if (!response.isSuccess) {
            alert(response.message);
            return;
        }
        toast.success("Category deleted successfully", {
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('category')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('description')}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{category.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{category.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => {
                                        navigate(`/categories/edit/${category.id}`);
                                    }
                                    }
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(category.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <DeleteConfirmationModal
                title={t('deleteCategory')}
                isOpen={isDeleteConfirmOpen}
                onClose={() => { setIsDeleteConfirmOpen(false); }}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default CategoryTable;