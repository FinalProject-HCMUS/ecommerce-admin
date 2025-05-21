/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import OrderTable from '../components/order/OrderTable';
import Pagination from '../components/common/Pagination';
import MotionPageWrapper from '../components/common/MotionPage';
import { toast } from 'react-toastify';
import { Order } from '../types/order/Order';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../apis/orderApi';
import { useTranslation } from 'react-i18next';

const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation("order")
    const fetchOrders = async (page: number) => {
        setLoading(true);
        const response = await getOrders(page - 1, ITEMS_PER_PAGE);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        if (response.data) {
            setLoading(false);
            setOrders(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);
    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{t('order')}</h1>
                    <button
                        onClick={() => navigate('/orders/add/information')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        {t('addNewOrder')}
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg">
                    {loading ? <div className="flex justify-center items-center h-[400px]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                    </div> : <>
                        <OrderTable orders={orders} />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>}
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default Orders;