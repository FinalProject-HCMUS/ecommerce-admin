import React, { useEffect, useState } from "react";
import MotionPageWrapper from "../../components/common/MotionPage";
import { Clock } from "lucide-react";
import IncompleteOrderTable from "../../components/statistics/IncompleteOrderTable";
import { IncompletedOrder } from "../../types/statistics/IncompletedOrder";
import { getIncompleteOrders } from "../../apis/statisticsApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const VND_TO_USD = import.meta.env.VITE_VND_TO_USD;
const OrderStatistics: React.FC = () => {
    const [orders, setOrders] = useState<IncompletedOrder[]>([]);
    const [estimateRevenue, setEstimateRevenue] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const { t, i18n } = useTranslation('statistics')
    const fetchIncompleteOrders = async () => {
        setLoading(true);
        const response = await getIncompleteOrders();
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000, position: "top-right" });
            return;
        }
        if (response.data) {
            setOrders(response.data.orders);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchIncompleteOrders();
    }, []);
    useEffect(() => {
        const totalRevenue = orders.reduce((acc, order) => acc + order.revenue, 0);
        setEstimateRevenue(totalRevenue);
    }, [orders]);
    return (
        <MotionPageWrapper>
            <div className="p-8 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-8">{t('statistics')}</h1>
                <div className="bg-white shadow-xl rounded-2xl p-8">
                    {loading ? <div className="flex justify-center items-center h-[400px]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                    </div> : <div>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                            <div className="flex items-center gap-2">
                                <Clock className="text-yellow-500 mb-3" size={28} />
                                <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">{t('incompletedOrders')}</h2>
                            </div>
                            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 shadow-sm">
                                <span className="text-green-600 font-bold text-lg">{t('estimatedRevenue')}:</span>
                                <span className="text-2xl font-bold text-green-700 tracking-tight">
                                    {i18n.language === 'vi'
                                        ? estimateRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                        : (estimateRevenue / VND_TO_USD).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}

                                </span>
                            </div>
                        </div>
                        {/* Order Table */}
                        <IncompleteOrderTable orders={orders} />
                        {/* Pagination
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div> */}
                    </div>}
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default OrderStatistics;