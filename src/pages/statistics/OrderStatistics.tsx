import React, { useState } from "react";
import OrderTable from "../../components/order/OrderTable";
import Pagination from "../../components/common/Pagination";
import MotionPageWrapper from "../../components/common/MotionPage";
import { Clock } from "lucide-react";

const OrderStatistics: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    const orders = Array(10).fill({
        id: "OR12345",
        firstName: "Nguyễn",
        lastName: "Văn A",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        deliveryDate: "2025-12-12T10:00:00Z",
        paymentMethod: "COD",
        status: "Pending",
        revenue: "1500k",

    });

    const handleEdit = (id: string) => {
        console.log(`Edit order with ID: ${id}`);
    };

    const handleDelete = (id: string) => {
        console.log(`Delete order with ID: ${id}`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <MotionPageWrapper>
            <div className="p-8 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-8">Statistic</h1>
                <div className="bg-white shadow-xl rounded-2xl p-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                        <div className="flex items-center gap-2">
                            <Clock className="text-yellow-500" size={28} />
                            <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Incompleted Order</h2>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 shadow-sm">
                            <span className="text-green-600 font-bold text-lg">Estimated order revenue:</span>
                            <span className="text-2xl font-bold text-green-700 tracking-tight">50,000k</span>
                        </div>
                    </div>
                    {/* Order Table */}
                    <OrderTable orders={orders} />
                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default OrderStatistics;