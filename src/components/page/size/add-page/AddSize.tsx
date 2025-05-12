import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MotionPageWrapper from "../../../common/MotionPage";
import { toast } from "react-toastify";
import { SizeRequest } from "../../../../types/size/SizeRequest";
import { addSize } from "../../../../apis/sizeApi";
import { useTranslation } from "react-i18next";

const AddSize: React.FC = () => {
    const navigate = useNavigate();
    const [sizeName, setSizeName] = useState("");
    const [minHeight, setMinHeight] = useState<number | "">("");
    const [maxHeight, setMaxHeight] = useState<number | "">("");
    const [minWeight, setMinWeight] = useState<number | "">("");
    const [maxWeight, setMaxWeight] = useState<number | "">("");
    const { t } = useTranslation('size');
    const handleSubmit = async () => {
        if (!sizeName || minHeight === "" || maxHeight === "" || minWeight === "" || maxWeight === "") {
            toast.error("Please fill in all fields.", { autoClose: 1000, position: "top-right" });
            return;
        }
        if (minHeight > maxHeight) {
            toast.error("Minimum height cannot be greater than maximum height.", { autoClose: 1000, position: "top-right" });
            return;
        }
        if (minWeight > maxWeight) {
            toast.error("Minimum weight cannot be greater than maximum weight.", { autoClose: 1000, position: "top-right" });
            return;
        }
        const newSize: SizeRequest =
        {
            name: sizeName,
            minHeight: Number(minHeight),
            maxHeight: Number(maxHeight),
            minWeight: Number(minWeight),
            maxWeight: Number(maxWeight)
        };
        const response = await addSize(newSize);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000, position: "top-right" });
            return;
        }
        toast.success("Size added successfully", {
            autoClose: 1000,
            position: "top-right",
            onClose: () => {
                navigate("/sizes");
            }
        });
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">{t('addSize')}</h1>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="space-y-6">
                        {/* Size Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('nameSize')}</label>
                            <input
                                type="text"
                                value={sizeName}
                                onChange={(e) => setSizeName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={t('namePlaceholder')}
                            />
                        </div>

                        {/* Height Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('minHeight')} (cm)</label>
                                <input
                                    type="number"
                                    value={minHeight}
                                    onChange={(e) => setMinHeight(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={t('minHeightPlaceholder')}
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('maxHeight')} (cm)</label>
                                <input
                                    type="number"
                                    value={maxHeight}
                                    onChange={(e) => setMaxHeight(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={t('maxHeightPlaceholder')}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Weight Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('minWeight')} (kg)</label>
                                <input
                                    type="number"
                                    value={minWeight}
                                    onChange={(e) => setMinWeight(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={t('minWeightPlaceholder')}
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('maxWeight')} (kg)</label>
                                <input
                                    type="number"
                                    value={maxWeight}
                                    onChange={(e) => setMaxWeight(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={t('maxWeightPlaceholder')}
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate("/sizes")}
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

export default AddSize;