/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { getCategories } from '../../apis/categoryApi';
import MotionModalWrapper from '../common/MotionModal';
import { Product } from '../../types/product/Product';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ProductImage } from '../../types/product/ProductImage';
import { toast } from 'react-toastify';
import { Category } from '../../types/category/Category';


interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: any, productImages: ProductImage[]) => void;
  product?: Product;
  productImages?: ProductImage[];
}
const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, onSubmit, product, productImages }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    categoryId: '',
    price: 0,
    cost: 0,
    total: 0,
    enable: false,
    inStock: true,
    discountPercent: 0,
    mainImageUrl: ''
  });
  const [images, setImages] = useState<ProductImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const pageRef = useRef(page);
  const [showDropdown, setShowDropdown] = useState(false);
  const fetchingRef = useRef(isFetching);
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.categoryName,
        categoryId: product.categoryId,
        price: product.price,
        cost: product.cost,
        discountPercent: product.discountPercent,
        total: product.total,
        enable: product.enable,
        inStock: product.inStock,
        mainImageUrl: product.mainImageUrl
      });
    }
  }, [product]);

  useEffect(() => {
    if (productImages) {
      setImages(productImages);
    }
  }, [productImages]);

  //infinite scroll categories
  useEffect(() => {
    pageRef.current = page;
    fetchingRef.current = isFetching;
  }, [page, isFetching]);

  const fetchCategories = async (pageNumber: number) => {
    setIsFetching(true);
    const response = await getCategories(pageNumber - 1, 5);
    setIsFetching(false);

    if (!response.isSuccess) {
      toast.error(response.message, { autoClose: 1000 });
      return;
    }
    if (response.data) {
      if (pageNumber === 1) {
        setCategories(response.data?.content);
      } else {
        setCategories((prev) => [...prev, ...response.data?.content || []]);
      }
      setPage(pageNumber);
    }
  };
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  useEffect(() => {
    const element = dropdownRef.current;
    if (!element) return;
    const handleScroll = () => {
      if (
        dropdownRef.current &&
        dropdownRef.current.scrollTop + dropdownRef.current.clientHeight >= dropdownRef.current.scrollHeight - 10 &&
        !fetchingRef.current
      ) {
        fetchCategories(pageRef.current + 1);
      }
    };
    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [page, isFetching]);

  useEffect(() => {
    if (showDropdown && categories.length === 0) {
      fetchCategories(1);
    }
  }, [showDropdown]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, id: product?.id }, images);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.mainImageUrl === '') {
      setFormData((prev) => ({
        ...prev,
        mainImageUrl: URL.createObjectURL(files[0]),
      }));
    }
    const newImages = files.map(file => URL.createObjectURL(file));
    const updatedImages = [...images, ...newImages.map(url => ({ id: '', productId: images[0].productId, url, createdAt: '', updatedAt: '', createdBy: '', updatedBy: '' }))];
    setImages(updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    const mainUrl = images[index].url;
    const updatedImages = images.map((image, i) => i === index ? { ...image, url: "" } : image);
    setImages(updatedImages);
    if (mainUrl === formData.mainImageUrl) {
      const nextThumbnail = updatedImages.find(image => image.url)?.url || '';
      setFormData(prev => ({ ...prev, mainImageUrl: nextThumbnail }));
    }
  };

  const handleSetThumbnail = (image: string) => {
    setFormData(prev => ({ ...prev, mainImageUrl: image }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (formData.mainImageUrl === '') {
      setFormData((prev) => ({
        ...prev,
        mainImageUrl: URL.createObjectURL(files[0]),
      }));
    }
    const newImages = files.map(file => URL.createObjectURL(file));
    const updatedImages = [...images, ...newImages.map(url => ({ id: '', productId: '', url, createdAt: '', updatedAt: '', createdBy: '', updatedBy: '' }))];
    setImages(updatedImages);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    document.getElementById('image-upload')?.click();
  };
  const handleChangeDescription = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
  }
  const handleCategorySelect = (category: Category) => {
    setFormData((prev) => ({
      ...prev,
      category: category.name,
      categoryId: category.id,
    }));
    setShowDropdown(false);
  };
  return (
    <MotionModalWrapper>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl mx-4">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Update Product Information</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-[40%,40%,10%] gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <ReactQuill
                    value={formData.description}
                    onChange={handleChangeDescription}
                    className="h-40"
                  />
                </div>

                <div className="pt-14 relative w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="relative">
                    <button
                      type='button'
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left"
                      onClick={() => setShowDropdown((prev) => !prev)}
                    >
                      {formData.category || "Select category"}
                    </button>
                    {showDropdown && (
                      <ul
                        ref={dropdownRef}
                        className="absolute z-10 w-full max-h-40 overflow-y-auto mt-1 bg-white border border-gray-300 rounded-lg shadow"
                      >
                        {categories.map((category) => (
                          <li
                            key={category.id}
                            className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => handleCategorySelect(category)}
                          >
                            {category.name}
                          </li>
                        ))}
                        {isFetching && <li className="px-3 py-2 text-sm text-gray-500">Loading...</li>}
                      </ul>

                    )}
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost
                    </label>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total
                    </label>
                    <input
                      type="number"
                      name="total"
                      value={formData.total}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percent
                    </label>
                    <input
                      type="number"
                      name="discountPercent"
                      value={formData.discountPercent}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">
                      Enable
                    </label>
                    <input
                      type="checkbox"
                      name="enable"
                      checked={formData.enable}
                      onChange={handleChange}
                      className="w-5 h-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">
                      In Stock
                    </label>
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleChange}
                      className="w-5 h-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {formData.mainImageUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail Image
                    </label>
                    <div className="relative">
                      <img
                        src={formData.mainImageUrl}
                        alt="Thumbnail"
                        className="w-full h-50 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={handleClick}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drop your images here, or browse
                      </p>
                      <p className="text-xs text-gray-500">
                        jpeg, png are allowed
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                    </div>
                  </div>
                </div>

              </div>
              <div className="mt-10 space-y-2">
                {images.length > 0 && (
                  <div
                    className="flex flex-col gap-2 overflow-y-auto"
                    style={{ maxHeight: '440px' }}
                  >
                    {images.map((productImage, index) => (
                      productImage.url && productImage.url !== "" &&
                      <div key={index} className="relative">
                        <img
                          src={productImage.url}
                          alt={`Product ${index + 1}`}
                          className={`w-full h-20 object-contain rounded-lg ${formData.mainImageUrl === productImage.url ? 'border-4 border-blue-500' : 'border-2 border-gray-300'}`}
                          onClick={() => handleSetThumbnail(productImage.url)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-0 right-0 bg-red-600 rounded-full shadow-md"
                        >
                          <X color="white" size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </MotionModalWrapper>
  );
};

export default EditProductModal;