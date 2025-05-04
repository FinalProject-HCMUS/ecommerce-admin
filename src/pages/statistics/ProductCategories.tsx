import React from "react";
import { motion } from 'framer-motion';
import { Doughnut } from "react-chartjs-2";
import MotionPageWrapper from "../../components/common/MotionPage";
const ProductCategories: React.FC = () => {
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
    const doughnutChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 2,
    };
    return (
        <MotionPageWrapper>
            <div className="p-8 bg-gray-100">
                <h1 className="text-3xl font-semibold mb-6">Statistic</h1>
                <motion.div className="bg-white shadow p-6" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    <h1 className="text-lg font-semibold text-gray-800 mb-4 text-center">Product Categories</h1>
                    <div className="h-[500px]"> {/* Set a fixed height for the chart */}
                        <Doughnut data={productCategoryData} options={doughnutChartOptions} />
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4">Total products: 3000</p>
                </motion.div>
            </div>
        </MotionPageWrapper>


    )
}
export default ProductCategories;