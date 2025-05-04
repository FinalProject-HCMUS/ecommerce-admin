import React from 'react';
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
import { Line } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// Register required components for Chart.js
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

const Statistics: React.FC = () => {
    // Mock data for the charts
    const revenueData = {
        labels: ['5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k'],
        datasets: [
            {
                label: 'Revenue',
                data: [20, 40, 60, 100, 80, 50, 70, 90, 60, 80, 70, 50],
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const productCategoryData = {
        labels: ['Winter', 'Office', 'Casual', 'Trendy', 'Sportswear'],
        datasets: [
            {
                data: [24, 28, 18, 21, 9],
                backgroundColor: ['#34D399', '#60A5FA', '#F87171', '#A78BFA', '#FBBF24'],
                hoverBackgroundColor: ['#34D399', '#60A5FA', '#F87171', '#A78BFA', '#FBBF24'],
            },
        ],
    };

    const orderStatusData = {
        labels: ['Completed', 'Canceled', 'Pending'],
        datasets: [
            {
                data: [40, 25, 35],
                backgroundColor: ['#34D399', '#F87171', '#60A5FA'],
                hoverBackgroundColor: ['#34D399', '#F87171', '#60A5FA'],
            },
        ],
    };


    const lineChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 2,
    };

    const doughnutChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 2,
    };

    return (
        <motion.div
            className="flex-1 bg-gray-100 p-8"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
        >
            {/* Header */}
            <motion.div className="mb-8" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <h1 className="text-2xl font-semibold text-gray-900">Statistics</h1>
            </motion.div>

            {/* Revenue Chart */}
            <motion.div className="bg-white rounded-lg shadow p-6 mb-8" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Detailed Revenue</h2>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg">
                        <option>October</option>
                        <option>September</option>
                        <option>August</option>
                    </select>
                </div>
                <div className="h-95"> {/* Set a fixed height for the chart */}
                    <Line data={revenueData} options={lineChartOptions} />
                </div>
            </motion.div>

            {/* Doughnut Charts */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                {/* Product Categories */}
                <motion.div className="bg-white rounded-lg shadow p-6" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h2>
                    <div className="h-60"> {/* Set a fixed height for the chart */}
                        <Doughnut data={productCategoryData} options={doughnutChartOptions} />
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4">Total products: 3000</p>
                </motion.div>

                {/* Order Statistics */}
                <motion.div className="bg-white rounded-lg shadow p-6" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Order Statistics</h2>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg">
                            <option>October</option>
                            <option>September</option>
                            <option>August</option>
                        </select>
                    </div>
                    <div className="h-60"> {/* Set a fixed height for the chart */}
                        <Doughnut data={orderStatusData} options={doughnutChartOptions} />
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4">Total orders: 3000</p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Statistics;