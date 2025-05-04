import React from 'react';
import { Line } from 'react-chartjs-2';
import MotionPageWrapper from '../../components/common/MotionPage';

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
            legend: {
                display: false,
            },
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
            <div className="p-8 bg-gray-100">
                <h1 className="text-3xl font-semibold mb-6">Statistic</h1>
                <div className="bg-white  shadow p-6">
                    <div className="mb-6">
                        <h1 className="text-xl font-semibold text-center">Analysis Revenue</h1>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-8">
                            <div className="text-sm">
                                <span className="block font-medium text-gray-700">Income</span>
                                <span className="text-green-500 font-semibold">7500k</span>
                            </div>
                            <div className="text-sm">
                                <span className="block font-medium text-gray-700">Expense</span>
                                <span className="text-yellow-500 font-semibold">5000k</span>
                            </div>
                            <div className="text-sm">
                                <span className="block font-medium text-gray-700">Balance</span>
                                <span className="text-green-500 font-semibold">2000k</span>
                            </div>
                        </div>
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

                    <div className="h-[500px]">
                        <Line data={revenueData} options={lineChartOptions} />
                    </div>
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default RevenueAnalysis;