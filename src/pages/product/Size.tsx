import { Plus } from "lucide-react";
import MotionPageWrapper from "../../components/common/MotionPage";
import Pagination from "../../components/common/Pagination";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Size } from "../../types/size/Size";
import { getSizes } from "../../apis/sizeApi";
import SizeTable from "../../components/size/SizeTable";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;
const Sizes = () => {
    const [sizes, setsizes] = useState<Size[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const { t } = useTranslation('size');
    const fetchsizes = async (page: number, keysearch = '') => {
        const response = await getSizes(page - 1, ITEMS_PER_PAGE, keysearch);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        if (response.data) {
            setsizes(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        }
    }
    useEffect(() => {
        fetchsizes(currentPage, search);
    }, [currentPage, search])
    const refresh = () => {
        fetchsizes(1, search);
        setCurrentPage(1);
    }
    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setSearch(searchInput.trim());
            setCurrentPage(1);
        }
    }
    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">{t('size')}</h1>
                </div>
                <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder={t('search')}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={() => navigate('/sizes/add')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-sizes"
                    >
                        <Plus size={20} />
                        <span>{t('addSize')}</span>
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow">
                    <SizeTable
                        refresh={refresh}
                        sizes={sizes}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </MotionPageWrapper>
    );
}
export default Sizes;