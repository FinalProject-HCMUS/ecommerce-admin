/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Pagination from '../components/common/Pagination';
import CategoryTable from '../components/category/CategoryTable';
import { getCategories } from '../apis/categoryApi';
import { toast } from 'react-toastify';
import MotionPageWrapper from '../components/common/MotionPage';
import { Category } from '../types/category/Category';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const ITEMS_PER_PAGE = 10;

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation('category');

    const fetchCategories = async (page: number, keysearch = '') => {
        const response = await getCategories(page - 1, ITEMS_PER_PAGE, keysearch);
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
        fetchCategories(currentPage, search);
    }, [currentPage, search]);
    const refresh = () => {
        fetchCategories(1, search);
        setCurrentPage(1);
    }
    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setSearch(searchInput.trim());
            setCurrentPage(1);
        }
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{t('category')}</h1>
                </div>
                <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('search')}
                            value={searchInput}
                            size={25}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"

                        >
                            <Search size={18} />
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            navigate("/categories/add");
                        }
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>{t('addCategory')}</span>
                    </button>
                </div>
                <div className="bg-white rounded-2xl shadow-lg">
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