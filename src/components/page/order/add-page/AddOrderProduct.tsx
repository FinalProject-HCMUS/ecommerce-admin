import React, { useEffect, useState } from "react";
import MotionPageWrapper from "../../../common/MotionPage";
import { useNavigate } from "react-router-dom";
import { Product } from "../../../../types/product/Product";
import ProductPickerDialog from "../../../product/ProductPickerDialog";
import Pagination from "../../../common/Pagination";
import { getProducts } from "../../../../apis/productApi";
import { toast } from "react-toastify";
import { ProductColorSize } from "../../../../types/product/ProductColorSize";
import ProductColorSizeDialog from "../../../product/ProductColorSizeDialog";
import { Search, X } from "lucide-react";
import { OrderCreatedRequest } from "../../../../types/order/OrderCreatedRequest";
import { OrderDetailCreatedUI } from "../../../../types/order/OrderDetailCreatedUI";
import { useTranslation } from "react-i18next";
import { formatProductCost } from "../../../../utils/currency";

interface Props {
    orderDetails: OrderDetailCreatedUI[];
    setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetailCreatedUI[]>>;
    formData: OrderCreatedRequest;
    setFormData: React.Dispatch<React.SetStateAction<OrderCreatedRequest>>;
}
const ITEMS_PER_PAGE = 6;
const VND_TO_USD = import.meta.env.VITE_VND_TO_USD;
const AddOrderProduct: React.FC<Props> = ({ orderDetails, setOrderDetails, formData, setFormData }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product>({} as Product);
    const [isProductColorSizeDialogOpen, setIsProductColorSizeDialogOpen] = useState(false);
    const [productColorSizes, setProductColorSizes] = useState<ProductColorSize[]>([]);
    const [loading, setLoading] = useState(false);
    const [quantityInputs, setQuantityInputs] = useState<{ [key: string]: string }>({});
    const { t, i18n } = useTranslation("order");
    const navigate = useNavigate();
    const fetchProducts = async (page: number, keysearch = '') => {
        setLoading(true);
        const response = await getProducts(page - 1, ITEMS_PER_PAGE, "createdAt,asc", '', keysearch);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            setLoading(false);
            return;
        }
        if (response.data) {
            setProducts(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts(currentPage, search);
    }, [currentPage, search]);
    useEffect(() => {
        const newProductColorSizes: ProductColorSize[] = orderDetails.map((detail) => ({
            id: detail.itemId,
            color: detail.color,
            productId: detail.product.id,
            size: detail.size,
            quantity: detail.limitedQuantity,
        }));
        setProductColorSizes(newProductColorSizes);
    }, [])
    const handleProductSelect = (product: Product) => {
        //show product color size dialog
        setIsProductColorSizeDialogOpen(true);
        setSelectedProduct(product);
    }
    const handlePickPoroductColorSize = (productColorSize: ProductColorSize) => {
        setProductColorSizes((prev) => { return [...prev, productColorSize]; });
        setOrderDetails((prev) => {
            return [...prev,
            {
                product: selectedProduct, itemId: productColorSize.id, unitPrice: selectedProduct.price, quantity: 1, color: productColorSize.color
                , size: productColorSize.size, productColorSizeId: productColorSize.id, productCost: selectedProduct.cost, total: selectedProduct.price,
                limitedQuantity: productColorSize.quantity
            }];
        });
        setFormData((prev) => {
            return { ...prev, productCost: prev.productCost + selectedProduct.price, total: prev.total + selectedProduct.price };
        }
        );
    }
    const handleRemoveItem = (itemId: string) => {
        setFormData((prev) => {
            const removedProduct = orderDetails.find((detail) => detail.itemId === itemId);
            if (removedProduct) {
                return { ...prev, productCost: prev.productCost - removedProduct.unitPrice * removedProduct.quantity, total: prev.total - removedProduct.quantity * removedProduct.unitPrice };
            }
            return prev;
        }
        );
        const updatedDetails = orderDetails.filter((detail) => detail.itemId !== itemId);
        setOrderDetails(updatedDetails);
        setProductColorSizes((prev) => prev.filter((colorSize) => colorSize.id !== itemId));
    };

    const handleIncreaseQuantity = (itemId: string) => {
        const updatedDetails = orderDetails.map((detail) => {
            if (detail.itemId == itemId) {
                if (detail.limitedQuantity == detail.quantity) {
                    toast.error(t("limitedQuantity"), { autoClose: 1000, position: 'top-right' });
                    return detail;
                }
                else {
                    setFormData((prev) => {
                        return { ...prev, productCost: prev.productCost + detail.unitPrice, total: prev.total + detail.unitPrice };
                    });

                    // Update the input state as well
                    setQuantityInputs(prev => ({
                        ...prev,
                        [itemId]: (detail.quantity + 1).toString()
                    }));

                    return { ...detail, quantity: detail.quantity + 1, total: detail.total + detail.unitPrice };
                }
            }
            return detail;
        });
        setOrderDetails(updatedDetails);
    };

    const handleDecreaseQuantity = (itemId: string) => {
        const updatedDetails = orderDetails.map((detail) => {
            if (detail.itemId == itemId) {
                if (detail.quantity == 1) {
                    toast.error(t("quantityAtLeast"), { autoClose: 1000, position: 'top-right' });
                    return detail;
                }
                else {
                    setFormData((prev) => {
                        return { ...prev, productCost: prev.productCost - detail.unitPrice, total: prev.total - detail.unitPrice };
                    });
                    // Update the input state as well
                    setQuantityInputs(prev => ({
                        ...prev,
                        [itemId]: (detail.quantity - 1).toString()
                    }));

                    return { ...detail, quantity: detail.quantity - 1, total: detail.total - detail.unitPrice };
                }
            }
            return detail;
        });
        setOrderDetails(updatedDetails);
    };

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        // Handle empty or invalid input
        if (isNaN(newQuantity) || newQuantity < 1) {
            toast.error(t("quantityAtLeast"), { autoClose: 1000, position: 'top-right' });
            return;
        }

        const updatedDetails = orderDetails.map((detail) => {
            if (detail.itemId == itemId && newQuantity > detail.limitedQuantity) {
                toast.error(t("limitedQuantity"), { autoClose: 1000, position: 'top-right' });
                return detail;
            }
            if (detail.itemId == itemId && newQuantity <= detail.limitedQuantity) {
                setFormData((prev) => {
                    return { ...prev, productCost: prev.productCost - detail.unitPrice * detail.quantity + detail.unitPrice * newQuantity, total: prev.total - detail.unitPrice * detail.quantity + detail.unitPrice * newQuantity };
                }
                );
            }
            return detail.itemId === itemId && detail.limitedQuantity >= newQuantity
                ? { ...detail, quantity: newQuantity, total: newQuantity * detail.unitPrice }
                : detail
        }
        );
        setOrderDetails(updatedDetails);
    };

    // Add new function to handle input changes
    const handleQuantityInputChange = (itemId: string, value: string) => {
        // Update local input state
        setQuantityInputs(prev => ({
            ...prev,
            [itemId]: value
        }));

        // If value is empty, don't update the main state yet
        if (value === '') {
            return;
        }
        // Check if the value is a valid number
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue >= 1) {
            handleQuantityChange(itemId, numValue);
        }
    };

    const handleQuantityInputBlur = (itemId: string, currentQuantity: number) => {
        const inputValue = quantityInputs[itemId];

        // If input is empty or invalid, reset to current quantity
        if (!inputValue || isNaN(parseInt(inputValue)) || parseInt(inputValue) < 1) {
            setQuantityInputs(prev => ({
                ...prev,
                [itemId]: currentQuantity.toString()
            }));
        }
    };

    const handleQuantityInputFocus = (itemId: string, currentQuantity: number) => {
        // Initialize input state if not exists
        if (!quantityInputs[itemId]) {
            setQuantityInputs(prev => ({
                ...prev,
                [itemId]: currentQuantity.toString()
            }));
        }
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearch(searchInput.trim());
            setCurrentPage(1);
        }
    }
    const handleNextStep = () => {
        if (orderDetails.length === 0) {
            toast.error(t("orderMustHaveProduct"), { autoClose: 1000, position: "top-right" });
            return;
        }
        navigate("/orders/add/preview");
    }
    return (
        <MotionPageWrapper>
            <div className="bg-gray-100 p-8 h-full">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{t('chooseProduct')}</h1>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* show product list selected */}
                    <div className="col-span-2">
                        <div className="flex mb-4">
                            <div className="relative">
                                <input
                                    placeholder={t('placeHolder')}
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    className="border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => {
                                        setSearch(searchInput.trim());
                                        setCurrentPage(1);
                                    }}
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"

                                >
                                    <Search size={18} />
                                </button>
                            </div>
                        </div>
                        {loading ? <div className="flex justify-center items-center h-[400px]">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                        </div> : <><ProductPickerDialog products={products} onProductSelect={handleProductSelect} />
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </>}
                    </div>
                    {/* Order Details */}
                    <div className="flex flex-col space-y-4 col-span-1 justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{t('orderDetail')}</h3>
                            <div className="space-y-4 max-h-[420px] overflow-y-auto">
                                {orderDetails.map((detail) => (
                                    <div key={detail.itemId} className="flex items-center space-x-4">
                                        <img
                                            src={detail.product.mainImageUrl || './images/sample.png'}
                                            alt={detail.product.name}
                                            className="w-16 h-16 object-contain rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium">{detail.product.name}</h4>
                                            <p className="text-sm text-gray-500">{t('size')}: {detail.size.name}</p>
                                            <p className="text-sm text-gray-500">{t('color')}: {detail.color.name}</p>
                                        </div>
                                        <div className="text-sm font-medium">{formatProductCost(detail.unitPrice)}</div>
                                        <div className="flex items-center bg-gray-300 rounded-full px-2 py-1">
                                            <button
                                                type="button"
                                                onClick={() => handleDecreaseQuantity(detail.itemId)}
                                                className="px-2 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={quantityInputs[detail.itemId] ?? detail.quantity}
                                                onChange={(e) => handleQuantityInputChange(detail.itemId, e.target.value)}
                                                onBlur={() => handleQuantityInputBlur(detail.itemId, detail.quantity)}
                                                onFocus={() => handleQuantityInputFocus(detail.itemId, detail.quantity)}
                                                min="1"
                                                max={detail.limitedQuantity}
                                                className="w-12 text-center border border-gray-300 rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleIncreaseQuantity(detail.itemId)}
                                                className="px-2 py-1 rounded-lg hover:bg-gray-400"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(detail.itemId)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            {/* Order Summary */}
                            <h3 className="text-lg font-semibold mb-4 ">{t('orderSummary')}</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">{t('subtotal')}</span>
                                    <span className="text-sm font-medium">{formatProductCost(formData.productCost)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">{t('shippingCost')}</span>
                                    <span className="text-sm font-medium">{formatProductCost(formData.shippingCost)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">{t('total')}</span>
                                    <span className="text-lg font-semibold">{formatProductCost(formData.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <ProductColorSizeDialog isOpen={isProductColorSizeDialogOpen}
                            productId={selectedProduct.id} onPick={handlePickPoroductColorSize}
                            productColorSizesSelected={productColorSizes}
                            onClose={() => {
                                setIsProductColorSizeDialogOpen(false);
                            }
                            }
                        />
                    </div>
                    <div className="col-span-3 flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            {t('back')}
                        </button>
                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {t('next')}
                        </button>
                    </div>
                </div>

            </div>
        </MotionPageWrapper >
    );
};

export default AddOrderProduct;