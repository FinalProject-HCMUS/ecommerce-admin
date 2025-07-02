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
import { Select } from 'antd';
import { OrderStatus } from '../types/order/OrderStatus';
import { PaymentMethod } from '../types/order/PaymentMethod';
import React from 'react';
const { Option } = Select;
const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    const navigate = useNavigate();
    const { t } = useTranslation("order")

    const fetchOrders = async (page: number, status: string, paymentMethod: string, keyword: string) => {
        setLoading(true);
        const response = await getOrders(page - 1, ITEMS_PER_PAGE, status, paymentMethod, keyword);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            setLoading(false);
            return;
        }
        if (response.data) {
            setLoading(false);
            setOrders(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders(currentPage, selectedStatus, selectedPaymentMethod, search);
    }, [currentPage, selectedStatus, selectedPaymentMethod, search]);

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        setCurrentPage(1);
    };
    const handlePaymentMethodChange = (value: string) => {
        setSelectedPaymentMethod(value);
        setCurrentPage(1);
    };
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearch(searchInput.trim());
            setCurrentPage(1);
        }
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-2xl font-semibold text-gray-900">{t('order')}</h1>
                    <button
                        onClick={() => navigate('/orders/add/information')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        {t('addNewOrder')}
                    </button>
                </div>
                {/* Search order */}
                <div className="relative mb-3">
                    <input
                        type="text"
                        placeholder={t('searchOrder')}
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        className="border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {/* Status Filter */}
                <div className="mb-2 flex flex-col md:flex-row md:items-center gap-4">
                    <Select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        style={{ width: 220, height: 50 }}
                        optionLabelProp="label"
                        placeholder={t('allStatus') || 'All Status'}
                    >
                        <Option value="" label={t('allStatus') || 'All Status'}>
                            {t('allStatus') || 'All Status'}
                        </Option>
                        {Object.values(OrderStatus).map(status => (
                            <Option key={status} value={status} label={t(status) || status}>
                                {t(status) || status}
                            </Option>
                        ))}
                    </Select>
                    {/* Payment method filter */}
                    <Select
                        value={selectedPaymentMethod}
                        onChange={handlePaymentMethodChange}
                        style={{ width: 240, height: 50 }}
                        optionLabelProp="label"
                        placeholder={t('allPaymentMethods') || 'All Payment Methods'}
                    >
                        <Option value="" label={t('allPaymentMethods') || 'All Payment Methods'}>
                            {t('allPaymentMethods') || 'All Payment Methods'}
                        </Option>
                        {Object.values(PaymentMethod).map(payment => (
                            <Option key={payment} value={payment} label={t(payment) || payment}>
                                {t(payment) || payment}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className="bg-white rounded-lg shadow">
                    {loading ? <div role='status' className="flex justify-center items-center h-[400px]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                    </div> : <><OrderTable orders={orders} />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        /></>}
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default Orders;