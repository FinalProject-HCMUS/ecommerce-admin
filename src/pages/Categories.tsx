/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Pagination from '../components/common/Pagination';
import CategoryTable from '../components/categories/CategoryTable';
import AddCategoryModal from '../components/categories/AddCategoryModal';
import EditCategoryModal from '../components/categories/EditCategoryModal';
import { getCategories } from '../apis/categoryApi';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../components/common/DeleteConfirm';
import MotionPageWrapper from '../components/common/MotionPage';
import { Category } from '../types/category/category';

const ITEMS_PER_PAGE = 10;

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any | undefined>();
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

    const fetchCategories = async (page: number) => {
        try {
            const response = await getCategories(page - 1, ITEMS_PER_PAGE);
            setCategories(response.content || []);
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch categories');
        }
    };

    useEffect(() => {
        fetchCategories(currentPage);
    }, [currentPage]);

    const handleEdit = (id: string) => {
        const category = categories.find(c => c.id === id);
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        const category = categories.find(c => c.id === id);
        setCategoryToDelete(category!);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            const updatedCategories = categories.filter(c => c.id !== categoryToDelete.id);
            setCategories(updatedCategories);
            toast.success('Category deleted successfully', { autoClose: 1000 });
            setCategoryToDelete(null);
        }
    };

    const handleAddCategory = (categoryData: any) => {
        const newCategory = {
            id: (categories.length + 1).toString(),
            name: categoryData.name,
            stock: 0
        };
        // setCategories([...categories, newCategory]);
        // toast.success('Category added successfully', { autoClose: 1000 });
    };

    const handleUpdateCategory = (categoryData: any) => {
        const updatedCategories = categories.map(c => {
            if (c.id === categoryData.id) {
                return {
                    ...c,
                    name: categoryData.name
                };
            }
            return c;
        });
        setCategories(updatedCategories);
        toast.success('Category updated successfully', { autoClose: 1000 });
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Add Category</span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <CategoryTable
                        categories={categories}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                    <div className="p-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>

                <AddCategoryModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddCategory}
                />

                <EditCategoryModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdateCategory}
                    category={selectedCategory}
                />

                <DeleteConfirmationModal
                    isOpen={!!categoryToDelete}
                    onClose={() => setCategoryToDelete(null)}
                    onConfirm={confirmDelete}
                    itemName={categoryToDelete?.name || ''}
                />
            </div>
        </MotionPageWrapper>
    );
};

export default Categories;