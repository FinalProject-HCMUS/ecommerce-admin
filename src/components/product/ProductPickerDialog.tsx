import { MousePointer2 } from "lucide-react";
import { Product } from "../../types/product/Product";
import { useTranslation } from "react-i18next";

interface ProductTableProps {
    products: Product[];
    onProductSelect: (product: Product) => void;
}

const ProductPickerDialog: React.FC<ProductTableProps> = ({ products, onProductSelect }) => {
    const { t } = useTranslation("order");
    return (
        <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('product')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('category')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('price')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('cost')}</th>
                        <th className="px-6 py-3 text-xs text-left font-medium text-gray-500 uppercase tracking-wider">{t('action')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-16 w-16 flex-shrink-0">
                                        <img className="h-full w-full rounded-lg object-contain" src={product.mainImageUrl} alt={product.name} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{product.categoryName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">${product.price}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{product.cost}</div>
                            </td>
                            <td className="px-10 py-4 whitespace-nowrap">
                                <button
                                    type="button"
                                    className="text-blue-600 hover:text-blue-900"
                                    onClick={() => {
                                        onProductSelect(product);
                                    }}
                                >
                                    <MousePointer2 size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductPickerDialog;