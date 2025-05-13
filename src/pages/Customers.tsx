import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MotionPageWrapper from "../components/common/MotionPage";
import Pagination from "../components/common/Pagination";
import CustomerTable from "../components/customer/CustomerTable";
import { Plus } from "lucide-react";
import { User } from "../types/customer/User";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../apis/userApi";

const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;
const Customers = () => {
    const [customers, setCustomers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const fetchCustomers = async (page: number) => {
        const response = await getUsers(page - 1, ITEMS_PER_PAGE);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        if (response.data) {
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
                    <h1 className="text-2xl font-semibold text-gray-900">{t('customerSidebar')}</h1>
                    <button
                        onClick={() => navigate('/customers/add')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>{t('addCustomer')}</span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <CustomerTable
                        customers={customers}
                        refresh={refresh}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </MotionPageWrapper>
    )
}
export default Customers;