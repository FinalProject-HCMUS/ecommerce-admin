import { useState } from "react";
import { Size } from "../../types/size/Size";
import { X } from "lucide-react";

interface SizeAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSize: (size: Size) => void;
}

const SizeAddModal: React.FC<SizeAddModalProps> = ({ isOpen, onClose, onAddSize }) => {
    const [size, setSize] = useState({ name: '', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 });
    const handleAdd = () => {
        onAddSize(size);
        onClose();
        setSize({ name: '', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 });
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setSize((prevSize) => ({
            ...prevSize,
            [name]: name === 'name' ? value : value === '' ? '' : Number(value),
        }));
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl mx-4">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-2xl font-semibold text-gray-800">Add size</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <div className="m-4 grid gap-4">
                    {/* Name Size Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name Size</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Size Name (e.g., S, M, L)"
                            value={size.name}
                            onChange={handleInputChange}
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
                            name="minHeight"
                            placeholder="Min Height (cm)"
                            value={size.minHeight}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Max Height Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Height</label>
                        <input
                            type="number"
                            name="maxHeight"
                            placeholder="Max Height (cm)"
                            value={size.maxHeight}
                            onChange={handleInputChange}
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
                            name="minWeight"
                            placeholder="Min Weight (kg)"
                            value={size.minWeight}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Max Weight Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Weight</label>
                        <input
                            type="number"
                            name="maxWeight"
                            placeholder="Max Weight (kg)"
                            value={size.maxWeight}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Confirm and Remove Buttons */}
                <div className="m-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
export default SizeAddModal;