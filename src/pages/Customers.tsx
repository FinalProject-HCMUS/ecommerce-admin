import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MotionPageWrapper from "../components/common/MotionPage";
import Pagination from "../components/common/Pagination";
import CustomerTable from "../components/customer/CustomerTable";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../apis/userApi";
import { User } from "../types/user/User";

const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;
const Customers = () => {
    const [customers, setCustomers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation('user');
    const fetchCustomers = async (page: number) => {
        setLoading(true);
        const response = await getUsers(page - 1, ITEMS_PER_PAGE);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        if (response.data) {
            setLoading(false);
            setCustomers(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        }
    }
    useEffect(() => {
        fetchCustomers(currentPage);
    }, [currentPage])
    const refresh = () => {
        fetchCustomers(currentPage);
        setCurrentPage(1);
    }
    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{t('customers')}</h1>
                    <button
                        onClick={() => navigate('/customers/add')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>{t('addCustomer')}</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg">
                    {loading ? <div className="flex justify-center items-center h-[400px]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                    </div> : <><CustomerTable
                        customers={customers}
                        refresh={refresh}
                    />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        /></>}
                </div>
            </div>
        </MotionPageWrapper>
    )
}
export default Customers;