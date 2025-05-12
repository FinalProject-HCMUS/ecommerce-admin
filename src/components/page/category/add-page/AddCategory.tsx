import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MotionPageWrapper from "../../../common/MotionPage";
import { CategoryRequest } from "../../../../types/category/CategoryRequest";
import { addCategory } from "../../../../apis/categoryApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const AddCategory: React.FC = () => {
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const { t } = useTranslation('category');

    const handleSubmit = async () => {
        if (!categoryName || !categoryDescription) {
            toast.error("Please fill in all fields.", {
                autoClose: 1000, position: "top-right"
            });
            return;
        }
        const categoryRequest: CategoryRequest = {
            name: categoryName,
            description: categoryDescription,
        };
        const response = await addCategory(categoryRequest);
        if (!response.isSuccess) {
            toast.error(response.message, {
                autoClose: 1000, position: "top-right"
            });
            return;
        }
        toast.success("Category added successfully", {
            autoClose: 1000,
            onClose: () => {
                navigate("/categories");
            }
        });
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">{t('addCategory')}</h1>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="space-y-6">
                        {/* Category Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('categoryName')}</label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={t('namePlaceholder')}
                            />
                        </div>

                        {/* Category Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('categoryDescription')}</label>
                            <textarea
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={t('descriptionPlaceholder')}
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate("/categories")}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {t('save')}
                        </button>
                    </div>
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default AddCategory;