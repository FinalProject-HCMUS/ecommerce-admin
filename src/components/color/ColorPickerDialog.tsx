import React, { useEffect, useState } from 'react';
import { Color } from '../../types/color/Color';
import { getColors } from '../../apis/colorApi';
import { toast } from 'react-toastify';
import Pagination from '../common/Pagination';
import { X } from 'lucide-react';

interface ColorPickerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onPick: (color: Color) => void;
    colorsSelected: Color[];
}

const ITEMS_PER_PAGE = 8;

const ColorPickerDialog: React.FC<ColorPickerDialogProps> = ({ isOpen, onClose, onPick, colorsSelected }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [colors, setColors] = useState<Color[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const fetchColors = async (page: number) => {
        try {
            const response = await getColors(page - 1, ITEMS_PER_PAGE);
            if (!response.isSuccess) {
                toast.error(response.message, { autoClose: 1000 });
                return;
            }
            if (response.data) {
                setColors(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
            }
        } catch (error) {
            toast.error('Failed to fetch colors.', { autoClose: 1000 });
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchColors(currentPage);
        }
    }, [currentPage, isOpen]);

    const filteredColors = colors.filter((color) =>
        color.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedColorIds = new Set(colorsSelected.map(c => c.id));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-2">
                <div className="flex items-center justify-between mb-6 border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">Color Picker Dialog</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                {/* Search Input */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search color by name"
                    />
                </div>

                {/* Colors Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Color</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Color Code</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredColors.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="text-center py-6 text-gray-400">
                                        No colors found.
                                    </td>
                                </tr>
                            )}
                            {filteredColors.map((color) => {
                                const isAlreadySelected = selectedColorIds.has(color.id);
                                return (
                                    <tr
                                        key={color.id}
                                        className={`transition-colors duration-150 
                                            ${isAlreadySelected ? 'bg-blue-200 cursor-not-allowed opacity-60' : 'hover:bg-blue-200 cursor-pointer'}
                                            ${selectedId === color.id ? 'bg-blue-100' : ''}
                                        `}
                                        onClick={() => {
                                            if (isAlreadySelected) return;
                                            setSelectedId(color.id);
                                            setTimeout(() => {
                                                onPick(color);
                                                onClose();
                                            }, 120);
                                        }}
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap flex items-center">
                                            <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: color.code }}></div>
                                            <span className="ml-3 text-sm text-gray-900">{color.name}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{color.code}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination & Close */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default ColorPickerDialog;