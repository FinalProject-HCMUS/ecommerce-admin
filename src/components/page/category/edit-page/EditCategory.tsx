import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MotionPageWrapper from "../../../common/MotionPage";
import { CategoryRequest } from "../../../../types/category/CategoryRequest";
import { getCategoryById, updateCategory } from "../../../../apis/categoryApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const EditCategory: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [saving, setSaving] = useState(false);
    const { t } = useTranslation('category');
    const fetchCategoryById = async (id: string) => {
        const response = await getCategoryById(id);
        if (!response.isSuccess) {
            toast.error(response.message, {
                autoClose: 1000, position: "top-right"
            });
            return;
        }
        if (response.data) {
            setCategoryName(response.data.name);
            setCategoryDescription(response.data.description);
        }
    }
    useEffect(() => {
        if (id) {
            fetchCategoryById(id);
        }
    }, [id]);

    const handleSubmit = async () => {
        if (!categoryName || !categoryDescription) {
            toast.error("Please fill in all fields.", {
                autoClose: 1000, position: "top-right"
            });
            return;
        }
        setSaving(true);
        const categoryRequest: CategoryRequest = {
            name: categoryName,
            description: categoryDescription,
        };
        const response = await updateCategory(id!, categoryRequest);
        if (!response.isSuccess) {
            toast.error(response.message, {
                autoClose: 1000, position: "top-right"
            });
            setSaving(false);
            return;
        }
        toast.success("Category added successfully", {
            autoClose: 1000,
            onClose: () => {
                navigate("/categories");
            }
        });
        setSaving(false);
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{t('editCategory')}</h1>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('categoryDescripton')}</label>
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
                            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={saving}
                        >
                            {t('save')}
                        </button>
                    </div>
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default EditCategory;