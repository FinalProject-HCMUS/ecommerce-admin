/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import OrderTable from '../components/order/OrderTable';
import Pagination from '../components/common/Pagination';
import { OrderDetail, Product } from '../types';
import MotionPageWrapper from '../components/common/MotionPage';
import { getOrders } from '../apis/orderApi';
import EditOrderModal from '../components/order/EditOrderModal';
import { toast } from 'react-toastify';
import AddOrderModal from '../components/order/AddOrderModal';
import DeleteConfirmationModal from '../components/common/DeleteConfirm';
import { Order } from '../types/order/Order';

const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[] | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
    const [orderToDelete, setOrderToDelete] = useState<Order | undefined>();

    const fetchOrders = async (page: number) => {
        const response = await getOrders(page - 1, ITEMS_PER_PAGE);
        console.log(response);

        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        if (response.data) {
            setOrders(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const handleEditOrder = async (id: string) => {
        const order = orders.find((order) => order.id === id);
        if (order) {
            setSelectedOrder(order);
            // const details = await getOrderDetails(id);
            // setOrderDetails(details);
            // setIsEditModalOpen(true);
        }
    };
    const handleDeleteOrder = (id: string) => {
        const order = orders.find((order) => order.id === id);
        setOrderToDelete(order);
    };
    const handleAddOrder = (newOrder: Order) => {
        setOrders((prevOrders) => [newOrder, ...prevOrders]); // Add the new order to the beginning of the orders list
        setIsAddModalOpen(false); // Close the AddOrderModal
        toast.success('Order added successfully', { autoClose: 1000 }); // Show a success toast notification
    };
    const handleUpdateOrder = (updatedOrder: Order) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
        );
        setIsEditModalOpen(false);
        toast.success('Order updated successfully', { autoClose: 1000 });
    };
    const confirmDelete = () => {
        if (orderToDelete) {
            const updatedOrder = orders.filter(p => p.id !== orderToDelete.id);
            setOrders(updatedOrder);
            toast.success('Order deleted successfully', { autoClose: 1000 });
            setOrderToDelete(undefined);
        }
    };
    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add New Order
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <OrderTable orders={orders} onEdit={handleEditOrder} onDelete={handleDeleteOrder} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {selectedOrder && <EditOrderModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                order={selectedOrder}
                orderDetails={orderDetails || []}
                onSubmit={handleUpdateOrder}
            />}
            <AddOrderModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddOrder}
                products={products}
            />
            <DeleteConfirmationModal
                isOpen={!!orderToDelete}
                onClose={() => setOrderToDelete(undefined)}
                onConfirm={confirmDelete}
                itemName={selectedOrder?.id || ''}
            />
        </MotionPageWrapper>
    );
};

export default Orders;