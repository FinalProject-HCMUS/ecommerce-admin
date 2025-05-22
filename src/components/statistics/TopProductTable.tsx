import React from 'react';
import { BestSellerProduct } from '../../types/statistics/BestSellerProduct';
import { useTranslation } from 'react-i18next';


interface TopProductTableProps {
    products: BestSellerProduct[];
}
const VND_TO_USD = import.meta.env.VITE_VND_TO_USD;
const TopProductTable: React.FC<TopProductTableProps> = ({ products }) => {
    const { t, i18n } = useTranslation("statistics");
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('imageProduct')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('productName')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('price')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('sold')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('revenue')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-16 w-16 flex-shrink-0">
                                    <img className="h-full w-full rounded-lg object-contain" src={product.imageurl} alt={product.name} />
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {i18n.language === 'vi'
                                        ? product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                        : (product.price / VND_TO_USD).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{product.quantitysold}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {i18n.language === 'vi'
                                        ? product.revenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                        : (product.revenue / VND_TO_USD).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopProductTable;