import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Color } from '../../types/product/Color';

interface ColorAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddColor: (color: Color) => void;
}

const ColorAddModal: React.FC<ColorAddModalProps> = ({ isOpen, onClose, onAddColor }) => {
    const [color, setColor] = useState({ name: '', code: '' });

    const handleAdd = () => {
        onAddColor(color);
        onClose();
        setColor({ name: '', code: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">Add Color</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color Name</label>
                        <input
                            type="text"
                            placeholder="Color Name"
                            value={color.name}
                            onChange={(e) => setColor({ ...color, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color Code</label>
                        <input
                            type="text"
                            placeholder="Color Code (e.g., #FF5733)"
                            value={color.code}
                            onChange={(e) => setColor({ ...color, code: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 border rounded-full" style={{ backgroundColor: color.code }}></div>
                    </div>
                    <div className="flex justify-end space-x-2">
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
        </div>
    );
};

export default ColorAddModal;