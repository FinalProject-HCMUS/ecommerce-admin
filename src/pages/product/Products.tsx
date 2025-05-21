import { useState, useEffect } from 'react';
import ProductTable from '../../components/product/ProductTable';
import Pagination from '../../components/common/Pagination';
import { Plus, Search } from 'lucide-react';
import { getProducts } from '../../apis/productApi';
import { toast } from 'react-toastify';
import MotionPageWrapper from '../../components/common/MotionPage';
import { Product } from '../../types/product/Product';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../apis/categoryApi';
import { Category } from '../../types/category/Category';
import { useTranslation } from 'react-i18next';

const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  const { t } = useTranslation('product');
  const fetchProducts = async (page: number, category = '', keysearch = '') => {
    setLoading(true);
    const response = await getProducts(page - 1, ITEMS_PER_PAGE, "createdAt,asc", category, keysearch);
    if (!response.isSuccess) {
      toast.error(response.message, { autoClose: 1000 });
      return;
    }
    if (response.data) {
      setLoading(false);
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, selectedCategory, search);
  }, [currentPage, selectedCategory, search]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      const response = await getAllCategories();
      setLoadingCategories(false);
      if (response.isSuccess && response.data) {
        setCategories(response.data || []);
      }
    };
    fetchCategories();
  }, []);

  const navigate = useNavigate();
  const refresh = () => {
    fetchProducts(1, selectedCategory, search);
    setCurrentPage(1);
  };
  const handleAddProduct = () => {
    navigate('/products/add/information');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearch(searchInput.trim());
      setCurrentPage(1);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <MotionPageWrapper>
      <div className="flex-1 bg-gray-100 p-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{t('products')}</h1>
        </div>
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className='flex gap-4'>
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingCategories}
            >
              <option value="">{t('all')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder={t('search')}
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                onClick={() => {
                  setSearch(searchInput.trim());
                  setCurrentPage(1);
                }}
              >
                <Search size={18} />
              </button>
            </div>
          </div>
          <div>
            {/* Add Product Button */}
            <button
              onClick={handleAddProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>{t('addProduct')}</span>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg">
          {loading ? <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          </div> : <>
            <ProductTable
              refresh={refresh}
              products={products}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>}
        </div>
      </div>
    </MotionPageWrapper>
  );
};

export default Products;