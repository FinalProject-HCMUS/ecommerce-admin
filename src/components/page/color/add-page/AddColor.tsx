import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MotionPageWrapper from "../../../common/MotionPage";
import { ColorRequest } from "../../../../types/color/ColorRequest";
import { addColor } from "../../../../apis/colorApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";


const AddColor: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('color');
    const [colorName, setColorName] = useState("");
    const [colorCode, setColorCode] = useState("#000000");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!colorName || !colorCode) {
            toast.error(t("filledCondition"), {
                autoClose: 1000, position: "top-right"
            });
            return;
        }
        const colorRequest: ColorRequest = {
            name: colorName,
            code: colorCode
        };
        setLoading(true);
        const response = await addColor(colorRequest);
        if (!response.isSuccess) {
            toast.error(response.message || "Failed to add color", {
                autoClose: 1000, position: "top-right"
            });
            setLoading(false);
            return;
        }
        setLoading(false);
        toast.success(t("addColorSuccess"), {
            autoClose: 1000,
            onClose: () => {
                navigate("/colors");
            }
        });
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">{t('addColor')}</h1>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="space-y-6">
                        {/* Color Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('colorName')}</label>
                            <input
                                type="text"
                                value={colorName}
                                onChange={(e) => setColorName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={t('enterColorHolder')}
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
                            disabled={loading}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {t('save')}
                        </button>
                    </div>
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default AddColor;