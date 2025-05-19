import React from "react";
import { motion } from 'framer-motion';
import { Doughnut } from "react-chartjs-2";
import MotionPageWrapper from "../../components/common/MotionPage";
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

const productCategoryLabels = ['Winter', 'Office', 'Casual', 'Trendy', 'Sportswear'];
const productCategoryDataArr = [24, 28, 18, 21, 9];
const totalProducts = 3000;

const productCategoryData = {
    labels: productCategoryLabels,
    datasets: [
        {
            data: productCategoryDataArr,
            backgroundColor: ['#34D399', '#60A5FA', '#F87171', '#A78BFA', '#FBBF24'],
            hoverBackgroundColor: ['#059669', '#2563EB', '#DC2626', '#7C3AED', '#F59E42'],
            borderWidth: 2,
        },
    ],
};

const doughnutChartOptions = {
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false, // We'll use a custom legend
        },
        tooltip: {
            callbacks: {
                label: function (context: any) {
                    const label = context.label || '';
                    const value = context.raw;
                    const percent = ((value / productCategoryDataArr.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                    return `${label}: ${value} (${percent}%)`;
                }
            }
        }
    }
};

const ProductCategories: React.FC = () => {
    // Calculate percentages for each category
    const total = productCategoryDataArr.reduce((a, b) => a + b, 0);

    return (
        <MotionPageWrapper>
            <div className="p-8 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-8">Statistic</h1>
                <motion.div
                    className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center tracking-tight">Product Categories</h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        {/* Chart */}
                        <div className="w-full md:w-1/2 h-[350px] flex items-center justify-center">
                            <Doughnut data={productCategoryData} options={doughnutChartOptions} />
                        </div>
                        {/* Custom Legend & Details */}
                        <div className="w-full md:w-1/2 flex flex-col justify-center">
                            <ul className="space-y-4">
                                {productCategoryLabels.map((label, idx) => {
                                    const color = productCategoryData.datasets[0].backgroundColor[idx];
                                    const value = productCategoryDataArr[idx];
                                    const percent = ((value / total) * 100).toFixed(1);
                                    return (
                                        <li key={label} className="flex items-center space-x-3">
                                            <span
                                                className="inline-block w-4 h-4 rounded-full"
                                                style={{ backgroundColor: color as string }}
                                            ></span>
                                            <span className="font-medium text-gray-700">{label}</span>
                                            <span className="ml-auto text-gray-500">{value} ({percent}%)</span>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="mt-8 text-center text-base text-gray-600 font-semibold">
                                Total products: <span className="text-blue-600">{totalProducts}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </MotionPageWrapper>
    );
};

export default ProductCategories;