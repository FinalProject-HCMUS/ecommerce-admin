import React, { useEffect, useState } from "react";
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
import { ProductCategoryResponse } from "../../types/statistics/ProductCategoryResponse";
import { getProductCategories } from "../../apis/statisticsApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

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

const ProductCategories: React.FC = () => {
    const [productCategories, setProductCategories] = useState<ProductCategoryResponse>(
        {
            categories: [],
            data: []
        }
    );
    const [loading, setLoading] = useState<boolean>(true);
    const { t } = useTranslation("statistics");
    const fetchProductCategories = async () => {
        setLoading(true);
        const response = await getProductCategories();
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000, position: "top-right" });
            return;
        }
        if (response.data) {
            setProductCategories(response.data);
            setLoading(false);
        }
    }
    const generateColors = (count: number) => {
        {
            return Array.from({ length: count }, (_, i) =>
                `hsl(${Math.round((360 / count) * i)}, 70%, 55%)`
            );
        }
    }
    const generateHoverColors = (count: number) => {
        return Array.from({ length: count }, (_, i) =>
            `hsl(${Math.round((360 / count) * i)}, 70%, 40%)`
        );
    }
    useEffect(() => {
        fetchProductCategories();
    }, []);
    const productCategoryLabels = productCategories!.categories;
    const productCategoryDataArr = productCategories!.data;
    const totalProducts = productCategoryDataArr.reduce((a, b) => a + b, 0);

    const productCategoryData = {
        labels: productCategoryLabels,
        datasets: [
            {
                data: productCategoryDataArr,
                backgroundColor: generateColors(productCategoryLabels.length),
                hoverBackgroundColor: generateHoverColors(productCategoryLabels.length),
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

    return (
        <MotionPageWrapper>
            <div className="p-8 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-8">{t('statistics')}</h1>
                <motion.div
                    className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center tracking-tight">{t('productCategory')}</h2>

                    {loading ? (
                        <div className="flex justify-center items-center h-[400px]">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                        </div>
                    ) : <div className="flex flex-col md:flex-row items-center justify-center gap-8">
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
                                    const percent = ((value / totalProducts) * 100).toFixed(1);
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
                                {t('totalProducts')}: <span className="text-blue-600">{totalProducts}</span>
                            </div>
                        </div>
                    </div>}
                </motion.div>
            </div>
        </MotionPageWrapper>
    );
};

export default ProductCategories;