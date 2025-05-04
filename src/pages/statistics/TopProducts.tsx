import React from 'react';
import TopProductTable from '../../components/statistics/TopProductTable';

const TopProduct: React.FC = () => {
    const products = Array(4).fill({
        id: '1',
        name: 'Áo thu đông',
        price: '1200k',
        sold: 154,
        revenue: '184800k',
        imageUrl: 'https://via.placeholder.com/150', // Replace with actual image URL
    });

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-semibold mb-6">Statistic</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Top Product Sell</h2>
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

                {/* Top Product Table */}
                <TopProductTable products={products} />
            </div>
        </div>
    );
};

export default TopProduct;