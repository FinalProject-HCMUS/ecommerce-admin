import React, { useState } from 'react';
import { Order, OrderDetail } from '../../types';
import MotionModalWrapper from '../common/MotionModal';
import { X } from 'lucide-react';

interface EditOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    orderDetails: OrderDetail[]; // Updated to match the new structure
    onSubmit: (updatedOrder: Order) => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ isOpen, onClose, order, orderDetails, onSubmit }) => {
    const [formData, setFormData] = useState(order);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <MotionModalWrapper>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-6xl mx-4">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800">Edit Order</h2>
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
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium">{detail.product.name}</h4>
                                            <p className="text-sm text-gray-500">Category: {detail.product.category}</p>
                                            <p className="text-sm text-gray-500">Price: ${detail.product.price.toFixed(2)}</p>
                                        </div>
                                        <div className="text-sm text-gray-500">x{detail.quantity}</div>
                                    </div>
                                ))}
                            </div>

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
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MotionModalWrapper>
    );
};

export default EditOrderModal;