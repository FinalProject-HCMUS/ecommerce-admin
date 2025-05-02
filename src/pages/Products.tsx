/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import ProductTable from '../components/product/ProductTable';
import Pagination from '../components/common/Pagination';
import AddProductModal from '../components/product/AddProductModal';
import EditProductModal from '../components/product/EditProductModal';
import { Plus } from 'lucide-react';
import { getProductById, getProductImages, getProducts, updateProduct } from '../apis/productApi';
import DeleteConfirmationModal from '../components/common/DeleteConfirm';
import { toast } from 'react-toastify';
import MotionPageWrapper from '../components/common/MotionPage';
import { Product } from '../types/product/Product';
import { ProductImage } from '../types/product/ProductImage';

const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  const fetchProducts = async (page: number) => {
    try {
      const response = await getProducts(page - 1, ITEMS_PER_PAGE); // API is 0-indexed
      setProducts(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleEdit = async (id: string) => {
    const product = await getProductById(id);
    const productImagesResponse = await getProductImages(id);
    if (product) {
      setSelectedProduct(product);
      setProductImages(productImagesResponse);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const product = products.find(p => p.id === id);
    setProductToDelete(product!);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      setProducts(updatedProducts);
      toast.success('Product deleted successfully', { autoClose: 1000 });
      setProductToDelete(null);
    }
  };

  const handleAddProduct = (productData: any) => {
    const newProduct: Product = {
      ...productData,
      id: (products.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
    toast.success('Product added successfully', { autoClose: 1000 });
  };

  const handleUpdateProduct = async (productData: any, images: ProductImage[]) => {
    const idProduct = productData.id;
    delete productData.id;
    delete productData.category;
    const response = await updateProduct(idProduct, productData);
    //update images
    console.log(images);
    if (response.isSuccess) {
      toast.success('Product updated successfully', { autoClose: 1000 });
    }
    fetchProducts(currentPage)
  };

  return (
    <MotionPageWrapper>
      <div className="flex-1 bg-gray-100 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddProduct}
        />

        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateProduct}
          product={selectedProduct}
          productImages={productImages}
        />
        <DeleteConfirmationModal
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={confirmDelete}
          itemName={productToDelete?.name || ''}
        />
      </div>
    </MotionPageWrapper>
  );
};

export default Products;