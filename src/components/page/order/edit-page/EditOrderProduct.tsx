import React, { useEffect, useState } from "react";
import { OrderDetailResponse } from "../../../../types/order/OrderDetailResponse";
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
import { Order } from "../../../../types/order/Order";

interface Props {
    orderDetails: OrderDetailResponse[];
    setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetailResponse[]>>;
    formData: Order;
    setFormData: React.Dispatch<React.SetStateAction<Order>>;
}
const ITEMS_PER_PAGE = 6;
const EditOrderProduct: React.FC<Props> = ({ orderDetails, setOrderDetails, formData, setFormData }) => {
    //load product list
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product>({} as Product);
    const [isProductColorSizeDialogOpen, setIsProductColorSizeDialogOpen] = useState(false);
    const [productColorSizes, setProductColorSizes] = useState<ProductColorSize[]>([]);
    const navigate = useNavigate();
    const fetchProducts = async (page: number, keysearch = '') => {
        const response = await getProducts(page - 1, ITEMS_PER_PAGE, "createdAt,asc", '', keysearch);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        if (response.data) {
            setProducts(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        }
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
                id: "",
                orderId: formData.id,
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
                    toast.error("Limited quantity reached", { autoClose: 1000, position: 'top-right' });
                    return detail;
                }
                else {
                    setFormData((prev) => {
                        return { ...prev, productCost: prev.productCost + detail.unitPrice, total: prev.total + detail.unitPrice };

                    }
                    );
                    return { ...detail, quantity: detail.quantity + 1, total: detail.total + detail.unitPrice };
                }
            }
            return detail;
        }
        );
        setOrderDetails(updatedDetails);
    };

    const handleDecreaseQuantity = (itemId: string) => {
        const updatedDetails = orderDetails.map((detail) => {
            if (detail.itemId == itemId) {
                if (detail.quantity == 1) {
                    toast.error("Quantity must be at least 1", { autoClose: 1000, position: 'top-right' });
                    return detail;
                }
                else {
                    setFormData((prev) => {
                        return { ...prev, productCost: prev.productCost - detail.unitPrice, total: prev.total - detail.unitPrice };
                    }
                    );
                    return { ...detail, quantity: detail.quantity - 1, total: detail.total - detail.unitPrice };
                }
            }
            return detail;
        }
        );
        setOrderDetails(updatedDetails);
    };

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            toast.error("Quantity must be at least 1", { autoClose: 1000, position: 'top-right' });
            return;
        }
        const updatedDetails = orderDetails.map((detail) => {
            if (detail.itemId == itemId && newQuantity > detail.limitedQuantity) {
                toast.error("Limited quantity reached", { autoClose: 1000, position: 'top-right' });
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
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearch(searchInput.trim());
            setCurrentPage(1);
        }
    }
    return (
        <MotionPageWrapper>
            <div className="bg-gray-100 p-8 h-full">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">Choose Products</h1>
                </div>
                <div className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* show product list selected */}
                    <div className="col-span-2">
                        <div className="flex mb-4">
                            <div className="relative">
                                <input
                                    placeholder="Search products by name"
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
                        <ProductPickerDialog products={products} onProductSelect={handleProductSelect} />
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                    {/* Order Details */}
                    <div className="flex flex-col space-y-4 col-span-1 justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
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
                                            <p className="text-sm text-gray-500">Size: {detail.size.name}</p>
                                            <p className="text-sm text-gray-500">Color: {detail.color.name}</p>
                                        </div>
                                        <div className="text-sm font-medium">{detail.unitPrice.toFixed(2)}</div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => handleDecreaseQuantity(detail.itemId)}
                                                className="px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={detail.quantity}
                                                onChange={(e) => handleQuantityChange(detail.itemId, parseInt(e.target.value))}
                                                className="w-12 text-center border border-gray-300 rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleIncreaseQuantity(detail.itemId)}
                                                className="px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                                            >
                                                +
                                            </button>
                                        </div>
                                        {detail.id == "" && <button
                                            type="button"
                                            onClick={() => handleRemoveItem(detail.itemId)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={24} />
                                        </button>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            {/* Order Summary */}
                            <h3 className="text-lg font-semibold mb-4 ">Order Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Subtotal</span>
                                    <span className="text-sm font-medium">${formData.productCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Shipping Cost</span>
                                    <span className="text-sm font-medium">${formData.shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Total</span>
                                    <span className="text-lg font-semibold">${formData.total.toFixed(2)}</span>
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
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                navigate(`/orders/edit/${formData.id}/preview`);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>
        </MotionPageWrapper >
    );
};

export default EditOrderProduct;