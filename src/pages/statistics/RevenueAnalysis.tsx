import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import MotionPageWrapper from '../../components/common/MotionPage';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { RevenueResponse } from '../../types/statistics/RevenueResponse';
import { getRevenueResponse } from '../../apis/statisticsApi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);
const VND_TO_USD = import.meta.env.VITE_VND_TO_USD;
const RevenueAnalysis: React.FC = () => {
    const [revenueResponse, setRevenueResponse] = useState<RevenueResponse>(
        {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            revenues: [],
            totalIncome: [0, 0],
            totalExpense: [0, 0],
            totalBalance: [0, 0]
        }
    );
    const [type, setType] = useState('month');
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [selectedYear, setSelectedYear] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation("statistics");
    const fetchRevenueData = async (type: string, date: string) => {
        setLoading(true);
        const response = await getRevenueResponse(type, date);
        setLoading(false);
        if (!response.isSuccess) {
            toast.error(response.message, { position: "top-right", autoClose: 1000 });
            return;
        }
        if (response.data) {
            setRevenueResponse(response.data);
        }
    }
    useEffect(() => {
        const date = type === "month" ? String(selectedMonth.getMonth() + 1).padStart(2, "0") + "-" + selectedMonth.getFullYear() : selectedYear.getFullYear() + "";
        console.log(date);

        fetchRevenueData(type, date);
    }, [selectedMonth, selectedYear, type]);
    const revenueData = {
        labels: revenueResponse?.labels.map((label: number) => {
            return type === "month" ? String(label).padStart(2, "0") + "-" + String(selectedMonth.getMonth() + 1).padStart(2, "0") : label.toString();
        }),
        datasets: [
            {
                label: 'Revenue',
                data: revenueResponse?.revenues,
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#4F46E5',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#4F46E5',
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const lineChartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.raw}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: number) => `${value}`,
                },
            },
        },
    };

    return (
        <MotionPageWrapper>
            <div className="p-8 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-8">{t('revenueStatistics')}</h1>
                <div className="bg-white shadow-lg rounded-2xl p-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-[400px]">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                        </div>
                    ) : (<>
                        {/* Metrics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            <div className="flex items-center p-5 rounded-xl bg-gradient-to-r from-green-100 to-green-50 shadow">
                                <div className="bg-green-500 text-white rounded-full p-3 mr-4">
                                    <ArrowUpRight size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium">{t('income')}</div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {i18n.language === 'vi'
                                            ? revenueResponse.totalIncome[0].toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                            : (revenueResponse.totalIncome[0] / VND_TO_USD).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
                                </div>
                            </div>
                            <div className="flex items-center p-5 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-50 shadow">
                                <div className="bg-yellow-400 text-white rounded-full p-3 mr-4">
                                    <ArrowDownRight size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium">{t('expense')}</div>
                                    <div className="text-2xl font-bold text-yellow-500">
                                        {i18n.language === 'vi'
                                            ? revenueResponse.totalExpense[0].toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                            : (revenueResponse.totalExpense[0] / VND_TO_USD).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center p-5 rounded-xl bg-gradient-to-r from-blue-100 to-blue-50 shadow">
                                <div className="bg-blue-600 text-white rounded-full p-3 mr-4">
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium">{t('balance')}</div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {i18n.language === 'vi'
                                            ? revenueResponse.totalBalance[0].toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                            : (revenueResponse.totalBalance[0] / VND_TO_USD).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Chart Card */}
                        <div className="bg-white rounded-xl p-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 text-center md:text-left mb-4 md:mb-0">
                                    {t('revenueTrend')} ({type === "month" ? t('monthly') : t('yearly')})
                                </h2>
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
                            <div className="h-[400px]">
                                <Line data={revenueData} options={lineChartOptions} />
                            </div>
                        </div>
                    </>)}
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default RevenueAnalysis;