import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash } from 'lucide-react';
import { Color } from '../../../../types/color/Color';
import { Size } from '../../../../types/size/Size';
import { ProductColorSize } from '../../../../types/product/ProductColorSize';
import ColorPickerDialog from '../../../color/ColorPickerDialog';
import SizePickerDialog from '../../../size/SizePickerDialog';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import MotionPageWrapper from '../../../common/MotionPage';

interface AddVariantsProps {
    productColorSizes: ProductColorSize[];
    setProductColorSizes: React.Dispatch<React.SetStateAction<ProductColorSize[]>>;
    handleSubmit: () => void;
    loading: boolean;
}

const AddVariants: React.FC<AddVariantsProps> = ({
    productColorSizes,
    setProductColorSizes,
    handleSubmit,
    loading
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation('product');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [colorsSelected, setColorsSelected] = useState<Color[]>([{ name: '', code: '', id: '' }]);
    const [newVariant, setNewVariant] = useState<ProductColorSize>(
        { id: '', productId: '', color: { name: '', code: '', id: '' }, size: { id: '', name: '', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 }, quantity: 0 }
    );
    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

    const handleAddVariant = () => {
        if (!newVariant.color || !newVariant.size || newVariant.quantity <= 0) {
            toast.error('Please fill in all fields.', { autoClose: 1000, position: 'top-right' });
            return;
        }
        setProductColorSizes((prev) => [...prev, newVariant]);
        setColorsSelected((prev) => [...prev, newVariant.color!]);
        setNewVariant({ id: '', productId: '', color: { name: '', code: '', id: '' }, size: { id: '', name: '', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 }, quantity: 0 });
    };

    const handleEditVariant = (index: number) => {
        setEditingIndex(index);
        setNewVariant(productColorSizes[index]);
    };

    const handleSaveVariant = () => {
        if (editingIndex !== null) {
            const updatedVariants = [...productColorSizes];
            updatedVariants[editingIndex] = newVariant;
            setProductColorSizes(updatedVariants);
            setEditingIndex(null);
            setNewVariant({ id: '', productId: '', color: { name: '', code: '', id: '' }, size: { id: '', name: '', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 }, quantity: 0 });
        }
    };

    const handleDeleteVariant = (index: number) => {
        setProductColorSizes((prev) => prev.filter((_, i) => i !== index));
        setColorsSelected((prev) => prev.filter((_, i) => i !== index));
    };
    const handleColorSelect = (color: Color) => {
        setNewVariant((prev) => ({ ...prev, color: color }));
        setIsColorModalOpen(false);
    };
    const handleSizeSelect = (size: Size) => {
        setNewVariant((prev) => ({ ...prev, size: size }));
        setIsSizeModalOpen(false);
    }

    return (
        <MotionPageWrapper>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">{t("addVariant")}</h1>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    {/* Add Variant Form */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {/* Color Picker */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t("color")}</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newVariant.color!.name}
                                    readOnly
                                    onClick={() => setIsColorModalOpen(true)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    placeholder={t("pickaColor")}
                                />
                            </div>
                        </div>

                        {/* Size Picker */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t("size")}</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newVariant.size!.name}
                                    readOnly
                                    onClick={() => setIsSizeModalOpen(true)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    placeholder={t("pickaSize")}
                                />
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t("quantity")}</label>
                            <input
                                type="number"
                                value={newVariant.quantity}
                                onChange={(e) => setNewVariant((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter quantity"
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mb-6">
                        {editingIndex !== null ? (
                            <button
                                type="button"
                                onClick={handleSaveVariant}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {t("save")}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleAddVariant}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {t("add")}
                            </button>
                        )}
                    </div>

                    {/* Variants Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">STT</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">{t("color")}</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">{t("size")}</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">{t("quantity")}</th>
                                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 border-b">{t("action")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productColorSizes.map((variant, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{index + 1}</td>
                                        <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                            <div className="flex items-center">
                                                <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: variant.color!.code }}></div>
                                                <span className="ml-3 text-sm text-gray-900">{variant.color!.name}</span>
                                            </div></td>
                                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{variant.size!.name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{variant.quantity}</td>
                                        <td className="px-4 py-2 text-center text-sm text-gray-700 border-b">
                                            <button
                                                type="button"
                                                onClick={() => handleEditVariant(index)}
                                                className="text-blue-600 hover:text-blue-800 mr-2"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteVariant(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            {t("back")}
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 duration-200 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {t("submit")}
                        </button>
                    </div>
                </div>

                {/* Color Picker Modal */}
                {
                    isColorModalOpen && (
                        <ColorPickerDialog
                            isOpen={isColorModalOpen}
                            onClose={() => setIsColorModalOpen(false)}
                            onPick={handleColorSelect}
                            colorsSelected={colorsSelected}
                        />
                    )
                }
                {/* Size Picker Modal */}
                {
                    isSizeModalOpen && (
                        <SizePickerDialog
                            isOpen={isSizeModalOpen}
                            onClose={() => setIsSizeModalOpen(false)}
                            onPick={handleSizeSelect}
                        />
                    )
                }
            </div >
        </MotionPageWrapper>
    );
};

export default AddVariants;