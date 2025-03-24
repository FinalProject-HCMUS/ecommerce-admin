/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import ProductTable from '../components/product/ProductTable';
import Pagination from '../components/common/Pagination';
import AddProductModal from '../components/product/AddProductModal';
import EditProductModal from '../components/product/EditProductModal';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import { getProducts } from '../apis/productApi';
import DeleteConfirmationModal from '../components/common/DeleteConfirm';
import { toast } from 'react-toastify';
import MotionPageWrapper from '../components/common/MotionPage';

const ITEMS_PER_PAGE = 10;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
    });
  });

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const getCurrentPageProducts = () => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return products.slice(start, end);
  };

  const handleEdit = (id: string) => {
    const product = products.find(p => p.id === id);
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const product = products.find(p => p.id == id);
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
      id: (products.length + 1).toString(),
      name: productData.name,
      category: productData.category,
      price: productData.price,
      total: productData.total,
      in_stock: productData.in_stock,
      main_image_url: productData.main_image_url,
      images: productData.images,
      cost: productData.cost,
      description: productData.description,
      enable: productData.enable,
      discount_percent: productData.discount_percent || 0,
      average_rating: productData.average_rating || 0,
      review_count: productData.review_count || 0,
      created_time: new Date().toISOString(),
      update_time: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
    toast.success('Product added successfully', { autoClose: 1000 });
  }
  const handleUpdateProduct = (productData: any) => {
    const updatedProducts = products.map(p => {
      if (p.id === productData.id) {
        return {
          ...p,
          name: productData.name,
          category: productData.category,
          price: productData.price,
          total: productData.total,
          in_stock: productData.in_stock,
          main_image_url: productData.main_image_url,
          images: productData.images,
          cost: productData.cost,
          description: productData.description,
          enable: productData.enable,
          discount_percent: productData.discount_percent || 0,
          average_rating: productData.average_rating || 0,
          review_count: productData.review_count || 0,
          update_time: new Date().toISOString(),
        };
      }
      return p;
    });
    setProducts(updatedProducts);
    toast.success('Product updated successfully', { autoClose: 1000 });
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
            products={getCurrentPageProducts()}
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