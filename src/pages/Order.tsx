/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import OrderTable from '../components/order/OrderTable';
import Pagination from '../components/common/Pagination';
import MotionPageWrapper from '../components/common/MotionPage';
import { deleteOrder, getOrderDetail, getOrders, updateOrder } from '../apis/orderApi';
import EditOrderModal from '../components/order/EditOrderModal';
import { toast } from 'react-toastify';
import AddOrderModal from '../components/order/AddOrderModal';
import DeleteConfirmationModal from '../components/common/DeleteConfirm';
import { Order } from '../types/order/Order';
import { OrderDetail } from '../types/order/OrderDetail';
import { OrderRequestUpdate } from '../types/order/OrderRequestUpdate';
import { OrderDetailRequest } from '../types/order/OrderDetailResponse';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
    const [orderToDelete, setOrderToDelete] = useState<Order | undefined>();
    const navigate = useNavigate();
    const fetchOrders = async (page: number) => {
        const response = await getOrders(page - 1, ITEMS_PER_PAGE);
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
            const response = await getOrderDetail(id);
            if (!response.isSuccess) {
                toast.error(response.message, { autoClose: 1000 });
                return;
            }
            if (response.data) {
                setOrderDetails(response.data);
                setSelectedOrder(order);
                setIsEditModalOpen(true);
            }

        }
    };
    const handleDeleteOrder = (id: string) => {
        const order = orders.find((order) => order.id === id);
        setOrderToDelete(order);
    };
    const handleAddOrder = (newOrder: OrderRequestUpdate, orderDetails: OrderDetailRequest[]) => {

        console.log(orderDetails);

        //add new order
        //get order id and add order details
        setIsAddModalOpen(false); // Close the AddOrderModal
        toast.success('Order added successfully', { autoClose: 1000 }); // Show a success toast notification
    };
    const handleUpdateOrder = async (id: string, updatedOrder: OrderRequestUpdate) => {
        const response = await updateOrder(id, updatedOrder);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        fetchOrders(currentPage);
        setIsEditModalOpen(false);
        toast.success('Order updated successfully', { autoClose: 1000 });
    };
    const confirmDelete = async () => {
        if (orderToDelete) {
            const response = await deleteOrder(orderToDelete.id);
            if (!response.isSuccess) {
                toast.error(response.message, { autoClose: 1000 });
                return;
            }
            fetchOrders(currentPage);
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
                        onClick={() => navigate('/orders/add/information')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add New Order
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <OrderTable orders={orders} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {selectedOrder && <EditOrderModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedOrder(undefined);
                    setOrderDetails(undefined);
                }}
                order={selectedOrder}
                orderDetails={orderDetails || []}
                onSubmit={handleUpdateOrder}
            />}


        </MotionPageWrapper>
    );
};

export default Orders;