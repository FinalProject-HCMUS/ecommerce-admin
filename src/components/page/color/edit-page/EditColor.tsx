import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MotionPageWrapper from "../../../common/MotionPage";
import { getColorById, updateColor } from "../../../../apis/colorApi";
import { toast } from "react-toastify";
import { ColorRequest } from "../../../../types/color/ColorRequest";
import { useTranslation } from "react-i18next";

const EditColor: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Get the color ID from the URL
    const [colorName, setColorName] = useState("");
    const [colorCode, setColorCode] = useState("#000000");
    const { t } = useTranslation('color');
    const fetchColorById = async (id: string) => {
        const response = await getColorById(id);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        if (response.data) {
            setColorName(response.data.name);
            setColorCode(response.data.code);
        }
    };

    useEffect(() => {
        if (id) {
            fetchColorById(id);
        }
    }, [id]);

    const handleSubmit = async () => {
        const newColor: ColorRequest = {
            name: colorName,
            code: colorCode,
        };
        const response = await updateColor(id!, newColor);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        toast.success("Color updated successfully!", { autoClose: 1000 });
        navigate("/colors");
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{t('editColor')}</h1>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="space-y-6">
                        {/* Color Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('colorName')}</label>
                            <input
                                type="text"
                                value={colorName}
                                onChange={(e) => setColorName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter color name"
                            />
                        </div>

                        {/* Color Picker */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('colorCode')}</label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="color"
                                    value={colorCode}
                                    onChange={(e) => setColorCode(e.target.value)}
                                    className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={colorCode}
                                    onChange={(e) => setColorCode(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter color code (e.g., #FF5733)"
                                />
                            </div>
                        </div>

                        {/* Color Preview */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('preview')}</label>
                            <div
                                className="w-24 h-24 rounded-lg border border-gray-300"
                                style={{ backgroundColor: colorCode }}
                            ></div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate("/colors")}
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

export default EditColor;