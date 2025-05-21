import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import MotionPageWrapper from "../../components/common/MotionPage";
import Pagination from "../../components/common/Pagination";
import { toast } from "react-toastify";
import { Size } from "../../types/size/Size";
import { getSizes } from "../../apis/sizeApi";
import SizeTable from "../../components/size/SizeTable";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;
const MIN_HEIGHT = 10;
const MAX_HEIGHT = 220;
const MIN_WEIGHT = 20;
const MAX_WEIGHT = 200;
const Sizes = () => {
    const [sizes, setsizes] = useState<Size[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [heightRange, setHeightRange] = useState<[number, number]>([MIN_HEIGHT, MAX_HEIGHT]);
    const [weightRange, setWeightRange] = useState<[number, number]>([MIN_WEIGHT, MAX_WEIGHT]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation('size');

    const fetchsizes = async (page: number, keysearch = '', minH = MIN_HEIGHT, maxH = MAX_HEIGHT, minW = MIN_WEIGHT, maxW = MAX_WEIGHT) => {
        setLoading(true);
        const response = await getSizes(page - 1, ITEMS_PER_PAGE, keysearch, minH, maxH, minW, maxW);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        if (response.data) {
            setLoading(false);
            setsizes(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        }
    };

    useEffect(() => {
        fetchsizes(currentPage, search, heightRange[0], heightRange[1], weightRange[0], weightRange[1]);
    }, [currentPage, search, heightRange, weightRange]);

    const refresh = () => {
        fetchsizes(1, search, heightRange[0], heightRange[1]);
        setCurrentPage(1);
    };

    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setSearch(searchInput.trim());
            setCurrentPage(1);
        }
    };

    const handleHeightRangeChange = (index: 0 | 1, value: number) => {
        const newRange: [number, number] = [...heightRange];
        newRange[index] = value;
        // Ensure min <= max
        if (newRange[0] > newRange[1]) {
            if (index === 0) newRange[1] = newRange[0];
            else newRange[0] = newRange[1];
        }
        setHeightRange(newRange);
        setCurrentPage(1);
    };
    const handleWeightRangeChange = (index: 0 | 1, value: number) => {
        const newRange: [number, number] = [...weightRange];
        newRange[index] = value;
        // Ensure min <= max
        if (newRange[0] > newRange[1]) {
            if (index === 0) newRange[1] = newRange[0];
            else newRange[0] = newRange[1];
        }
        setWeightRange(newRange);
        setCurrentPage(1);
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{t('size')}</h1>
                </div>
                <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                    <div className="flex items-center space-x-4 gap-10">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchInput}
                                size={25}
                                onChange={e => setSearchInput(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder={t('search')}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                            >
                                <Search size={18} />
                            </button>
                        </div>
                        {/* Height Range Filter UI */}
                        <div className="bg-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('heightRange')}</span>
                                <span className="text-gray-500">{heightRange[0]} - {heightRange[1]} cm</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min={MIN_HEIGHT}
                                    max={MAX_HEIGHT}
                                    value={heightRange[0]}
                                    onChange={e => handleHeightRangeChange(0, Number(e.target.value))}
                                    className="w-full accent-blue-500"
                                />
                                <input
                                    type="range"
                                    min={MIN_HEIGHT}
                                    max={MAX_HEIGHT}
                                    value={heightRange[1]}
                                    onChange={e => handleHeightRangeChange(1, Number(e.target.value))}
                                    className="w-full accent-blue-500"
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-gray-500 text-sm">
                                <span>{MIN_HEIGHT} cm</span>
                                <span>{MAX_HEIGHT} cm</span>
                            </div>
                        </div>
                        {/* Weight Range Filter UI */}
                        <div className="bg-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('weightRange')}</span>
                                <span className="text-gray-500">{weightRange[0]} - {weightRange[1]} kg</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min={MIN_WEIGHT}
                                    max={MAX_WEIGHT}
                                    value={weightRange[0]}
                                    onChange={e => handleWeightRangeChange(0, Number(e.target.value))}
                                    className="w-full accent-blue-500"
                                />
                                <input
                                    type="range"
                                    min={MIN_WEIGHT}
                                    max={MAX_WEIGHT}
                                    value={weightRange[1]}
                                    onChange={e => handleWeightRangeChange(1, Number(e.target.value))}
                                    className="w-full accent-blue-500"
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-gray-500 text-sm">
                                <span>{MIN_WEIGHT} kg</span>
                                <span>{MAX_WEIGHT} kg</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/sizes/add')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-sizes"
                    >
                        <Plus size={20} />
                        <span>{t('addSize')}</span>
                    </button>
                </div>
                <div className="bg-white rounded-2xl shadow-lg">
                    {loading ? <div className="flex justify-center items-center h-[400px]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                    </div> : <>
                        <SizeTable
                            refresh={refresh}
                            sizes={sizes}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>}
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default Sizes;