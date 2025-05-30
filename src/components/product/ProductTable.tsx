import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Product } from '../../types/product/Product';
import DeleteConfirmationModal from '../common/DeleteConfirm';
import { useNavigate } from 'react-router-dom';
import { deleteProduct } from '../../apis/productApi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface ProductTableProps {
  products: Product[];
  refresh(): void;
}

const VND_TO_USD = import.meta.env.VITE_VND_TO_USD;
const ProductTable: React.FC<ProductTableProps> = ({ products, refresh }) => {
  const naviate = useNavigate();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { t, i18n } = useTranslation('product');
  const handleDeleteClick = (id: string) => {
    setSelectedProductId(id);
    setIsDeleteConfirmOpen(true); // Open the confirmation dialog
  };
  const handleConfirmDelete = async () => {
    const response = await deleteProduct(selectedProductId!);
    if (!response.isSuccess) {
      alert(response.message);
      return;
    }
    toast.success("Product deleted successfully", {
      autoClose: 1000,
    });
    refresh();
    setIsDeleteConfirmOpen(false);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('product')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('category')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('price')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('stock')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('enable')}</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('action')}</th>
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
                <div className="text-sm text-gray-900">
                  {i18n.language === 'vi'
                    ? product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                    : (product.price / VND_TO_USD).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product.total}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.enable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {product.enable ? 'Enabled' : 'Disabled'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => {
                    naviate(`/products/edit/${product.id}/information`);
                  }}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDeleteClick(product.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <DeleteConfirmationModal
          title='Delete Product'
          isOpen={isDeleteConfirmOpen}
          onClose={() => { setIsDeleteConfirmOpen(false); }}
          onConfirm={handleConfirmDelete}
        />
      </table>
    </div>
  );
};

export default ProductTable;