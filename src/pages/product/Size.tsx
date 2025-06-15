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
import { Collapse, Slider } from "antd";
const { Panel } = Collapse;

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
    const navigate = useNavigate();
    const { t } = useTranslation('size');

    const fetchsizes = async (page: number, keysearch = '', minH = MIN_HEIGHT, maxH = MAX_HEIGHT, minW = MIN_WEIGHT, maxW = MAX_WEIGHT) => {
        const response = await getSizes(page - 1, ITEMS_PER_PAGE, keysearch, minH, maxH, minW, maxW);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        if (response.data) {
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
                    <h1 className="text-2xl font-semibold text-gray-900">{t('size')}</h1>
                </div>
                <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2 justify-between">
                    <div className="flex items-center space-x-4 gap-2">
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
                            <Collapse
                                bordered={false}
                                className="bg-white rounded-lg shadow min-w-[280px]"
                                expandIconPosition="end"
                                style={{ width: 300 }}
                            >
                                <Panel
                                    header={
                                        <span className="text-gray-900  text-base">
                                            {t('heightRange')}
                                        </span>
                                    }
                                    key="1"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-900 font-medium text-sm">
                                            {heightRange[0]} cm
                                        </span>
                                        <span className="text-gray-900 font-medium text-sm">
                                            {heightRange[1]} cm
                                        </span>
                                    </div>
                                    <Slider
                                        range
                                        min={MIN_HEIGHT}
                                        max={MAX_HEIGHT}
                                        value={heightRange}
                                        onChange={setHeightRange}
                                        tooltip={
                                            {
                                                formatter: value => `${value} cm`
                                            }}
                                        step={10}
                                        dotStyle={{ display: 'none' }}
                                    />
                                </Panel>
                            </Collapse>

                        </div>
                        {/* Weight Range Filter UI */}
                        <div className="bg-gray-100">
                            <Collapse
                                bordered={false}
                                className="bg-white rounded-lg shadow min-w-[280px]"
                                expandIconPosition="end"
                                style={{ width: 300 }}
                            >
                                <Panel
                                    header={
                                        <span className="text-gray-900  text-base">
                                            {t('weightRange')}
                                        </span>
                                    }
                                    key="1"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-900 font-medium text-sm">
                                            {weightRange[0]} kg
                                        </span>
                                        <span className="text-gray-900 font-medium text-sm">
                                            {weightRange[1]} kg
                                        </span>
                                    </div>
                                    <Slider
                                        range
                                        min={MIN_WEIGHT}
                                        max={MAX_WEIGHT}
                                        value={weightRange}
                                        onChange={setWeightRange}
                                        tooltip={
                                            {
                                                formatter: value => `${value} kg`
                                            }}
                                        step={10}
                                        dotStyle={{ display: 'none' }}
                                    />
                                </Panel>
                            </Collapse>
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
                <div className="bg-white rounded-lg shadow">
                    <SizeTable
                        refresh={refresh}
                        sizes={sizes}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default Sizes;