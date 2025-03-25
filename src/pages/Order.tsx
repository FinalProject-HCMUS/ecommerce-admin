/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import OrderTable from '../components/order/OrderTable';
import Pagination from '../components/common/Pagination';
import { Order, OrderDetail } from '../types';
import MotionPageWrapper from '../components/common/MotionPage';
import { getOrders, getOrderDetails } from '../apis/orderApi';
import EditOrderModal from '../components/order/EditOrderModal';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 10;

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetail | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        // Fetch orders
        getOrders().then((data) => {
            setOrders(data);
        });
    }, []);

    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

    const getCurrentPageOrders = () => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return orders.slice(start, end);
    };

    const handleEditOrder = async (id: string) => {
        const order = orders.find((order) => order.id === id);
        if (order) {
            setSelectedOrder(order);
            const details = await getOrderDetails(id);
            setOrderDetails(details);
            setIsEditModalOpen(true);
        }
    };

    const handleUpdateOrder = (updatedOrder: Order) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
        );
        setIsEditModalOpen(false);
        toast.success('Order updated successfully', { autoClose: 1000 });
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
                    <button
                        onClick={() => alert('Add Order functionality not implemented yet')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add New Order
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <OrderTable orders={getCurrentPageOrders()} onEdit={handleEditOrder} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {isEditModalOpen && selectedOrder && (
                <EditOrderModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    order={selectedOrder}
                    orderDetails={orderDetails}
                    onSubmit={handleUpdateOrder}
                />
            )}
        </MotionPageWrapper>
    );
};

export default Orders;