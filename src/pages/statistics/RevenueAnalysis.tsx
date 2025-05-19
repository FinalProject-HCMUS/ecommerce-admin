import React from 'react';
import { Line } from 'react-chartjs-2';
import MotionPageWrapper from '../../components/common/MotionPage';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
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

const RevenueAnalysis: React.FC = () => {
    const revenueData = {
        labels: ['17-10', '18-10', '19-10', '20-10', '21-10', '22-10', '23-10', '24-10', '25-10', '26-10', '27-10', '28-10'],
        datasets: [
            {
                label: 'Revenue',
                data: [200, 400, 850, 600, 300, 500, 700, 400, 600, 500, 700, 400],
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
                    label: (context: any) => `${context.raw}k`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: number) => `${value}k`,
                },
            },
        },
    };

    return (
        <MotionPageWrapper>
            <div className="p-8 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-8">Revenue Statistics</h1>
                <div className="bg-white shadow-lg rounded-2xl p-8">
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <div className="flex items-center p-5 rounded-xl bg-gradient-to-r from-green-100 to-green-50 shadow">
                            <div className="bg-green-500 text-white rounded-full p-3 mr-4">
                                <ArrowUpRight size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 font-medium">Income</div>
                                <div className="text-2xl font-bold text-green-600">7,500k</div>
                            </div>
                        </div>
                        <div className="flex items-center p-5 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-50 shadow">
                            <div className="bg-yellow-400 text-white rounded-full p-3 mr-4">
                                <ArrowDownRight size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 font-medium">Expense</div>
                                <div className="text-2xl font-bold text-yellow-500">5,000k</div>
                            </div>
                        </div>
                        <div className="flex items-center p-5 rounded-xl bg-gradient-to-r from-blue-100 to-blue-50 shadow">
                            <div className="bg-blue-600 text-white rounded-full p-3 mr-4">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 font-medium">Balance</div>
                                <div className="text-2xl font-bold text-blue-600">2,000k</div>
                            </div>
                        </div>
                    </div>
                    {/* Chart Card */}
                    <div className="bg-white rounded-xl p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 text-center md:text-left mb-4 md:mb-0">
                                Revenue Trend (Monthly)
                            </h2>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">Sort by</span>
                                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="10-2024">10-2024</option>
                                        <option value="09-2024">09-2024</option>
                                    </select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="month">Month</option>
                                        <option value="week">Year</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="h-[400px]">
                            <Line data={revenueData} options={lineChartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default RevenueAnalysis;