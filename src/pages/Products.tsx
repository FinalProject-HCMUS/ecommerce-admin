/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import ProductTable from '../components/product/ProductTable';
import Pagination from '../components/common/Pagination';
import AddProductModal from '../components/product/AddProductModal';
import EditProductModal from '../components/product/EditProductModal';
import { Plus } from 'lucide-react';
import { addProduct, deleteProduct, getProductById, getProductImages, getProducts, updateProduct, updateProductImages } from '../apis/productApi';
import DeleteConfirmationModal from '../components/common/DeleteConfirm';
import { toast } from 'react-toastify';
import MotionPageWrapper from '../components/common/MotionPage';
import { Product } from '../types/product/Product';
import { ProductImage } from '../types/product/ProductImage';
import { Size } from '../types/product/Size';
import { Color } from '../types/product/Color';
import { ProductColorSize } from '../types/product/ProductColorSize';

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

  const handleEdit = async (id: string) => {
    const product = await getProductById(id);
    const productImagesResponse = await getProductImages(id);
    if (!product.isSuccess || !productImagesResponse.isSuccess) {
      toast.error('Failed to fetch product details', { autoClose: 1000 });
      return;
    }
    if (product.data && productImagesResponse.data) {
      setSelectedProduct(product.data);
      setProductImages(productImagesResponse.data);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const product = products.find(p => p.id === id);
    setProductToDelete(product!);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      const response = await deleteProduct(productToDelete.id);
      if (!response.isSuccess) {
        toast.error(response.message, { autoClose: 1000 });
        return;
      }
      toast.success('Product deleted successfully', { autoClose: 1000 });
      setProductToDelete(null);
    }
  };

  const handleAddProduct = async (productData: any, images: ProductImage[], sizes: Size[], colors: Color[], productColorSizes: ProductColorSize[]) => {
    delete productData.category;
    console.log(productColorSizes);
    const response = await addProduct(productData);
    if (response.isSuccess) {
      const productId = response.data!.id;
      const productImages = images.map((image) => ({ ...image, productId }));
      const responseImages = await updateProductImages(productImages);
      //add sizes and colors to product


      //add product id an color id to product color size
      if (responseImages.isSuccess) {
        toast.success('Product added successfully', { autoClose: 1000 });
        fetchProducts(currentPage);
        return;
      }
    }
    toast.error('Failed to add product', { autoClose: 1000 });
  };

  const handleUpdateProduct = async (productData: any, images: ProductImage[]) => {
    const idProduct = productData.id;
    delete productData.id;
    delete productData.category;
    const response = await updateProduct(idProduct, productData);
    const responseImages = await updateProductImages(images);
    if (response.isSuccess && responseImages.isSuccess) {
      toast.success('Product updated successfully', { autoClose: 1000 });
      fetchProducts(currentPage);
      return;
    }
    toast.error('Failed to update product', { autoClose: 1000 });
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