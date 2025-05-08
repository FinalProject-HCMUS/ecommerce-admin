/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Pencil } from 'lucide-react';
import { getCategories } from '../../apis/categoryApi';
import MotionModalWrapper from '../common/MotionModal';
import { ProductImage } from '../../types/product/ProductImage';
import { toast } from 'react-toastify';
import { Category } from '../../types/category/Category';
import { Color } from '../../types/product/Color';
import ReactQuill from 'react-quill';
import { Size } from '../../types/product/Size';
import { ProductColorSize } from '../../types/product/ProductColorSize';
import ColorAddModal from './ColorAddModal';
import ColorEditModal from './ColorEditModal';
import SizeAddModal from './SizeAddModal';
import SizeEditModal from './SizeEditModal';


interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: any, productImages: ProductImage[], sizes: Size[], colors: Color[], productColorSizes: ProductColorSize[]) => void;
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

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const pageRef = useRef(page);
  const fetchingRef = useRef(isFetching);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isColorAddModalOpen, setIsColorAddModalOpen] = useState(false);
  const [isColorEditModalOpen, setIsColorEditModalOpen] = useState(false);
  const [indexSelectedColor, setIndexSelectedColor] = useState(0);
  const [selectedColor, setSelectedColor] = useState<Color>({ name: '', code: '' });
  const [isSizeAddModalOpen, setIsSizeAddModalOpen] = useState(false);
  const [isSizeEditModalOpen, setIsSizeEditModalOpen] = useState(false);
  const [indexSelectedSize, setIndexSelectedSize] = useState(0);
  const [selectedSize, setSelectedSize] = useState<Size>({ name: '', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 });
  const [colorPicker, setColorPicker] = useState<Color>({ name: '', code: '' });
  const [sizePicker, setSizePicker] = useState<Size>({ name: '', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 });
  const [productColorSizes, setProductColorSizes] = useState<ProductColorSize[]>([]);
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
  useEffect(() => {
    if (!isOpen) {
      // Reset all state variables to their default values
      setFormData(initialFormData);
      setImages([]);
      setCategories([]);
      setColors([]);
      setSizes([]);
      setProductColorSizes([]);
      setColorPicker({ name: '', code: '' });
      setSizePicker({ name: '', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 });
      setSelectedColor({ name: '', code: '' });
      setSelectedSize({ name: '', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 });
      setIndexSelectedColor(0);
      setIndexSelectedSize(0);
    }
  }, [isOpen]);
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
  const handleScroll = () => {
    if (
      dropdownRef.current &&
      dropdownRef.current.scrollTop + dropdownRef.current.clientHeight >= dropdownRef.current.scrollHeight - 10 &&
      !fetchingRef.current
    ) {
      fetchCategories(pageRef.current + 1);
    }
  };
  useEffect(() => {
    const element = dropdownRef.current;
    if (!element) return;
    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [page, isFetching]);

  useEffect(() => {
    if (showDropdown && categories.length === 0) {
      fetchCategories(1);
    }
  }, [showDropdown]);

  if (!isOpen) return null;
  //Color functions
  const handleEditColor = (index: number) => {
    setIndexSelectedColor(index);
    setSelectedColor(colors[index]);
    setIsColorEditModalOpen(true);
  }
  const handleRemoveColor = (index: number) => {
    const removedColor = colors[index];
    if (colorPicker.code === removedColor.code) {
      setColorPicker({ name: '', code: '' });
    }
    setProductColorSizes((prev) => prev.filter((pcs) => pcs.colorId !== removedColor.code));
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateColor = (updatedColor: Color) => {
    setColors((prev) =>
      prev.map((color, i) => (i === indexSelectedColor ? updatedColor : color))
    );
  };
  //
  const handleColorSelection = (color: Color) => {
    setColorPicker(color);
    const existingCombination = productColorSizes.find(
      (pcs) => pcs.colorId === color.code && pcs.sizeId === sizePicker.name
    );

    if (!existingCombination && sizePicker.name) {
      setProductColorSizes((prev) => [
        ...prev,
        { productId: '', colorId: color.code, sizeId: sizePicker.name, quantity: 0 },
      ]);
    }
  };

  const handleSizeSelection = (size: Size) => {
    setSizePicker(size);
    const existingCombination = productColorSizes.find(
      (pcs) => pcs.colorId === colorPicker.code && pcs.sizeId === size.name
    );

    if (!existingCombination && colorPicker.code) {
      setProductColorSizes((prev) => [
        ...prev,
        { productId: '', colorId: colorPicker.code, sizeId: size.name, quantity: 0 },
      ]);
    }
  };

  const handleQuantityChange = (colorId: string, sizeId: string, quantity: number) => {
    setProductColorSizes((prev) =>
      prev.map((pcs) =>
        pcs.colorId === colorId && pcs.sizeId === sizeId
          ? { ...pcs, quantity }
          : pcs
      )
    );
  };

  //Size functions
  const handleEditSize = (index: number) => {
    setIndexSelectedSize(index);
    setSelectedSize(sizes[index]);
    setIsSizeEditModalOpen(true);
  };
  const handleRemoveSize = (index: number) => {
    if (sizePicker.name === sizes[index].name) {
      setSizePicker({ name: '', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 });
    }
    setProductColorSizes((prev) => prev.filter((pcs) => pcs.sizeId !== sizes[index].name));
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };
  const handleUpdateSize = (updatedSize: Size) => {
    setSizes((prev) =>
      prev.map((size, i) => (i === indexSelectedSize ? updatedSize : size))
    );
  };
  //

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, images, sizes, colors, productColorSizes);
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
    const updatedImages = [...images, ...newImages.map(url => ({ id: '', productId: '', url, createdAt: '', updatedAt: '', createdBy: '', updatedBy: '' }))];
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
    setFormData((prev) => ({ ...prev, mainImageUrl: image }));
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
        <div className="bg-white rounded-lg w-full max-w-[1600px] mx-4 h-[70vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Add Product</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
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
                    <div className="flex items-center space-x-2 mb-2">
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      {colorPicker.code && <div className="w-8 h-8 border rounded-full" style={{ backgroundColor: colorPicker.code }}></div>}
                      {sizePicker.name && <span>size: {sizePicker.name}</span>}
                    </div>
                    <div>
                      {productColorSizes.map((pcs, index) => (
                        <div
                          key={index}
                        >
                          {colorPicker.code === pcs.colorId && sizePicker.name === pcs.sizeId && colorPicker.code != '' && sizePicker.name != '' &&
                            <input
                              type="number"
                              min="0"
                              value={pcs.quantity}
                              onChange={(e) =>
                                handleQuantityChange(pcs.colorId, pcs.sizeId, Number(e.target.value))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='mt-3'>
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
                    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                    placeholder="Write your description of product here..."
                    className="h-48"
                  />
                </div>
                <div className='pt-4'>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                  <div className="space-y-4">
                    {colors.map((color, index) => (
                      <div
                        onClick={() => handleColorSelection(color)}
                        key={index}
                        className={`flex items-center space-x-4 border border-gray-300 p-4 rounded-lg hover:bg-green-300 ${colorPicker === color ? "ring-4" : ""}`}
                      >
                        {/* Color Name Field */}
                        <span>{color.name}</span>
                        {/* Color Preview */}
                        <div
                          className="w-10 h-10 border rounded-full"
                          style={{ backgroundColor: color.code || '#fff' }}
                        ></div>
                        {/* Edit Color Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditColor(index)
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={20} />
                        </button>
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveColor(index)
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}

                    {/* Add Color Button */}
                    <button
                      type="button"
                      onClick={() => setIsColorAddModalOpen(true)}
                      className="flex items-center space-x-2 text-blue-500 hover:text-blue-700"
                    >
                      <span>+ Add Color</span>
                    </button>
                    <ColorAddModal
                      isOpen={isColorAddModalOpen}
                      onClose={() => setIsColorAddModalOpen(false)}
                      onAddColor={(color) => setColors((prev) => [...prev, color])}
                    />
                    <ColorEditModal
                      isOpen={isColorEditModalOpen}
                      onClose={() => setIsColorEditModalOpen(false)}
                      color={selectedColor}
                      onEditColor={handleUpdateColor}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                  <div className="space-y-4">
                    {sizes.map((size, index) => (
                      <div onClick={() => handleSizeSelection(size)} key={index} className={`flex items-center space-x-4 border border-gray-300 p-4 rounded-lg hover:bg-green-300 ${sizePicker === size ? "ring-4" : ""}`}>
                        <span className="text-sm font-medium text-gray-700">{size.name}</span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSize(index)
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSize(index)
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Size Button */}
                    <button
                      type="button"
                      onClick={() => setIsSizeAddModalOpen(true)}
                      className="flex items-center space-x-2 text-blue-500 hover:text-blue-700"
                    >
                      <span>+ Add Size</span>
                    </button>
                    <SizeAddModal
                      isOpen={isSizeAddModalOpen}
                      onClose={() => setIsSizeAddModalOpen(false)}
                      onAddSize={(size) => setSizes((prev) => [...prev, size])}
                    />
                    <SizeEditModal
                      isOpen={isSizeEditModalOpen}
                      onClose={() => setIsSizeEditModalOpen(false)}
                      size={selectedSize}
                      onEditSize={handleUpdateSize}
                    />

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
      </div >
    </MotionModalWrapper >
  );
};

export default AddProductModal;