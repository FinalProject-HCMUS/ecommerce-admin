import React, { useState } from 'react';
import { Product } from '../../types';
import MotionModalWrapper from '../common/MotionModal';
import Pagination from '../common/Pagination';
import { X } from 'lucide-react';

interface ProductSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    onSelect: (selectedProducts: Product[]) => void;
}

const ITEMS_PER_PAGE = 5; // Number of products per page

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({ isOpen, onClose, products, onSelect }) => {
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    const handleToggleProduct = (product: Product) => {
        if (selectedProducts.find((p) => p.id === product.id)) {
            setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
        } else {
            setSelectedProducts((prev) => [...prev, product]);
        }
    };

    const handleSubmit = () => {
        onSelect(selectedProducts);
        onClose();
    };

    const getCurrentPageProducts = () => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return products.slice(start, end);
    };

    if (!isOpen) return null;

    return (
        <MotionModalWrapper>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-4xl mx-4">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800">Select Products</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Select
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getCurrentPageProducts().map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={product.main_image_url || './images/sample.png'}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <input
                                                type="checkbox"
                                                checked={!!selectedProducts.find((p) => p.id === product.id)}
                                                onChange={() => handleToggleProduct(product)}
                                                className="form-checkbox h-5 w-5 text-blue-600"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>

                    <div className="flex justify-end p-6 space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Add Selected
                        </button>
                    </div>
                </div>
            </div>
        </MotionModalWrapper>
    );
};

export default ProductSelectionModal;