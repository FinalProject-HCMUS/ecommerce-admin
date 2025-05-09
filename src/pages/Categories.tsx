/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Pagination from '../components/common/Pagination';
import CategoryTable from '../components/category/CategoryTable';
import { getCategories } from '../apis/categoryApi';
import { toast } from 'react-toastify';
import MotionPageWrapper from '../components/common/MotionPage';
import { Category } from '../types/category/Category';
import { useNavigate } from 'react-router-dom';


const ITEMS_PER_PAGE = 10;

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    const fetchCategories = async (page: number) => {
        const response = await getCategories(page - 1, ITEMS_PER_PAGE);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        if (response.data?.content) {
            setCategories(response.data.content);
            setTotalPages(response.data.totalPages || 0);
        }
    };

    useEffect(() => {
        fetchCategories(currentPage);
    }, [currentPage]);
    const refresh = () => {
        fetchCategories(1);
        setCurrentPage(1);
    }

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
                    <button
                        onClick={() => {
                            navigate("/categories/add");
                        }
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Add Category</span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <CategoryTable
                        refresh={refresh}
                        categories={categories}
                    />
                    <div className="p-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </MotionPageWrapper >
    );
};

export default Categories;