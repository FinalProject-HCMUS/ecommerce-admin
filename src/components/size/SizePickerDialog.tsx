import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Pagination from '../common/Pagination';
import { Size } from '../../types/size/Size';
import { getSizes } from '../../apis/sizeApi';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SizePickerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onPick: (size: Size) => void;
}

const ITEMS_PER_PAGE = 8;

const SizePickerDialog: React.FC<SizePickerDialogProps> = ({ isOpen, onClose, onPick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sizes, setSizes] = useState<Size[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { t } = useTranslation('product');
    const fetchSizes = async (page: number) => {
        try {
            const response = await getSizes(page - 1, ITEMS_PER_PAGE);
            if (!response.isSuccess) {
                toast.error(response.message, { autoClose: 1000 });
                return;
            }
            if (response.data) {
                setSizes(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
            }
        } catch (error) {
            toast.error('Failed to fetch sizes.', { autoClose: 1000 });
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchSizes(currentPage);
        }
    }, [currentPage, isOpen]);

    const filteredSizes = sizes.filter((size) =>
        size.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-2">
                <div className="flex items-center justify-between mb-6 border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">{t("sizePicker")}</h2>
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
                        placeholder="Search size by name"
                    />
                </div>

                {/* Sizes Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("name")}</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("minHeight")}</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("maxHeight")}</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("minWeight")}</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("maxWeight")}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredSizes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400">
                                        {t("noSizeFound")}
                                    </td>
                                </tr>
                            )}
                            {filteredSizes.map((size) => (
                                <tr
                                    key={size.id}
                                    className={`transition-colors duration-150 hover:bg-blue-50 cursor-pointer ${selectedId === size.id ? 'bg-blue-100' : ''
                                        }`}
                                    onClick={() => {
                                        setSelectedId(size.id);
                                        setTimeout(() => {
                                            onPick(size);
                                            onClose();
                                        }, 120);
                                    }}
                                >
                                    <td className="px-4 py-3 text-sm text-gray-900">{size.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{size.minHeight}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{size.maxHeight}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{size.minWeight}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{size.maxWeight}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination & Close */}
                <div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default SizePickerDialog;