import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProductColorSize } from '../../types/product/ProductColorSize';
import { getProductColorSizes } from '../../apis/productApi';

interface ProductColorSizeProps {
    isOpen: boolean;
    productId: string;
    onClose: () => void;
    onPick: (variants: ProductColorSize) => void;
    productColorSizesSelected: ProductColorSize[];
}


const ProductColorSizeDialog: React.FC<ProductColorSizeProps> = ({ isOpen, onClose, onPick, productColorSizesSelected, productId }) => {
    const [variants, setVariants] = useState<ProductColorSize[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation('order');
    const fetchProductColorSizes = async (id: string) => {
        setLoading(true);
        const productColorSizesResponse = await getProductColorSizes(id);
        if (!productColorSizesResponse.isSuccess) {
            toast.error('Failed to fetch product color sizes', { autoClose: 1000, position: 'top-right' });
            setLoading(false);
            return;
        }
        setLoading(false);
        setVariants(productColorSizesResponse.data || []);
    };

    useEffect(() => {
        if (isOpen) {
            fetchProductColorSizes(productId);
        }
    }, [isOpen, productId]);

    const selectedVariantsId = new Set(productColorSizesSelected.map(c => c.id));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-2">
                <div className="flex items-center justify-between mb-6 border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">{t('variants')}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>


                {/* Product color size table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">STT</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">{t('color')}</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">{t('size')}</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">{t('quantity')}</th>
                            </tr>
                        </thead>
                        {loading ? <tbody>
                            <tr>
                                <td colSpan={4}>
                                    <div className="flex justify-center items-center h-[200px]">
                                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody> : <tbody className="bg-white divide-y divide-gray-100">
                            {variants.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 text-gray-400">
                                        {t('noData')}
                                    </td>
                                </tr>
                            )}
                            {variants.map((variant, index) => {
                                const isAlreadySelected = selectedVariantsId.has(variant.id);
                                return (
                                    <tr
                                        key={variant.id}
                                        className={`transition-colors duration-150 
                                            ${isAlreadySelected ? 'bg-blue-200 cursor-not-allowed opacity-60' : 'hover:bg-blue-200 cursor-pointer'}
                                             }
                                        `}
                                        onClick={() => {
                                            if (isAlreadySelected) return;
                                            setSelectedId(variant.id);
                                            setTimeout(() => {
                                                onPick(variant);
                                                onClose();
                                            }, 120);
                                        }}
                                    >
                                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{index + 1}</td>
                                        <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                            <div className="flex items-center">
                                                <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: variant.color!.code }}></div>
                                                <span className="ml-3 text-sm text-gray-900">{variant.color!.name}</span>
                                            </div></td>
                                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{variant.size!.name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{variant.quantity}</td>
                                    </tr>
                                );
                            })}
                        </tbody>}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductColorSizeDialog;