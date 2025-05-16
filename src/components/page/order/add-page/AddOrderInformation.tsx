import React from "react";
import MotionPageWrapper from "../../../common/MotionPage";
import { OrderCreatedRequest } from "../../../../types/order/OrderCreatedRequest";
import { useNavigate } from "react-router-dom";

interface Props {
    formData: OrderCreatedRequest;
    setFormData: React.Dispatch<React.SetStateAction<OrderCreatedRequest>>;
}

const AddOrderInformation: React.FC<Props> = ({ formData, setFormData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();;
    };
    const navigate = useNavigate();
    return (
        <MotionPageWrapper>
            <div className="bg-gray-100 p-8 h-full">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">Order Information</h1>
                </div>
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <p className="text-gray-600 mb-4 italic">Please fill in the customer information below.</p>
                    <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-6">
                        {/* Customer Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
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
                                    rows={2}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
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
                        </div>
                        {/* Actions */}
                        <div className="col-span-2 flex justify-end space-x-4 mt-6">
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
                                    navigate("/orders/add/product");
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Next
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MotionPageWrapper >
    );
};

export default AddOrderInformation;