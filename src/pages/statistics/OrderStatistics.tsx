import React, { useState } from "react";
import OrderTable from "../../components/order/OrderTable";
import Pagination from "../../components/common/Pagination";
import MotionPageWrapper from "../../components/common/MotionPage";

const OrderStatistics: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    const orders = Array(10).fill({
        id: "OR12345",
        first_name: "Nguyễn",
        last_name: "Văn A",
        customer: {
            address: "123 Đường ABC, Quận 1, TP.HCM",
        },
        order_time: "2025-12-12T10:00:00Z",
        payment_method: "COD",
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
            <div className="p-8 bg-gray-100">
                <h1 className="text-3xl font-semibold mb-6">Statistic</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Incompleted Order</h2>
                        <div className="text-sm text-gray-500">
                            Estimated order revenue <span className="text-black font-semibold">50000k</span>
                        </div>
                    </div>
                    {/* Order Table */}
                    <OrderTable orders={orders} onEdit={handleEdit} onDelete={handleDelete} />
                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default OrderStatistics;