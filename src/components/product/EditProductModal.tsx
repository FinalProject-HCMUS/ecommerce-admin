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
const initialFormData = {
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
  mainImageUrl: '',
};
const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, onSubmit, product, productImages }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const pageRef = useRef(page);
  const [showDropdown, setShowDropdown] = useState(false);
  const fetchingRef = useRef(isFetching);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  // Function to handle adding a new size
  const handleAddSize = () => {
    setSizes((prev) => [
      ...prev,
      { name: '', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0, confirmed: false },
    ]);
  };

  // Function to handle changes in size fields
  const handleSizeChange = (index: number, field: keyof typeof sizes[0], value: string | number) => {
    setSizes((prev) =>
      prev.map((size, i) => (i === index ? { ...size, [field]: value } : size))
    );
  };

  // Function to confirm a size
  const handleConfirmSize = (index: number) => {
    setSizes((prev) =>
      prev.map((size, i) => (i === index ? { ...size, confirmed: true } : size))
    );
  };

  // Function to edit a confirmed size
  const handleEditSize = (index: number) => {
    setSizes((prev) =>
      prev.map((size, i) => (i === index ? { ...size, confirmed: false } : size))
    );
  };

  // Function to handle removing a size
  const handleRemoveSize = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };
  // Function to handle adding a new color
  const handleAddColor = () => {
    setColors((prev) => [...prev, { name: '', code: '' }]);
  };

  // Function to handle changes in color fields
  const handleColorChange = (index: number, field: 'name' | 'code', value: string) => {
    setColors((prev) =>
      prev.map((color, i) => (i === index ? { ...color, [field]: value } : color))
    );
  };

  // Function to handle removing a color
  const handleRemoveColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };
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
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'font',
    'bold',
    'italic',
    'underline',
    'strike',
    'align',
    'list',
    'bullet',
    'indent',
    'direction',
    'color',
    'background',
    'link',
  ];
  return (
    <MotionModalWrapper>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-[1600px] mx-4">
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
            <div className="grid grid-cols-1 md:grid-cols-[30%,30%,30%,5%] gap-6">

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="relative w-full">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percent</label>
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
                    <label className="text-sm font-medium text-gray-700">Enable</label>
                    <input
                      type="checkbox"
                      name="enable"
                      checked={formData.enable}
                      onChange={handleChange}
                      className="w-5 h-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">In Stock</label>
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

                <div className="mb-16">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <ReactQuill
                    value={formData.description}
                    modules={modules}
                    formats={formats}
                    onChange={(value) => handleChangeDescription(value)}
                    placeholder="Write your description of product here..."
                    className="h-48"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                  <div className="space-y-4">
                    {colors.map((color, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        {/* Color Name Field */}
                        <input
                          type="text"
                          placeholder="Color Name"
                          value={color.name}
                          onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                          className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        {/* Color Code Field */}
                        <input
                          type="text"
                          placeholder="Color Code"
                          value={color.code}
                          onChange={(e) => handleColorChange(index, 'code', e.target.value)}
                          className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        {/* Color Preview */}
                        <div
                          className="w-10 h-10 border rounded-full"
                          style={{ backgroundColor: color.code || '#fff' }}
                        ></div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}

                    {/* Add Color Button */}
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="flex items-center space-x-2 text-blue-500 hover:text-blue-700"
                    >
                      <span>+ Add Color</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                  <div className="space-y-4">
                    {sizes.map((size, index) => (
                      <div key={index} className="space-y-2 border border-gray-300 p-4 rounded-lg">
                        {size.confirmed ? (
                          // Compact View for Confirmed Size
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">{size.name}</span>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => handleEditSize(index)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveSize(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Expanded View for Editing Size
                          <>
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white rounded-lg w-full max-w-4xl mx-4">
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                  <h3 className="text-2xl font-semibold text-gray-800">Add size</h3>
                                  <button onClick={() => handleRemoveSize(index)} className="text-gray-500 hover:text-gray-700">
                                    <X size={24} />
                                  </button>
                                </div>
                                <div className="m-4 grid gap-4">
                                  {/* Name Size Field */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name Size</label>
                                    <input
                                      type="text"
                                      placeholder="Size Name (e.g., S, M, L)"
                                      value={size.name}
                                      onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>

                                <div className="grid m-4 grid-cols-2 gap-4">
                                  {/* Min Height Field */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Height</label>
                                    <input
                                      type="number"
                                      placeholder="Min Height (cm)"
                                      value={size.minHeight}
                                      onChange={(e) => handleSizeChange(index, 'minHeight', Number(e.target.value))}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>

                                  {/* Max Height Field */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Height</label>
                                    <input
                                      type="number"
                                      placeholder="Max Height (cm)"
                                      value={size.maxHeight}
                                      onChange={(e) => handleSizeChange(index, 'maxHeight', Number(e.target.value))}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>

                                <div className="grid m-4 grid-cols-2 gap-4">
                                  {/* Min Weight Field */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Weight</label>
                                    <input
                                      type="number"
                                      placeholder="Min Weight (kg)"
                                      value={size.minWeight}
                                      onChange={(e) => handleSizeChange(index, 'minWeight', Number(e.target.value))}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>

                                  {/* Max Weight Field */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Weight</label>
                                    <input
                                      type="number"
                                      placeholder="Max Weight (kg)"
                                      value={size.maxWeight}
                                      onChange={(e) => handleSizeChange(index, 'maxWeight', Number(e.target.value))}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>

                                {/* Confirm and Remove Buttons */}
                                <div className="m-4 flex justify-end space-x-3">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSize(index)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleConfirmSize(index)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    {/* Add Size Button */}
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="flex items-center space-x-2 text-blue-500 hover:text-blue-700"
                    >
                      <span>+ Add Size</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {formData.mainImageUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
                    <div className="relative justify-center items-center w-full h-42 rounded-lg overflow-hidden">
                      <img
                        src={formData.mainImageUrl}
                        alt="Thumbnail"
                        className="h-48 w-96 object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={handleClick}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Drop your images here, or browse</p>
                      <p className="text-xs text-gray-500">jpeg, png are allowed</p>
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
              <div className='space-y-6'>
                <div className="mt-7 space-y-2">
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </MotionModalWrapper>
  );
};

export default EditProductModal;