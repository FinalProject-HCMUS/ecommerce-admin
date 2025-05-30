import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MotionPageWrapper from '../../../common/MotionPage';
import ReactQuill from 'react-quill';
import { Category } from '../../../../types/category/Category';
import { getCategories } from '../../../../apis/categoryApi';
import { toast } from 'react-toastify';
import { ProductRequest } from '../../../../types/product/ProductRequest';
import { useTranslation } from 'react-i18next';


interface AddProductInformationProps {
    formData: ProductRequest;
    setFormData: React.Dispatch<React.SetStateAction<ProductRequest>>;
}

const AddProductInformation: React.FC<AddProductInformationProps> = ({ formData, setFormData }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const pageRef = useRef(page);
    const fetchingRef = useRef(isFetching);
    const dropdownRef = useRef<HTMLUListElement | null>(null);
    const { t } = useTranslation('product')

    const handleCategorySelect = (category: Category) => {
        setFormData((prev) => ({
            ...prev,
            categoryName: category.name,
            categoryId: category.id,
        }));
        setShowDropdown(false);
    };

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{t("productInformation")}</h1>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="space-y-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t("productName")}</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={t("placeholderName")}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t("category")}</label>
                            <button
                                type="button"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={() => setShowDropdown((prev) => !prev)}
                            >
                                {formData.categoryName || t("category")}
                            </button>
                            {showDropdown && (
                                <ul
                                    ref={dropdownRef}
                                    className="absolute z-10 w-full max-h-40 overflow-y-auto mt-2 bg-white border border-gray-300 rounded-lg shadow-lg"
                                >
                                    {categories.map((category) => (
                                        <li
                                            key={category.id}
                                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                            onClick={() => handleCategorySelect(category)}
                                        >
                                            {category.name}
                                        </li>
                                    ))}
                                    {isFetching && <li className="px-4 py-2 text-sm text-gray-500">Loading...</li>}
                                </ul>
                            )}
                        </div>

                        {/* Price and Cost */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t("price")}</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter price"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t("cost")}</label>
                                <input
                                    type="number"
                                    name="cost"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter cost"
                                    required
                                />
                            </div>
                        </div>

                        {/* Enable and In Stock */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    name="enable"
                                    checked={formData.enable}
                                    onChange={handleChange}
                                    className="w-5 h-5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-gray-700">{t("enable")}</label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    name="inStock"
                                    checked={formData.inStock}
                                    onChange={handleChange}
                                    className="w-5 h-5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-gray-700">{t("inStock")}</label>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t("description")}</label>
                            <ReactQuill
                                value={formData.description}
                                onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                                placeholder={t("placeholder")}
                                className='h-48'
                            />
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-12 flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            {t("cancel")}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/products/add/images')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {t("next")}
                        </button>
                    </div>
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default AddProductInformation;