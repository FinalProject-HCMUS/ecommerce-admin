import React, { useState } from 'react';
import { OrderDetail, Product } from '../../types';
import MotionModalWrapper from '../common/MotionModal';
import ProductSelectionModal from './ProductSelectionModal';
import { X } from 'lucide-react';
import { Order } from '../../types/order/Order';

interface AddOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newOrder: Order) => void;
    products: Product[];
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({ isOpen, onClose, onSubmit, products }) => {
    const [formData, setFormData] = useState<Order>();
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddProducts = (selectedProducts: Product[]) => {
        const updatedDetails = [...orderDetails];

        selectedProducts.forEach((product) => {
            const existingDetail = updatedDetails.find((detail) => detail.product.id === product.id);
            if (existingDetail) {
                existingDetail.quantity += 1;
                existingDetail.total += product.price;
            } else {
                updatedDetails.push({
                    id: `${Date.now()}`,
                    product_cost: product.price,
                    quantity: 1,
                    unit_price: product.price,
                    total: product.price,
                    product,
                    order_id: '',
                });
            }
        });

        setOrderDetails(updatedDetails);
        updateOrderSummary(updatedDetails);
    };

    const handleRemoveProduct = (productId: string) => {
        const updatedDetails = orderDetails.filter((detail) => detail.product.id !== productId);
        setOrderDetails(updatedDetails);
        updateOrderSummary(updatedDetails);
    };

    const handleIncreaseQuantity = (productId: string) => {
        const updatedDetails = orderDetails.map((detail) =>
            detail.product.id === productId
                ? { ...detail, quantity: detail.quantity + 1, total: detail.total + detail.unit_price }
                : detail
        );
        setOrderDetails(updatedDetails);
        updateOrderSummary(updatedDetails);
    };

    const handleDecreaseQuantity = (productId: string) => {
        const updatedDetails = orderDetails.map((detail) =>
            detail.product.id === productId && detail.quantity > 1
                ? { ...detail, quantity: detail.quantity - 1, total: detail.total - detail.unit_price }
                : detail
        );
        setOrderDetails(updatedDetails);
        updateOrderSummary(updatedDetails);
    };

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return; // Prevent quantity less than 1
        const updatedDetails = orderDetails.map((detail) =>
            detail.product.id === productId
                ? { ...detail, quantity: newQuantity, total: newQuantity * detail.unit_price }
                : detail
        );
        setOrderDetails(updatedDetails);
        updateOrderSummary(updatedDetails);
    };

    const updateOrderSummary = (details: OrderDetail[]) => {
        const productCost = details.reduce((sum, detail) => sum + detail.total, 0);
        const total = productCost + formData.shipping_cost;
        setFormData((prev) => ({
            ...prev,
            product_cost: productCost,
            sub_total: total,
            total,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, id: `${Date.now()}` });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <MotionModalWrapper>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-6xl mx-4">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800">Add New Order</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                <select
                                    name="payment_method"
                                    value={formData.payment_method}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="COD">Cash on Delivery</option>
                                    <option value="VN_PAY">VN Pay</option>
                                    <option value="MOMO">Momo</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="NEW">New</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="PACKAGED">Packaged</option>
                                    <option value="PICKED">Picked</option>
                                    <option value="SHIPPING">Shipping</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="REFUNDED">Refunded</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                            {/* Order Summary */}
                            <div className="col-span-2">
                                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Subtotal</span>
                                        <span className="text-sm font-medium">${formData.product_cost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Shipping Cost</span>
                                        <span className="text-sm font-medium">${formData.shipping_cost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Total</span>
                                        <span className="text-lg font-semibold">${formData.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                            <div className="space-y-4">
                                {orderDetails.map((detail) => (
                                    <div key={detail.id} className="flex items-center space-x-4">
                                        <img
                                            src={detail.product.main_image_url || './images/sample.png'}
                                            alt={detail.product.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium">{detail.product.name}</h4>
                                            <p className="text-sm text-gray-500">Size: Large</p>
                                            <p className="text-sm text-gray-500">Color: White</p>
                                        </div>
                                        <div className="text-sm font-medium">${detail.unit_price.toFixed(2)}</div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => handleDecreaseQuantity(detail.product.id)}
                                                className="px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={detail.quantity}
                                                onChange={(e) => handleQuantityChange(detail.product.id, parseInt(e.target.value, 10))}
                                                className="w-12 text-center border border-gray-300 rounded-lg"
                                                min="1"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleIncreaseQuantity(detail.product.id)}
                                                className="px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProduct(detail.product.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsProductModalOpen(true)}
                                className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                + Add Product
                            </button>

                        </div>


                        {/* Actions */}
                        <div className="col-span-2 flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {isProductModalOpen && (
                <ProductSelectionModal
                    isOpen={isProductModalOpen}
                    onClose={() => setIsProductModalOpen(false)}
                    products={products}
                    onSelect={handleAddProducts}
                />
            )}
        </MotionModalWrapper>
    );
};

export default AddOrderModal;