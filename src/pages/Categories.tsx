/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Pagination from '../components/common/Pagination';
import CategoryTable from '../components/categories/CategoryTable';
import AddCategoryModal from '../components/categories/AddCategoryModal';
import EditCategoryModal from '../components/categories/EditCategoryModal';
import { addCategory, deleteCategory, getCategories, updateCategory } from '../apis/categoryApi';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../components/common/DeleteConfirm';
import MotionPageWrapper from '../components/common/MotionPage';
import { Category } from '../types/category/Category';
import { CategoryRequest } from '../types/category/CategoryRequest';


const ITEMS_PER_PAGE = 10;

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any | undefined>();
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [totalPages, setTotalPages] = useState(0);

    const fetchCategories = async (page: number) => {
        try {
            const response = await getCategories(page - 1, ITEMS_PER_PAGE);
            if (!response.isSuccess) {
                toast.error(response.message, { autoClose: 1000 });
                return;
            }
            if (response.data?.content) {
                setCategories(response.data.content);
                setTotalPages(response.data.totalPages || 0);
            }
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

    const confirmDelete = async () => {
        if (categoryToDelete) {
            const response = await deleteCategory(categoryToDelete.id);
            if (!response.isSuccess) {
                toast.error(response.message, { autoClose: 1000 });
                return;
            }
            toast.success('Category deleted successfully', { autoClose: 1000 });
            setCategoryToDelete(null);
            fetchCategories(currentPage);
        }
    };

    const handleAddCategory = async (categoryData: CategoryRequest) => {
        const response = await addCategory(categoryData);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        toast.success('Category added successfully', { autoClose: 1000 });
        fetchCategories(currentPage);
    };

    const handleUpdateCategory = async (categoryData: any) => {
        const idCategory = selectedCategory.id;
        delete categoryData.id;
        const response = await updateCategory(idCategory, categoryData);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        fetchCategories(currentPage);
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