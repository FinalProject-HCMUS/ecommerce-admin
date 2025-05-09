import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash } from 'lucide-react';
import { Color } from '../../../../types/color/Color';
import { Size } from '../../../../types/size/Size';
import { ProductColorSize } from '../../../../types/product/ProductColorSize';

interface AddVariantsProps {
    colors: Color[];
    setColors: React.Dispatch<React.SetStateAction<Color[]>>;
    sizes: Size[];
    setSizes: React.Dispatch<React.SetStateAction<Size[]>>;
    productColorSizes: ProductColorSize[];
    setProductColorSizes: React.Dispatch<React.SetStateAction<ProductColorSize[]>>;
    handleSubmit: () => void;
}

const AddVariants: React.FC<AddVariantsProps> = ({
    productColorSizes,
    setProductColorSizes,
    handleSubmit,
}) => {
    const navigate = useNavigate();
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [newVariant, setNewVariant] = useState<ProductColorSize>({
        colorId: '',
        sizeId: '',
        quantity: 0,
    });

    const handleAddVariant = () => {
        if (!newVariant.colorId || !newVariant.sizeId || newVariant.quantity <= 0) {
            alert('Please fill in all fields.');
            return;
        }
        setProductColorSizes((prev) => [...prev, newVariant]);
        setNewVariant({ colorId: '', sizeId: '', quantity: 0 });
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
            setNewVariant({ colorId: '', sizeId: '', quantity: 0 });
        }
    };

    const handleDeleteVariant = (index: number) => {
        setProductColorSizes((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-semibold text-gray-900">Add Variants</h1>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                {/* Add Variant Form */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <input
                            type="text"
                            value={newVariant.colorId}
                            onChange={(e) => setNewVariant((prev) => ({ ...prev, colorId: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter color"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                        <input
                            type="text"
                            value={newVariant.sizeId}
                            onChange={(e) => setNewVariant((prev) => ({ ...prev, sizeId: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter size"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
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
                            Save
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleAddVariant}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add
                        </button>
                    )}
                </div>

                {/* Variants Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">STT</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Color</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Size</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Quantity</th>
                                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productColorSizes.map((variant, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm text-gray-700 border-b">{index + 1}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700 border-b">{variant.colorId}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700 border-b">{variant.sizeId}</td>
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
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddVariants;