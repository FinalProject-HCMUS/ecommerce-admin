import { Plus } from "lucide-react";
import MotionPageWrapper from "../../components/common/MotionPage";
import Pagination from "../../components/common/Pagination";
import ColorTable from "../../components/color/ColorTable";
import { useEffect, useState } from "react";
import { Color } from "../../types/color/Color";
import { getColors } from "../../apis/colorApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;
const Colors = () => {
    const [colors, setColors] = useState<Color[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const fetchColors = async (page: number) => {
        const response = await getColors(page - 1, ITEMS_PER_PAGE);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        if (response.data) {
            setColors(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        }
    }
    useEffect(() => {
        fetchColors(currentPage);
    }, [currentPage])
    const refresh = () => {
        fetchColors(1);
        setCurrentPage(1);
    }
    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Colors</h1>
                    <button
                        onClick={() => navigate('/colors/add')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Add Color</span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <ColorTable
                        refresh={refresh}
                        colors={colors}
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
export default Colors;