import React, { useEffect, useState } from 'react';
import TopProductTable from '../../components/statistics/TopProductTable';
import MotionPageWrapper from '../../components/common/MotionPage';
import { BestSellerProduct } from '../../types/statistics/BestSellerProduct';
import { getBestSellerProduct } from '../../apis/statisticsApi';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';

const TopProduct: React.FC = () => {
    const [products, setProducts] = useState<BestSellerProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [type, setType] = useState('month');
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [selectedYear, setSelectedYear] = useState<Date>(new Date());
    const { t } = useTranslation("statistics");
    const fetchTopProductData = async (type: string, date: string) => {
        setLoading(true);
        const response = await getBestSellerProduct(type, date);
        setLoading(false);
        if (!response.isSuccess) {
            toast.error(response.message, { position: "top-right", autoClose: 1000 });
            return;
        }
        if (response.data) {
            setProducts(response.data.products);
            setLoading(false);
        }
    }
    useEffect(() => {
        const date = type === "month" ? String(selectedMonth.getMonth() + 1).padStart(2, "0") + "-" + selectedMonth.getFullYear() : selectedYear.getFullYear() + "";
        fetchTopProductData(type, date);
    }, [selectedMonth, type, selectedYear]);
    return (
        <MotionPageWrapper>
            <div className="p-8 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-6">{t('statistics')}</h1>
                <div className="bg-white shadow-lg rounded-2xl p-6">
                    {loading ? <div className="flex justify-center items-center h-[400px]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                    </div> : <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">{t('topProductsSold')}</h2>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">{t('sortBy')}</span>
                                    {type === "month" ? (
                                        <DatePicker
                                            selected={selectedMonth}
                                            onChange={date => setSelectedMonth(date as Date)}
                                            showMonthYearPicker
                                            dateFormat="MM/yyyy"
                                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[100px]"
                                            placeholderText="Month"
                                            renderMonthContent={(month) => (
                                                <span>{month + 1}</span>
                                            )}
                                        />
                                    ) : (
                                        <DatePicker
                                            selected={selectedYear}
                                            onChange={date => setSelectedYear(date as Date)}
                                            showYearPicker
                                            dateFormat="yyyy"
                                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[100px]"
                                            placeholderText="Year"
                                        />
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <select
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={type}
                                        onChange={e => setType(e.target.value)}
                                    >
                                        <option value="month">{t('month')}</option>
                                        <option value="year">{t('year')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* Top Product Table */}
                        <TopProductTable products={products} />
                    </div>}
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default TopProduct;