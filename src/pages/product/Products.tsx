import { useState, useEffect } from 'react';
import ProductTable from '../../components/product/ProductTable';
import Pagination from '../../components/common/Pagination';
import { Plus } from 'lucide-react';
import { getProducts } from '../../apis/productApi';
import { toast } from 'react-toastify';
import MotionPageWrapper from '../../components/common/MotionPage';
import { Product } from '../../types/product/Product';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../apis/categoryApi';
import { Category } from '../../types/category/Category';
import { useTranslation } from 'react-i18next';
import { Size } from '../../types/size/Size';
import { Color } from '../../types/color/Color';
import { getSizes } from '../../apis/sizeApi';
import { getColors } from '../../apis/colorApi';
import { Collapse, Select, Slider } from 'antd';
const { Panel } = Collapse;
const { Option } = Select;
import React from 'react';
import { formatPrice } from '../../utils/currency';
const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;
const MIN_PRICE = 0;
const MAX_PRICE = 3000000;


const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSizes, setLoadingSizes] = useState(false);
  const [loadingColors, setLoadingColors] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);
  const { t } = useTranslation('product');
  const fetchProducts = async (page: number, category = '', keysearch = '', size = '', color = '', fromprice = 0, toprice = 0) => {
    setLoading(true);
    const response = await getProducts(page - 1, ITEMS_PER_PAGE, "createdAt,asc", category, keysearch, size, color, fromprice, toprice);
    if (!response.isSuccess) {
      toast.error(response.message, { autoClose: 1000 });
      return;
    }
    if (response.data) {
      setLoading(false);
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, selectedCategory, search, selectedSize, selectedColor, priceRange[0], priceRange[1]);

  }, [currentPage, selectedCategory, search, selectedSize, selectedColor, priceRange]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      const response = await getAllCategories();
      setLoadingCategories(false);
      if (response.isSuccess && response.data) {
        setCategories(response.data || []);
      }
    };
    const fetchSizes = async () => {
      setLoadingSizes(true);
      const response = await getSizes(0, 100);
      setLoadingSizes(false);
      if (response.isSuccess && response.data) {
        setSizes(response.data.content || []);
      }
    }
    const fetchColors = async () => {
      setLoadingColors(true);
      const response = await getColors(0, 100);
      setLoadingColors(false);
      if (response.isSuccess && response.data) {
        setColors(response.data.content || []);
      }
    }
    fetchColors();
    fetchCategories();
    fetchSizes();
  }, []);

  const navigate = useNavigate();
  const handleAddProduct = () => {
    navigate('/products/add/information');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearch(searchInput.trim());
      setCurrentPage(1);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };
  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
    setCurrentPage(1);
  }
  const handleColorChange = (value: string) => {
    setSelectedColor(value);
    setCurrentPage(1);
  };

  return (
    <MotionPageWrapper>
      <div className="flex-1 bg-gray-100 p-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">{t('products')}</h1>
        </div>
        {/* Search Box */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder={t('search')}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className='flex gap-4'>
            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              disabled={loadingCategories}
              style={{ width: 180, height: 50 }}
              optionLabelProp="label"
            >
              <Option value="" label={t('all')}>
                {t('all')}
              </Option>
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id} label={cat.name}>
                  {cat.name}
                </Option>
              ))}
            </Select>

            {/* Size filter */}
            <Select
              value={selectedSize}
              onChange={handleSizeChange}
              disabled={loadingSizes}
              style={{ width: 180, height: 50 }}
              optionLabelProp="label"
            >
              <Option value="" label={t('allSizes')}>
                {t('allSizes')}
              </Option>
              {sizes.map((size) => (
                <Option key={size.id} value={size.name} label={size.name}>
                  {size.name}
                </Option>
              ))}
            </Select>

            {/* Color filter */}
            <Select
              value={selectedColor}
              disabled={loadingColors}
              onChange={handleColorChange}
              style={{ width: 180, height: 50 }}
              optionLabelProp="label"
            >
              <Option value="" label={t('allColors')}>
                {t('allColors')}
              </Option>
              {colors.map((color) => (
                <Option
                  key={color.id}
                  value={color.name}
                  label={
                    <div className="flex items-center space-x-2">
                      <span
                        style={{
                          display: 'inline-block',
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: color.code,
                          border: '1px solid #ccc',
                        }}
                      ></span>
                      <span>{color.name}</span>
                    </div>
                  }
                >
                  <div className="flex items-center space-x-2">
                    <span
                      style={{
                        display: 'inline-block',
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: color.code,
                        border: '1px solid #ccc',
                      }}
                    ></span>
                    <span>{color.name}</span>
                  </div>
                </Option>
              ))}
            </Select>
            {/* Range price */}
            <Collapse
              bordered={false}
              className="bg-white rounded-lg shadow min-w-[280px]"
              expandIconPosition="end"
              style={{ width: 300 }}
            >
              <Panel
                header={
                  <span className="text-gray-900  text-base">
                    {t('price')}
                  </span>
                }
                key="1"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900 font-medium text-sm">
                    {formatPrice(priceRange[0])}
                  </span>
                  <span className="text-gray-900 font-medium text-sm">
                    {formatPrice(priceRange[1])}
                  </span>
                </div>
                <Slider
                  range
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  value={priceRange}
                  onChange={setPriceRange}
                  tooltip={
                    {
                      formatter: value => formatPrice(value!)
                    }}
                  step={1000}
                  dotStyle={{ display: 'none' }}
                />
              </Panel>
            </Collapse>
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
        <div className="bg-white rounded-lg shadow">
          {loading ? <div role='status' className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          </div> : <>
            <ProductTable
              products={products}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            /></>}
        </div>
      </div>
    </MotionPageWrapper>
  );
};

export default Products;