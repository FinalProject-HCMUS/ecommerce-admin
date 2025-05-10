/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import ProductTable from '../../components/product/ProductTable';
import Pagination from '../../components/common/Pagination';
import { Plus } from 'lucide-react';
import { getProducts } from '../../apis/productApi';
import { toast } from 'react-toastify';
import MotionPageWrapper from '../../components/common/MotionPage';
import { Product } from '../../types/product/Product';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = async (page: number) => {
    const response = await getProducts(page - 1, ITEMS_PER_PAGE);
    if (!response.isSuccess) {
      toast.error(response.message, { autoClose: 1000 });
      return;
    }
    if (response.data) {
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    }
  };
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const navigate = useNavigate(); // Initialize navigate
  const refresh = () => {
    fetchProducts(1);
    setCurrentPage(1);
  }
  const handleAddProduct = () => {
    navigate('/products/add/information');
  };
  return (
    <MotionPageWrapper>
      <div className="flex-1 bg-gray-100 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <ProductTable
            refresh={refresh}
            products={products}

          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </MotionPageWrapper>
  );
};

export default Products;