import { Plus } from "lucide-react";
import MotionPageWrapper from "../../components/common/MotionPage";
import Pagination from "../../components/common/Pagination";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Size } from "../../types/size/Size";
import { getSizes } from "../../apis/sizeApi";
import SizeTable from "../../components/size/SizeTable";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;
const Sizes = () => {
    const [sizes, setsizes] = useState<Size[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const fetchsizes = async (page: number) => {
        const response = await getSizes(page - 1, ITEMS_PER_PAGE);
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
        fetchsizes(currentPage);
    }, [currentPage])
    const refresh = () => {
        fetchsizes(1);
        setCurrentPage(1);
    }
    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Sizes</h1>
                    <button
                        onClick={() => navigate('/sizes/add')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-sizes"
                    >
                        <Plus size={20} />
                        <span>Add Size</span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <SizeTable
                        refresh={refresh}
                        sizesProp={sizes}
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